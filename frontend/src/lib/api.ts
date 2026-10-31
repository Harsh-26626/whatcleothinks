import {
  AuthResponse,
  Persona,
  Report,
  ReportSummary,
  UploadPreview,
  User,
} from '../types';
import { SAMPLE_REPORT } from '../fixtures/sampleReport';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export class ApiRequestError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.code = code;
    this.status = status;
  }
}

function getToken(): string | null {
  return localStorage.getItem('whatcleo_token');
}

export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem('whatcleo_token', token);
  } else {
    localStorage.removeItem('whatcleo_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Set json content-type if body is not FormData
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    setToken(null);
    if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
      window.location.href = '/login';
    }
    throw new ApiRequestError('unauthorized', 'Session expired. Please log in again.', 401);
  }

  if (response.status === 204) {
    return {} as T;
  }

  let data: any = {};
  try {
    data = await response.json();
  } catch (e) {
    // Empty or non-json body
  }

  if (!response.ok) {
    const errorCode = data?.error || 'unknown_error';
    const message = data?.message || 'An unexpected error occurred.';
    throw new ApiRequestError(errorCode, message, response.status);
  }

  return data as T;
}

// In-memory mock storage for standalone mock mode
const mockReports: Report[] = [
  { ...SAMPLE_REPORT },
  {
    id: "9c1234a5-6789-4bc2-8def-112233445566",
    title: "Aarav and Meera",
    chatType: "friends",
    persona: "cleo",
    status: "done",
    stage: "done",
    errorCode: null,
    createdAt: "2024-12-25T14:20:00Z",
    completedAt: "2024-12-25T14:21:05Z",
    participants: [
      { name: "Meera", isMe: false },
      { name: "Aarav", isMe: true }
    ],
    dateRange: { start: "2024-07-13", end: "2024-12-25" },
    stats: SAMPLE_REPORT.stats,
    monthly: SAMPLE_REPORT.monthly,
    narrative: SAMPLE_REPORT.narrative,
  }
];

let mockJobStageIndex = 0;
const STAGES = ['queued', 'parsing', 'computing_stats', 'reading_months', 'writing_report', 'done'];

export const api = {
  async signup(email: string, password: string): Promise<AuthResponse> {
    if (USE_MOCK) {
      if (!email.includes('@')) throw new ApiRequestError('invalid_email', 'Please enter a valid email address.', 400);
      if (password.length < 8) throw new ApiRequestError('weak_password', 'Password must be at least 8 characters.', 400);
      const auth = {
        token: 'mock-jwt-token-' + Date.now(),
        user: { id: 'usr-mock-123', email },
      };
      setToken(auth.token);
      localStorage.setItem('whatcleo_user', JSON.stringify(auth.user));
      return auth;
    }
    const res = await request<AuthResponse>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(res.token);
    localStorage.setItem('whatcleo_user', JSON.stringify(res.user));
    return res;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    if (USE_MOCK) {
      if (!email || !password) throw new ApiRequestError('invalid_credentials', 'Invalid email or password.', 400);
      const auth = {
        token: 'mock-jwt-token-' + Date.now(),
        user: { id: 'usr-mock-123', email },
      };
      setToken(auth.token);
      localStorage.setItem('whatcleo_user', JSON.stringify(auth.user));
      return auth;
    }
    const res = await request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(res.token);
    localStorage.setItem('whatcleo_user', JSON.stringify(res.user));
    return res;
  },

  async getMe(): Promise<User> {
    if (USE_MOCK) {
      const stored = localStorage.getItem('whatcleo_user');
      return stored ? JSON.parse(stored) : { id: 'usr-mock-123', email: 'you@example.com' };
    }
    return request<User>('/api/auth/me');
  },

  async getPersonas(): Promise<Persona[]> {
    if (USE_MOCK) {
      return [
        { id: 'cleo', name: 'Cleo', tagline: 'Honest and friendly.', available: true },
        { id: 'coming-1', name: 'Dev (Coming soon)', tagline: 'Deeply analytical with chart breakdowns.', available: false },
        { id: 'coming-2', name: 'Tara (Coming soon)', tagline: 'Playful, meme-fluent best friend perspective.', available: false },
      ];
    }
    try {
      return await request<Persona[]>('/api/personas');
    } catch {
      return [
        { id: 'cleo', name: 'Cleo', tagline: 'Honest and friendly.', available: true },
        { id: 'coming-1', name: 'Coming soon', tagline: '', available: false },
      ];
    }
  },

  async previewUpload(file: File): Promise<UploadPreview> {
    if (USE_MOCK) {
      // Simulate preview
      await new Promise((r) => setTimeout(r, 600));
      return {
        participants: ['Meera', 'Aarav'],
        messageCount: 3518,
        dateRange: { start: '2024-07-13', end: '2024-12-25' },
        isGroup: false,
      };
    }

    const formData = new FormData();
    formData.append('file', file);

    return request<UploadPreview>('/api/uploads/preview', {
      method: 'POST',
      body: formData,
    });
  },

  async createReport(params: {
    file: File;
    chatType: string;
    persona: string;
    myName: string;
    consent: string;
  }): Promise<{ id: string }> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 800));
      const newId = 'rep-' + Date.now();
      mockJobStageIndex = 0;
      const createdReport: Report = {
        ...SAMPLE_REPORT,
        id: newId,
        chatType: params.chatType as any,
        persona: params.persona,
        status: 'queued',
        stage: 'queued',
        participants: [
          { name: 'Meera', isMe: params.myName === 'Meera' },
          { name: 'Aarav', isMe: params.myName === 'Aarav' },
        ],
        createdAt: new Date().toISOString(),
      };
      mockReports.unshift(createdReport);
      return { id: newId };
    }

    const formData = new FormData();
    formData.append('file', params.file);
    formData.append('chatType', params.chatType);
    formData.append('persona', params.persona || 'cleo');
    formData.append('myName', params.myName);
    formData.append('consent', params.consent);

    return request<{ id: string }>('/api/reports', {
      method: 'POST',
      body: formData,
    });
  },

  async getReports(): Promise<ReportSummary[]> {
    if (USE_MOCK) {
      return mockReports.map((r) => ({
        id: r.id,
        title: r.title,
        chatType: r.chatType,
        persona: r.persona,
        status: r.status,
        stage: r.stage,
        participants: r.participants,
        dateRange: r.dateRange,
        createdAt: r.createdAt,
      }));
    }
    return request<ReportSummary[]>('/api/reports');
  },

  async getReport(id: string): Promise<Report> {
    if (USE_MOCK) {
      const found = mockReports.find((r) => r.id === id) || SAMPLE_REPORT;
      if (found.status !== 'done') {
        mockJobStageIndex = Math.min(mockJobStageIndex + 1, STAGES.length - 1);
        found.stage = STAGES[mockJobStageIndex];
        if (found.stage === 'done') {
          found.status = 'done';
          found.completedAt = new Date().toISOString();
        } else {
          found.status = 'processing';
        }
      }
      return { ...found };
    }
    return request<Report>(`/api/reports/${id}`);
  },

  async deleteReport(id: string): Promise<void> {
    if (USE_MOCK) {
      const idx = mockReports.findIndex((r) => r.id === id);
      if (idx !== -1) mockReports.splice(idx, 1);
      return;
    }
    return request<void>(`/api/reports/${id}`, {
      method: 'DELETE',
    });
  },

  async deleteAccount(): Promise<void> {
    if (USE_MOCK) {
      mockReports.length = 0;
      setToken(null);
      localStorage.removeItem('whatcleo_user');
      return;
    }
    await request<void>('/api/account', {
      method: 'DELETE',
    });
    setToken(null);
    localStorage.removeItem('whatcleo_user');
  },
};

