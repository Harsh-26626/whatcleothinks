import AdmZip from 'adm-zip';
import { Message } from './types.js';

export interface ParseResult {
  messages: Message[];
  participants: string[];
  dateRange: { start: string; end: string };
  isGroup: boolean;
}

// Regex to test Android or iPhone header
// Normalises U+202F to standard space, strips U+200E and U+200F
export function normalizeText(text: string): string {
  return text
    .replace(/[\u200E\u200F]/g, '')
    .replace(/\u202F/g, ' ')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
}

export function extractTextFromFileBuffer(buffer: Buffer, originalName?: string): string {
  // Check if buffer is a zip (starts with 'PK\x03\x04') or filename ends with .zip
  const isZip = (originalName && originalName.toLowerCase().endsWith('.zip')) ||
    (buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04);

  if (isZip) {
    try {
      const zip = new AdmZip(buffer);
      const zipEntries = zip.getEntries();
      const txtEntry = zipEntries.find((entry) => !entry.isDirectory && entry.entryName.toLowerCase().endsWith('.txt'));
      if (!txtEntry) {
        throw new Error('No .txt file found inside zip archive');
      }
      return normalizeText(txtEntry.getData().toString('utf-8'));
    } catch (err: any) {
      throw new Error(err.message || 'Failed to extract text from zip archive');
    }
  }

  return normalizeText(buffer.toString('utf-8'));
}

interface RawLineMatch {
  lineIndex: number;
  n1: number;
  n2: number;
  year: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPm: boolean | null;
  sender: string | null;
  body: string;
}

const SYSTEM_PATTERNS = [
  /<media omitted>/i,
  /image omitted/i,
  /sticker omitted/i,
  /video omitted/i,
  /audio omitted/i,
  /gif omitted/i,
  /this message was deleted/i,
  /you deleted this message/i,
  /^null$/i,
];

export function isSystemMessage(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return true;
  return SYSTEM_PATTERNS.some((pattern) => pattern.test(trimmed));
}

export function parseChat(rawContent: string): ParseResult {
  const cleaned = normalizeText(rawContent);
  const lines = cleaned.split('\n');

  // Match Android:
  // "12/03/24, 9:41 pm - Name: message" or "12/03/2024, 21:41 - Name: message"
  const androidRegex = /^(\d{1,4})[./-](\d{1,4})[./-](\d{2,4}),?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s*([aApP][mM]))?\s*[-–]\s*(.+)$/;

  // Match iPhone:
  // "[12/03/24, 9:41:22 PM] Name: message" or "[12/03/2024, 21:41:22] Name: message"
  const iphoneRegex = /^\[(\d{1,4})[./-](\d{1,4})[./-](\d{2,4}),?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s*([aApP][mM]))?\]\s*(.+)$/;

  interface CandidateLine {
    n1: number;
    n2: number;
    year: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPm: boolean | null;
    rest: string;
  }

  const parsedLines: { candidate?: CandidateLine; raw: string }[] = [];
  let hasFirstGt12 = false;
  let hasSecondGt12 = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let match = line.match(androidRegex);
    if (!match) {
      match = line.match(iphoneRegex);
    }

    if (match) {
      const n1 = parseInt(match[1], 10);
      const n2 = parseInt(match[2], 10);
      let year = parseInt(match[3], 10);
      if (year < 100) {
        year += 2000;
      }
      const hours = parseInt(match[4], 10);
      const minutes = parseInt(match[5], 10);
      const seconds = match[6] ? parseInt(match[6], 10) : 0;
      const ampm = match[7] ? match[7].toLowerCase() : null;
      const rest = match[8];

      if (n1 > 12) hasFirstGt12 = true;
      if (n2 > 12) hasSecondGt12 = true;

      parsedLines.push({
        candidate: {
          n1,
          n2,
          year,
          hours,
          minutes,
          seconds,
          isPm: ampm === 'pm' ? true : ampm === 'am' ? false : null,
          rest,
        },
        raw: line,
      });
    } else {
      parsedLines.push({ raw: line });
    }
  }

  // Date order resolution:
  // If any first number is >12, use DD/MM.
  // If any second number is >12, use MM/DD.
  // If ambiguous, default to DD/MM (India).
  const isDayFirst = hasFirstGt12 || !hasSecondGt12;

  const rawMessages: { ts: Date; sender: string; text: string }[] = [];
  let currentMsg: { ts: Date; sender: string; text: string } | null = null;

  for (const item of parsedLines) {
    if (item.candidate) {
      if (currentMsg) {
        rawMessages.push(currentMsg);
        currentMsg = null;
      }

      const c = item.candidate;
      const day = isDayFirst ? c.n1 : c.n2;
      const month = isDayFirst ? c.n2 : c.n1;

      // Validate day & month
      if (month < 1 || month > 12 || day < 1 || day > 31) {
        // Not a valid date, treat as continuation of previous line if exists
        if (rawMessages.length > 0) {
          rawMessages[rawMessages.length - 1].text += '\n' + item.raw;
        }
        continue;
      }

      let hour = c.hours;
      if (c.isPm !== null) {
        if (c.isPm && hour < 12) hour += 12;
        if (!c.isPm && hour === 12) hour = 0;
      }

      const dateUtc = new Date(Date.UTC(c.year, month - 1, day, hour, c.minutes, c.seconds));

      // Check if candidate.rest contains "Sender: text"
      // Note: Sender name cannot contain a colon at the very beginning,
      // but system messages like "Messages and calls are end-to-end encrypted..." have no colon.
      const colonIndex = c.rest.indexOf(': ');
      if (colonIndex <= 0) {
        // System notification line, ignore/drop
        continue;
      }

      const sender = c.rest.substring(0, colonIndex).trim();
      const text = c.rest.substring(colonIndex + 2);

      // Check for WhatsApp system notices that masquerade as senders or omitted media
      if (!sender) continue;

      currentMsg = {
        ts: dateUtc,
        sender,
        text,
      };
    } else {
      // Continuation of previous line (multi-line)
      if (currentMsg) {
        currentMsg.text += '\n' + item.raw;
      } else if (rawMessages.length > 0) {
        rawMessages[rawMessages.length - 1].text += '\n' + item.raw;
      }
    }
  }

  if (currentMsg) {
    rawMessages.push(currentMsg);
  }

  // Filter system messages and empty messages
  const filteredMessages: Message[] = [];
  let nextId = 0;

  for (const msg of rawMessages) {
    const trimmedText = msg.text.trim();
    if (!trimmedText) continue;
    if (isSystemMessage(trimmedText)) continue;

    filteredMessages.push({
      id: nextId++,
      ts: msg.ts,
      sender: msg.sender,
      text: trimmedText,
    });
  }

  if (filteredMessages.length < 50) {
    throw new Error('too_short');
  }

  // Find distinct participants
  const senderCounts: Record<string, number> = {};
  for (const m of filteredMessages) {
    senderCounts[m.sender] = (senderCounts[m.sender] || 0) + 1;
  }

  const participants = Object.keys(senderCounts).sort(
    (a, b) => senderCounts[b] - senderCounts[a]
  );
  const isGroup = participants.length > 2;

  const firstMsg = filteredMessages[0];
  const lastMsg = filteredMessages[filteredMessages.length - 1];

  const formatDate = (d: Date) => {
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  return {
    messages: filteredMessages,
    participants,
    dateRange: {
      start: formatDate(firstMsg.ts),
      end: formatDate(lastMsg.ts),
    },
    isGroup,
  };
}

