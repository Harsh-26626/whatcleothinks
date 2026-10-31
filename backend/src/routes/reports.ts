import { Router, Response, NextFunction } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { requireAuth } from '../auth.js';
import { AuthenticatedRequest, ChatType } from '../types.js';
import { extractTextFromFileBuffer, parseChat } from '../parser.js';
import { runJob } from '../jobs.js';

export const reportsRouter = Router();

const maxUploadMb = parseInt(process.env.MAX_UPLOAD_MB || '20', 10);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: maxUploadMb * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const name = file.originalname.toLowerCase();
    if (name.endsWith('.txt') || name.endsWith('.zip') || file.mimetype === 'text/plain' || file.mimetype.includes('zip')) {
      cb(null, true);
    } else {
      cb(new Error('unsupported_file'));
    }
  },
});

reportsRouter.post(
  '/',
  requireAuth,
  upload.single('file'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let rawText: string | null = null;
    let parsedMessages: any = null;

    try {
      const userId = req.userId!;
      const { chatType, persona = 'cleo', myName, consent } = req.body;

      // 1. Consent check
      if (consent !== 'true') {
        return res.status(400).json({
          error: 'no_consent',
          message: 'Consent is required to generate a report.',
        });
      }

      // 2. Chat type validation
      const validTypes: ChatType[] = ['romance', 'friends', 'group'];
      if (!validTypes.includes(chatType)) {
        return res.status(400).json({
          error: 'invalid_chat_type',
          message: 'Chat type must be romance, friends, or group.',
        });
      }

      // 3. File existence check
      if (!req.file) {
        return res.status(400).json({
          error: 'unsupported_file',
          message: 'Please upload a valid .txt or .zip WhatsApp export file.',
        });
      }

      // 4. Extract and parse
      try {
        rawText = extractTextFromFileBuffer(req.file.buffer, req.file.originalname);
      } catch (_err) {
        return res.status(400).json({
          error: 'unsupported_file',
          message: 'Could not read archive file. Please upload a valid .txt or .zip file.',
        });
      }

      let parsed;
      try {
        parsed = parseChat(rawText);
      } catch (err: any) {
        if (err.message === 'too_short') {
          return res.status(400).json({
            error: 'too_short',
            message: 'Chat must contain at least 50 messages after cleaning.',
          });
        }
        return res.status(400).json({
          error: 'parse_failed',
          message: 'Failed to parse chat export. Ensure it is a valid WhatsApp chat.',
        });
      }

      // 5. myName check
      if (!myName || !parsed.participants.includes(myName)) {
        return res.status(400).json({
          error: 'invalid_my_name',
          message: 'Please select a participant name that matches one in the chat.',
        });
      }

      // 6. Create row in DB
      const report = await prisma.report.create({
        data: {
          userId,
          chatType: chatType as ChatType,
          persona,
          status: 'queued',
          stage: 'queued',
          participants: parsed.participants.map((name) => ({
            name,
            isMe: name === myName,
          })),
          dateRange: parsed.dateRange,
        },
      });

      // 7. Start background job (do not await, always catch)
      parsedMessages = parsed.messages;
      runJob(report.id, parsedMessages, {
        userId,
        chatType: chatType as ChatType,
        personaId: persona,
        myName,
        participants: parsed.participants,
      }).catch((err) => {
        console.error('[Async Job Unhandled]', err?.message || 'Unknown error');
      });

      // 8. Respond 202 immediately
      return res.status(202).json({ id: report.id });
    } catch (err: any) {
      if (err.message === 'unsupported_file') {
        return res.status(400).json({
          error: 'unsupported_file',
          message: 'Unsupported file type. Please upload a .txt or .zip file.',
        });
      }
      next(err);
    } finally {
      // Memory cleanup: Never retain raw chat text or buffer
      rawText = null;
      parsedMessages = null;
      if (req.file) {
        (req.file as any).buffer = null;
      }
    }
  }
);

reportsRouter.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const reports = await prisma.report.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        chatType: true,
        persona: true,
        status: true,
        stage: true,
        participants: true,
        dateRange: true,
        createdAt: true,
      },
    });

    return res.status(200).json(reports);
  } catch (err) {
    next(err);
  }
});

reportsRouter.get('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const report = await prisma.report.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!report) {
      return res.status(404).json({
        error: 'not_found',
        message: 'Report not found.',
      });
    }

    return res.status(200).json({
      id: report.id,
      title: report.title,
      chatType: report.chatType,
      persona: report.persona,
      status: report.status,
      stage: report.stage,
      errorCode: report.errorCode,
      createdAt: report.createdAt.toISOString(),
      completedAt: report.completedAt ? report.completedAt.toISOString() : null,
      participants: report.participants,
      dateRange: report.dateRange,
      stats: report.stats,
      monthly: report.monthly,
      narrative: report.narrative,
    });
  } catch (err) {
    next(err);
  }
});

reportsRouter.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const existing = await prisma.report.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!existing) {
      return res.status(404).json({
        error: 'not_found',
        message: 'Report not found.',
      });
    }

    await prisma.report.delete({
      where: { id },
    });

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
});
