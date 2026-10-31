import emojiRegex from 'emoji-regex';
import { Message, ReportStats, MonthlyStats } from './types.js';

const GAP_HOURS = 6;
const REPLY_MAX_HOURS = 12;

const HINGLISH_STOPWORDS = new Set([
  // Hinglish
  'hai', 'hain', 'ho', 'hu', 'hoon', 'tha', 'thi', 'the', 'to', 'toh', 'ki', 'ka', 'ke', 'ko',
  'me', 'mein', 'se', 'ne', 'pe', 'par', 'aur', 'or', 'ya', 'ye', 'yeh', 'wo', 'woh',
  'kya', 'kyun', 'kyu', 'kaise', 'nahi', 'nhi', 'na', 'haan', 'han', 'ha', 'ok', 'okay',
  'acha', 'accha', 'achha', 'bhi', 'hi', 'bas', 'abhi', 'kuch', 'kuchh',
  'rahi', 'raha', 'rahe', 'kar', 'karo', 'karna', 'kr', 'kiya', 'mat', 'mera', 'meri', 'mere',
  'tera', 'teri', 'tere', 'tum', 'tu', 'main', 'mai', 'hum', 'aap',
  'mujhe', 'tujhe', 'usko', 'isko', 'jo', 'jab', 'tab', 'lo', 'de', 'do', 'dena', 'le', 'lena',
  'gya', 'gaya', 'gayi', 'wala', 'wali', 'bhai', 'yaar',
  'message', 'media', 'omitted', 'deleted',
  // Common English
  'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'shall', 'should', 'can', 'could',
  'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'up', 'about', 'into', 'over', 'after',
  'between', 'through', 'out', 'against', 'during', 'before', 'that', 'this', 'these', 'those',
  'what', 'which', 'who', 'whom', 'whose', 'why', 'how', 'all', 'any', 'both', 'each', 'few',
  'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
  'than', 'too', 'very', 'just', 'you', 'your', 'yours', 'she', 'he', 'her', 'him', 'his',
  'they', 'them', 'their', 'theirs', 'we', 'our', 'ours', 'i', 'my', 'me', 'mine', 'it', 'its',
  'yes', 'yeah', 'noo', 'yup', 'like', 'get', 'got', 'know', 'see', 'come', 'go', 'going',
  'went', 'gone', 'think', 'say', 'said', 'tell', 'told', 'make', 'made', 'well', 'now', 'then',
]);

function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  return Math.round(median * 10) / 10;
}

function formatDateKey(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatMonthKey(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function computeStats(messages: Message[], participants: string[]): ReportStats {
  const totalMessages = messages.length;
  const bySender: Record<string, number> = {};
  const hourly: number[] = new Array(24).fill(0);
  const daily: Record<string, number> = {};
  const replyDeltasMinutes: Record<string, number[]> = {};
  const initiationCounts: Record<string, number> = {};
  let totalInitiations = 0;
  let lateNightCount = 0;

  for (const p of participants) {
    bySender[p] = 0;
    replyDeltasMinutes[p] = [];
    initiationCounts[p] = 0;
  }

  // Top words and emojis structures
  const wordFreqBySender: Record<string, Record<string, number>> = {};
  const emojiFreqBySender: Record<string, Record<string, number>> = {};
  for (const p of participants) {
    wordFreqBySender[p] = {};
    emojiFreqBySender[p] = {};
  }

  const regexEmoji = emojiRegex();

  let longestSilenceDays = 0;

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const prevMsg = i > 0 ? messages[i - 1] : null;

    // Sender count
    bySender[msg.sender] = (bySender[msg.sender] || 0) + 1;

    // Hour
    const hour = msg.ts.getUTCHours();
    hourly[hour] = (hourly[hour] || 0) + 1;

    // Late night (22:00 to 04:00 => 22, 23, 0, 1, 2, 3)
    if (hour >= 22 || hour < 4) {
      lateNightCount++;
    }

    // Daily count
    const dateKey = formatDateKey(msg.ts);
    daily[dateKey] = (daily[dateKey] || 0) + 1;

    // Silence gap
    if (prevMsg) {
      const gapMs = msg.ts.getTime() - prevMsg.ts.getTime();
      const gapDays = Math.floor(gapMs / (1000 * 60 * 60 * 24));
      if (gapDays > longestSilenceDays) {
        longestSilenceDays = gapDays;
      }

      // Initiation check: previous message >= 6 hours earlier
      const gapHours = gapMs / (1000 * 60 * 60);
      if (gapHours >= GAP_HOURS) {
        initiationCounts[msg.sender] = (initiationCounts[msg.sender] || 0) + 1;
        totalInitiations++;
      }

      // Reply time check: different sender, within 12 hours
      if (msg.sender !== prevMsg.sender && gapHours <= REPLY_MAX_HOURS && gapHours >= 0) {
        const deltaMinutes = gapMs / (1000 * 60);
        if (!replyDeltasMinutes[msg.sender]) {
          replyDeltasMinutes[msg.sender] = [];
        }
        replyDeltasMinutes[msg.sender].push(deltaMinutes);
      }
    } else {
      // First message is an initiation
      initiationCounts[msg.sender] = (initiationCounts[msg.sender] || 0) + 1;
      totalInitiations++;
    }

    // Top words
    if (!wordFreqBySender[msg.sender]) {
      wordFreqBySender[msg.sender] = {};
    }
    // Clean text: strip URLs, remove punctuation
    const textWithoutUrls = msg.text.replace(/https?:\/\/\S+/gi, ' ');
    const tokens = textWithoutUrls
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/);

    for (const t of tokens) {
      if (t.length >= 3 && !HINGLISH_STOPWORDS.has(t) && !/^\d+$/.test(t)) {
        wordFreqBySender[msg.sender][t] = (wordFreqBySender[msg.sender][t] || 0) + 1;
      }
    }

    // Top emojis
    if (!emojiFreqBySender[msg.sender]) {
      emojiFreqBySender[msg.sender] = {};
    }
    const emojiMatches = msg.text.match(regexEmoji);
    if (emojiMatches) {
      for (const em of emojiMatches) {
        emojiFreqBySender[msg.sender][em] = (emojiFreqBySender[msg.sender][em] || 0) + 1;
      }
    }
  }

  // Share of voice
  const shareOfVoice: Record<string, number> = {};
  for (const p of participants) {
    shareOfVoice[p] = totalMessages > 0 ? Math.round(((bySender[p] || 0) / totalMessages) * 100) : 0;
  }

  // Initiation Pct
  const initiationPct: Record<string, number> = {};
  for (const p of participants) {
    initiationPct[p] = totalInitiations > 0 ? Math.round(((initiationCounts[p] || 0) / totalInitiations) * 100) : 0;
  }

  // Reply median minutes
  const replyMedianMinutes: Record<string, number> = {};
  for (const p of participants) {
    replyMedianMinutes[p] = calculateMedian(replyDeltasMinutes[p] || []);
  }

  // Record day
  let recordDay = { date: '', count: 0 };
  for (const [date, count] of Object.entries(daily)) {
    if (count > recordDay.count) {
      recordDay = { date, count };
    }
  }

  // Longest streak
  const uniqueDates = Object.keys(daily).sort();
  let longestStreakDays = uniqueDates.length > 0 ? 1 : 0;
  let currentStreak = uniqueDates.length > 0 ? 1 : 0;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1] + 'T00:00:00Z');
    const currDate = new Date(uniqueDates[i] + 'T00:00:00Z');
    const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      currentStreak++;
      if (currentStreak > longestStreakDays) {
        longestStreakDays = currentStreak;
      }
    } else {
      currentStreak = 1;
    }
  }

  // Top words per sender (top 5)
  const topWords: Record<string, string[]> = {};
  for (const p of participants) {
    const freq = wordFreqBySender[p] || {};
    topWords[p] = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }

  // Top emojis per sender (top 3)
  const topEmojis: Record<string, string[]> = {};
  for (const p of participants) {
    const freq = emojiFreqBySender[p] || {};
    topEmojis[p] = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([em]) => em);
  }

  const lateNightPct = totalMessages > 0 ? Math.round((lateNightCount / totalMessages) * 100) : 0;

  return {
    totalMessages,
    bySender,
    shareOfVoice,
    initiationPct,
    replyMedianMinutes,
    recordDay,
    longestStreakDays,
    longestSilenceDays,
    hourly,
    lateNightPct,
    daily,
    topWords,
    topEmojis,
  };
}

export function computeMonthlyStats(messages: Message[], participants: string[]): MonthlyStats[] {
  // Group messages by YYYY-MM
  const monthGroups: Record<string, Message[]> = {};
  for (const msg of messages) {
    const monthKey = formatMonthKey(msg.ts);
    if (!monthGroups[monthKey]) {
      monthGroups[monthKey] = [];
    }
    monthGroups[monthKey].push(msg);
  }

  const sortedMonths = Object.keys(monthGroups).sort();
  const monthlyList: MonthlyStats[] = [];

  for (const month of sortedMonths) {
    const monthMsgs = monthGroups[month];
    const totalCount = monthMsgs.length;

    const bySender: Record<string, number> = {};
    const initiationCounts: Record<string, number> = {};
    const replyDeltasMinutes: Record<string, number[]> = {};
    let totalInitiations = 0;
    let lateNightCount = 0;
    let totalChars = 0;

    for (const p of participants) {
      bySender[p] = 0;
      initiationCounts[p] = 0;
      replyDeltasMinutes[p] = [];
    }

    for (let i = 0; i < monthMsgs.length; i++) {
      const msg = monthMsgs[i];
      const prevMsg = i > 0 ? monthMsgs[i - 1] : null;

      bySender[msg.sender] = (bySender[msg.sender] || 0) + 1;
      totalChars += msg.text.length;

      const hour = msg.ts.getUTCHours();
      if (hour >= 22 || hour < 4) {
        lateNightCount++;
      }

      if (prevMsg) {
        const gapMs = msg.ts.getTime() - prevMsg.ts.getTime();
        const gapHours = gapMs / (1000 * 60 * 60);

        if (gapHours >= GAP_HOURS) {
          initiationCounts[msg.sender] = (initiationCounts[msg.sender] || 0) + 1;
          totalInitiations++;
        }

        if (msg.sender !== prevMsg.sender && gapHours <= REPLY_MAX_HOURS && gapHours >= 0) {
          const deltaMinutes = gapMs / (1000 * 60);
          if (!replyDeltasMinutes[msg.sender]) {
            replyDeltasMinutes[msg.sender] = [];
          }
          replyDeltasMinutes[msg.sender].push(deltaMinutes);
        }
      } else {
        initiationCounts[msg.sender] = (initiationCounts[msg.sender] || 0) + 1;
        totalInitiations++;
      }
    }

    const initiationPct: Record<string, number> = {};
    for (const p of participants) {
      initiationPct[p] = totalInitiations > 0 ? Math.round(((initiationCounts[p] || 0) / totalInitiations) * 100) : 0;
    }

    const replyMedianMinutes: Record<string, number> = {};
    for (const p of participants) {
      replyMedianMinutes[p] = calculateMedian(replyDeltasMinutes[p] || []);
    }

    const avgMessageLength = totalCount > 0 ? Math.round((totalChars / totalCount) * 10) / 10 : 0;
    const lateNightPct = totalCount > 0 ? Math.round((lateNightCount / totalCount) * 100) : 0;

    monthlyList.push({
      month,
      messages: totalCount,
      bySender,
      initiationPct,
      replyMedianMinutes,
      avgMessageLength,
      lateNightPct,
      closeness: null,
      mood: '',
    });
  }

  return monthlyList;
}

