import fs from 'fs';
import { extractTextFromFileBuffer, parseChat } from './parser.js';
import { computeStats, computeMonthlyStats } from './stats.js';

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: npm run debug:stats -- <path/to/chat.txt|chat.zip>');
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const startTime = Date.now();
  const fileBuffer = fs.readFileSync(filePath);
  const text = extractTextFromFileBuffer(fileBuffer, filePath);
  const parsed = parseChat(text);
  const stats = computeStats(parsed.messages, parsed.participants);
  const monthly = computeMonthlyStats(parsed.messages, parsed.participants);
  const durationMs = Date.now() - startTime;

  const output = {
    messageCount: parsed.messages.length,
    participants: parsed.participants,
    dateRange: parsed.dateRange,
    isGroup: parsed.isGroup,
    durationMs,
    stats,
    monthly,
  };

  console.log(JSON.stringify(output, null, 2));
}

main().catch((err) => {
  console.error('[Debug Error]', err?.message || 'Failed to compute stats');
  process.exit(1);
});

