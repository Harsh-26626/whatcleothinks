import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export type ChatType = 'romance' | 'friends' | 'group';

export interface Message {
  id: number;
  ts: Date;
  sender: string;
  text: string;
}

export interface ParticipantInfo {
  name: string;
  isMe: boolean;
}

export interface DateRange {
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
}

export interface ReportStats {
  totalMessages: number;
  bySender: Record<string, number>;
  shareOfVoice: Record<string, number>;
  initiationPct: Record<string, number>;
  replyMedianMinutes: Record<string, number>;
  recordDay: { date: string; count: number };
  longestStreakDays: number;
  longestSilenceDays: number;
  hourly: number[]; // 24 integers
  lateNightPct: number;
  daily: Record<string, number>; // YYYY-MM-DD: count
  topWords: Record<string, string[]>;
  topEmojis: Record<string, string[]>;
}

export interface MonthlyStats {
  month: string; // YYYY-MM
  messages: number;
  bySender: Record<string, number>;
  initiationPct: Record<string, number>;
  replyMedianMinutes: Record<string, number>;
  avgMessageLength: number;
  lateNightPct: number;
  closeness: number | null;
  mood: string;
}

export interface Quote {
  id: number;
  sender: string;
  text: string;
  ts: string;
}

export interface NarrativeSection {
  heading: string;
  paragraphs: string[];
  quotes: Quote[];
}

export interface TurningPoint {
  month: string;
  title: string;
  note: string;
}

export interface Narrative {
  intro: string[];
  sections: NarrativeSection[];
  turningPoints: TurningPoint[];
  closing: string[];
  safetyNote: string | null;
}

export interface FullReport {
  id: string;
  title: string | null;
  chatType: ChatType;
  persona: string;
  status: 'queued' | 'processing' | 'done' | 'failed';
  stage: string;
  errorCode: string | null;
  createdAt: string;
  completedAt?: string | null;
  participants: ParticipantInfo[] | null;
  dateRange: DateRange | null;
  stats: ReportStats | null;
  monthly: MonthlyStats[] | null;
  narrative: Narrative | null;
}

export interface Persona {
  id: string;
  name: string;
  tagline: string;
  systemPrompt: string;
  available: boolean;
}
