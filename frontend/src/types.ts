export type ChatType = 'romance' | 'friends' | 'group';

export type ReportStatus = 'queued' | 'processing' | 'done' | 'failed';

export interface Participant {
  name: string;
  isMe: boolean;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface ReportStats {
  totalMessages: number;
  bySender: Record<string, number>;
  shareOfVoice: Record<string, number>;
  initiationPct: Record<string, number>;
  replyMedianMinutes: Record<string, number>;
  recordDay: {
    date: string;
    count: number;
  };
  longestStreakDays: number;
  longestSilenceDays: number;
  hourly: number[]; // 24 integers
  lateNightPct: number;
  daily: Record<string, number>; // YYYY-MM-DD -> count
  topWords: Record<string, string[]>;
  topEmojis: Record<string, string[]>;
}

export interface MonthlyItem {
  month: string; // YYYY-MM
  messages: number;
  bySender: Record<string, number>;
  initiationPct: Record<string, number>;
  replyMedianMinutes: Record<string, number>;
  avgMessageLength: number;
  lateNightPct: number;
  closeness: number | null; // 0-100 or null if <20 messages
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

export interface Report {
  id: string;
  title?: string | null;
  chatType: ChatType;
  persona: string;
  status: ReportStatus;
  stage: string;
  errorCode?: string | null;
  createdAt: string;
  completedAt?: string | null;
  participants?: Participant[];
  dateRange?: DateRange;
  stats?: ReportStats;
  monthly?: MonthlyItem[];
  narrative?: Narrative;
}

export interface ReportSummary {
  id: string;
  title?: string | null;
  chatType: ChatType;
  persona: string;
  status: ReportStatus;
  stage: string;
  participants?: Participant[];
  dateRange?: DateRange;
  createdAt: string;
}

export interface UploadPreview {
  participants: string[];
  messageCount: number;
  dateRange: DateRange;
  isGroup: boolean;
}

export interface Persona {
  id: string;
  name: string;
  tagline: string;
  available: boolean;
}

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
  message: string;
}

