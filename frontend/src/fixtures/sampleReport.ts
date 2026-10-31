import { Report } from '../types';

export const SAMPLE_REPORT: Report = {
  id: "8f9b42e6-7b89-4d62-9e23-3e74b5c719a0",
  title: "Aarav and Meera",
  chatType: "romance",
  persona: "cleo",
  status: "done",
  stage: "done",
  errorCode: null,
  createdAt: "2024-12-26T10:00:00Z",
  completedAt: "2024-12-26T10:01:14Z",
  participants: [
    { name: "Meera", isMe: false },
    { name: "Aarav", isMe: true }
  ],
  dateRange: { start: "2024-07-13", end: "2024-12-25" },
  stats: {
    totalMessages: 3518,
    bySender: { Meera: 1953, Aarav: 1565 },
    shareOfVoice: { Meera: 56, Aarav: 44 },
    initiationPct: { Meera: 49, Aarav: 51 },
    replyMedianMinutes: { Meera: 4.2, Aarav: 6.8 },
    recordDay: { date: "2024-12-25", count: 406 },
    longestStreakDays: 11,
    longestSilenceDays: 8,
    hourly: [
      120, 85, 42, 10, 4, 1, 6, 18, 45, 98, 140, 180, 210, 195, 175, 160, 190, 245, 310, 340, 360, 290, 250, 194
    ],
    lateNightPct: 26,
    daily: {
      "2024-07-13": 24,
      "2024-07-14": 42,
      "2024-07-20": 31,
      "2024-08-05": 88,
      "2024-08-18": 95,
      "2024-09-10": 45,
      "2024-09-18": 60,
      "2024-10-12": 112,
      "2024-10-24": 140,
      "2024-11-14": 180,
      "2024-12-10": 130,
      "2024-12-25": 406
    },
    topWords: {
      Meera: ["theek", "class", "exam", "college", "ghar"],
      Aarav: ["waiting", "reach", "class", "kal", "batao"]
    },
    topEmojis: {
      Meera: ["😭", "😂", "✨"],
      Aarav: ["😭", "🤣", "🫡"]
    }
  },
  monthly: [
    {
      month: "2024-07",
      messages: 340,
      bySender: { Meera: 185, Aarav: 155 },
      initiationPct: { Meera: 50, Aarav: 50 },
      replyMedianMinutes: { Meera: 4.8, Aarav: 5.2 },
      avgMessageLength: 30.1,
      lateNightPct: 22,
      closeness: 72,
      mood: "Quick updates and settling into daily contact"
    },
    {
      month: "2024-08",
      messages: 612,
      bySender: { Meera: 330, Aarav: 282 },
      initiationPct: { Meera: 45, Aarav: 55 },
      replyMedianMinutes: { Meera: 3.1, Aarav: 5.0 },
      avgMessageLength: 31.4,
      lateNightPct: 38,
      closeness: 86,
      mood: "Talking every day late into the night"
    },
    {
      month: "2024-09",
      messages: 310,
      bySender: { Meera: 180, Aarav: 130 },
      initiationPct: { Meera: 44, Aarav: 56 },
      replyMedianMinutes: { Meera: 6.5, Aarav: 8.1 },
      avgMessageLength: 24.0,
      lateNightPct: 15,
      closeness: 58,
      mood: "A quiet dip as exam schedules got busy"
    },
    {
      month: "2024-10",
      messages: 412,
      bySender: { Meera: 232, Aarav: 180 },
      initiationPct: { Meera: 51, Aarav: 49 },
      replyMedianMinutes: { Meera: 4.0, Aarav: 6.2 },
      avgMessageLength: 32.8,
      lateNightPct: 25,
      closeness: 75,
      mood: "Back to regular evening check-ins"
    },
    {
      month: "2024-11",
      messages: 480,
      bySender: { Meera: 276, Aarav: 204 },
      initiationPct: { Meera: 49, Aarav: 51 },
      replyMedianMinutes: { Meera: 3.9, Aarav: 5.5 },
      avgMessageLength: 33.1,
      lateNightPct: 28,
      closeness: 82,
      mood: "Shared daily routines and quick replies"
    },
    {
      month: "2024-12",
      messages: 590,
      bySender: { Meera: 330, Aarav: 260 },
      initiationPct: { Meera: 53, Aarav: 47 },
      replyMedianMinutes: { Meera: 3.2, Aarav: 4.5 },
      avgMessageLength: 35.0,
      lateNightPct: 35,
      closeness: 91,
      mood: "High message volume and a record holiday exchange"
    }
  ],
  narrative: {
    intro: [
      "Across six months and 3,500 messages, the two of you kept an even balance. Neither person carried the conversation alone.",
      "Meera sent 56% of the messages, and you started 51% of the conversations. That equal split makes the chat feel steady rather than one-sided."
    ],
    sections: [
      {
        heading: "Finding a rhythm",
        paragraphs: [
          "July began with short updates between classes. Replies were fast, but mainly focused on college logistics.",
          "By August, conversations moved into late evenings. You started asking about each other's day, and replies stretched past midnight."
        ],
        quotes: [
          { id: 102, sender: "Meera", text: "Class ke baad canteen me milte hain", ts: "2024-07-14T09:12:00" },
          { id: 488, sender: "Aarav", text: "Tu soyi nahi abhi tak? 2 baj rahe", ts: "2024-08-18T02:04:00" }
        ]
      },
      {
        heading: "The quiet dip in September",
        paragraphs: [
          "September was the slowest month. Message count dropped by half, and replies took twice as long.",
          "The tone did not look strained—just busy. Messages turned into short practical notes about assignments and travel."
        ],
        quotes: [
          { id: 1420, sender: "Meera", text: "Aaj bilkul time nahi mila padhai se", ts: "2024-09-18T18:40:00" }
        ]
      },
      {
        heading: "Picking back up in November",
        paragraphs: [
          "Once exams passed, the pace returned quickly. You were back to checking in during the day and trading commentary about campus.",
          "The conversation did not need a formal restart. Both of you simply picked up where things left off."
        ],
        quotes: [
          { id: 2105, sender: "Aarav", text: "Kal canteen me wait kar raha hu, jaldi aana", ts: "2024-11-14T11:20:00" }
        ]
      },
      {
        heading: "The holiday peak",
        paragraphs: [
          "December 25 was your busiest day of the year, with 406 messages sent.",
          "You traded quick replies throughout the evening without long pauses."
        ],
        quotes: [
          { id: 3120, sender: "Meera", text: "Poora din sirf memes discuss karne me nikal gaya 😭", ts: "2024-12-25T21:15:00" }
        ]
      },
      {
        heading: "Cleo's read for you",
        paragraphs: [
          "Quiet stretches in September did not hurt the relationship. You both return to the conversation naturally when schedules clear up.",
          "Keep speaking up when you have something on your mind. That straightforward habit is what keeps this chat easy."
        ],
        quotes: []
      }
    ],
    turningPoints: [
      {
        month: "2024-08",
        title: "Late night shift",
        note: "Closeness rose to 86 as late-night chats doubled."
      },
      {
        month: "2024-09",
        title: "Exam pause",
        note: "Messages slowed down during midterms before rebounding."
      },
      {
        month: "2024-12",
        title: "406-message record",
        note: "Christmas day set the peak message count for the entire period."
      }
    ],
    closing: [
      "The steady give-and-take you have built here works well. Keep it simple and keep talking."
    ],
    safetyNote: null
  }
};
