import { prisma } from './prisma.js';
import { Message, ChatType } from './types.js';
import { computeStats, computeMonthlyStats } from './stats.js';
import { runPipeline } from './pipeline.js';

export interface JobMeta {
  userId: string;
  chatType: ChatType;
  personaId: string;
  myName: string;
  participants: string[];
}

export async function cleanupInterruptedJobs(): Promise<void> {
  try {
    const result = await prisma.report.updateMany({
      where: {
        status: { in: ['queued', 'processing'] },
      },
      data: {
        status: 'failed',
        errorCode: 'interrupted',
        stage: 'failed',
      },
    });
    if (result.count > 0) {
      console.log(`[Startup] Marked ${result.count} interrupted report(s) as failed.`);
    }
  } catch (err: any) {
    console.error('[Startup] Failed to clean up interrupted jobs:', err?.message || 'DB error');
  }
}

export async function runJob(
  reportId: string,
  rawMessages: Message[] | null,
  meta: JobMeta
): Promise<void> {
  let messages: Message[] | null = rawMessages;

  try {
    // 1. Set status = processing, stage = computing_stats
    await prisma.report.update({
      where: { id: reportId },
      data: {
        status: 'processing',
        stage: 'computing_stats',
      },
    });

    if (!messages || messages.length === 0) {
      throw new Error('too_short');
    }

    // Apply limits: at most 40,000 messages and at most last 12 months
    if (messages.length > 40000) {
      messages = messages.slice(-40000);
    }

    const lastMsg = messages[messages.length - 1];
    const lastDate = lastMsg.ts;
    const twelveMonthsAgo = new Date(
      Date.UTC(lastDate.getUTCFullYear() - 1, lastDate.getUTCMonth(), lastDate.getUTCDate())
    );

    const filtered = messages.filter((m) => m.ts >= twelveMonthsAgo);
    if (filtered.length >= 50) {
      messages = filtered;
    }

    const firstMsg = messages[0];
    const actualDateRange = {
      start: `${firstMsg.ts.getUTCFullYear()}-${String(firstMsg.ts.getUTCMonth() + 1).padStart(2, '0')}-${String(firstMsg.ts.getUTCDate()).padStart(2, '0')}`,
      end: `${lastMsg.ts.getUTCFullYear()}-${String(lastMsg.ts.getUTCMonth() + 1).padStart(2, '0')}-${String(lastMsg.ts.getUTCDate()).padStart(2, '0')}`,
    };

    // 2. Compute stats and monthly stats
    const stats = computeStats(messages, meta.participants);
    const monthly = computeMonthlyStats(messages, meta.participants);

    // 3. Run Pipeline (Map -> Reduce -> Quote resolution)
    const pipelineResult = await runPipeline(
      messages,
      stats,
      monthly,
      {
        chatType: meta.chatType,
        personaId: meta.personaId,
        myName: meta.myName,
        participants: meta.participants,
      },
      async (newStage: string) => {
        await prisma.report.update({
          where: { id: reportId },
          data: { stage: newStage },
        });
      }
    );

    // 4. Mark done
    const participantObjects = meta.participants.map((name) => ({
      name,
      isMe: name === meta.myName,
    }));

    await prisma.report.update({
      where: { id: reportId },
      data: {
        status: 'done',
        stage: 'done',
        title: pipelineResult.title,
        participants: participantObjects,
        dateRange: actualDateRange,
        stats: stats as any,
        monthly: pipelineResult.monthly as any,
        narrative: pipelineResult.narrative as any,
        completedAt: new Date(),
      },
    });
  } catch (err: any) {
    const errorCode = err?.message === 'too_short' ? 'too_short' : err?.message === 'llm_failed' ? 'llm_failed' : 'processing_failed';
    // Strictly never log messages or prompt in error log
    console.error(`[Job Error] Report ${reportId} failed with code: ${errorCode}`);

    try {
      await prisma.report.update({
        where: { id: reportId },
        data: {
          status: 'failed',
          stage: 'failed',
          errorCode,
        },
      });
    } catch (_dbErr) {
      // Ignore secondary DB error
    }
  } finally {
    // Explicitly dereference messages array to allow immediate garbage collection
    messages = null;
    rawMessages = null;
  }
}

