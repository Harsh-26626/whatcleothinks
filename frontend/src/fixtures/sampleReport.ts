import { Report } from '../types';

export const SAMPLE_REPORT: Report = {
  id: "8f9b42e6-7b89-4d62-9e23-3e74b5c719a0",
  title: "The Safe Distance",
  chatType: "romance",
  persona: "cleo",
  status: "done",
  stage: "done",
  errorCode: null,
  createdAt: "2026-10-31T10:00:00Z",
  completedAt: "2026-10-31T10:01:14Z",
  participants: [
    { name: "Vanshika", isMe: false },
    { name: "Harsh", isMe: true }
  ],
  dateRange: { start: "2023-05-01", end: "2023-12-31" },
  stats: {
    totalMessages: 3518,
    bySender: { Vanshika: 1953, Harsh: 1565 },
    shareOfVoice: { Vanshika: 56, Harsh: 44 },
    initiationPct: { Vanshika: 49, Harsh: 51 },
    replyMedianMinutes: { Vanshika: 4.2, Harsh: 6.8 },
    recordDay: { date: "2023-12-25", count: 406 },
    longestStreakDays: 11,
    longestSilenceDays: 8,
    hourly: [
      120, 85, 42, 10, 4, 1, 6, 18, 45, 98, 140, 180, 210, 195, 175, 160, 190, 245, 310, 340, 360, 290, 250, 194
    ],
    lateNightPct: 26,
    daily: {
      "2023-05-01": 24,
      "2023-05-02": 31,
      "2023-05-15": 88,
      "2023-06-10": 45,
      "2023-07-04": 112,
      "2023-08-12": 95,
      "2023-09-18": 60,
      "2023-10-24": 140,
      "2023-11-14": 180,
      "2023-12-25": 406,
      "2023-12-31": 210
    },
    topWords: {
      Vanshika: ["theek", "class", "exam", "college", "ghar"],
      Harsh: ["waiting", "reach", "class", "kal", "batao"]
    },
    topEmojis: {
      Vanshika: ["😭", "😂", "✨"],
      Harsh: ["😭", "🤣", "🫡"]
    }
  },
  monthly: [
    {
      month: "2023-05",
      messages: 284,
      bySender: { Vanshika: 150, Harsh: 134 },
      initiationPct: { Vanshika: 48, Harsh: 52 },
      replyMedianMinutes: { Vanshika: 5.4, Harsh: 6.1 },
      avgMessageLength: 28.2,
      lateNightPct: 18,
      closeness: 65,
      mood: "Cautious curiosity and quick college updates"
    },
    {
      month: "2023-06",
      messages: 340,
      bySender: { Vanshika: 185, Harsh: 155 },
      initiationPct: { Vanshika: 50, Harsh: 50 },
      replyMedianMinutes: { Vanshika: 4.8, Harsh: 5.2 },
      avgMessageLength: 30.1,
      lateNightPct: 22,
      closeness: 72,
      mood: "Playful banter settling into everyday comfort"
    },
    {
      month: "2023-07",
      messages: 612,
      bySender: { Vanshika: 330, Harsh: 282 },
      initiationPct: { Vanshika: 45, Harsh: 55 },
      replyMedianMinutes: { Vanshika: 3.1, Harsh: 5.0 },
      avgMessageLength: 31.4,
      lateNightPct: 38,
      closeness: 86,
      mood: "Warm, playful, talking every day late into the night"
    },
    {
      month: "2023-08",
      messages: 490,
      bySender: { Vanshika: 270, Harsh: 220 },
      initiationPct: { Vanshika: 52, Harsh: 48 },
      replyMedianMinutes: { Vanshika: 3.8, Harsh: 4.9 },
      avgMessageLength: 29.5,
      lateNightPct: 30,
      closeness: 80,
      mood: "Steady support during mid-semester exams"
    },
    {
      month: "2023-09",
      messages: 310,
      bySender: { Vanshika: 180, Harsh: 130 },
      initiationPct: { Vanshika: 44, Harsh: 56 },
      replyMedianMinutes: { Vanshika: 6.5, Harsh: 8.1 },
      avgMessageLength: 24.0,
      lateNightPct: 15,
      closeness: 58,
      mood: "Slight distance as schedules got crowded"
    },
    {
      month: "2023-10",
      messages: 412,
      bySender: { Vanshika: 232, Harsh: 180 },
      initiationPct: { Vanshika: 51, Harsh: 49 },
      replyMedianMinutes: { Vanshika: 4.0, Harsh: 6.2 },
      avgMessageLength: 32.8,
      lateNightPct: 25,
      closeness: 75,
      mood: "Rekindled rhythm around festive plans"
    },
    {
      month: "2023-11",
      messages: 480,
      bySender: { Vanshika: 276, Harsh: 204 },
      initiationPct: { Vanshika: 49, Harsh: 51 },
      replyMedianMinutes: { Vanshika: 3.9, Harsh: 5.5 },
      avgMessageLength: 33.1,
      lateNightPct: 28,
      closeness: 82,
      mood: "Comfortable vulnerability and shared routines"
    },
    {
      month: "2023-12",
      messages: 590,
      bySender: { Vanshika: 330, Harsh: 260 },
      initiationPct: { Vanshika: 53, Harsh: 47 },
      replyMedianMinutes: { Vanshika: 3.2, Harsh: 4.5 },
      avgMessageLength: 35.0,
      lateNightPct: 35,
      closeness: 91,
      mood: "High momentum with a record holiday marathon"
    }
  ],
  narrative: {
    intro: [
      "There is a steady, gentle rhythm to how you two speak. Over eight months and more than 3,500 messages, neither of you became the sole keeper of the conversation.",
      "You both kept showing up with almost equal weight: Vanshika brought 56% of the messages and you initiated 51% of the conversations. That balance made this feel like a safe harbour rather than a game of chase."
    ],
    sections: [
      {
        heading: "How it found its footing",
        paragraphs: [
          "May began with short, practical check-ins between lectures. The replies were prompt but guarded, like two people testing the echo in a new room.",
          "By July, the guard came down. The texts stretched well past midnight, and the questions turned from logistical coordination into unhurried curiosity about each other's days."
        ],
        quotes: [
          { id: 102, sender: "Vanshika", text: "Eng ki class me mil lenge", ts: "2023-05-15T09:12:00" },
          { id: 488, sender: "Harsh", text: "Tu soyi nahi abhi tak? 2 baj rahe", ts: "2023-07-04T02:04:00" }
        ]
      },
      {
        heading: "The silent dip in September",
        paragraphs: [
          "September was the only chapter where the thread thinned out noticeably. Message volume dropped by almost half, and reply times on both sides stretched to over eight minutes.",
          "It didn't look like anger or conflict; it looked like exhaustion. The messages became shorter updates about exams and home, keeping the link alive even when neither of you had the energy to hold court."
        ],
        quotes: [
          { id: 1420, sender: "Vanshika", text: "Aaj bilkul energy nahi bachi", ts: "2023-09-18T18:40:00" }
        ]
      },
      {
        heading: "Finding the rhythm again",
        paragraphs: [
          "When winter came around, warmth returned quickly. By November you were back to swapping daily mini-monologues and sharing whatever funny detail happened on your walk back from campus.",
          "What stands out here is that nobody had to force a dramatic reconciliation. You simply picked back up where life had paused you."
        ],
        quotes: [
          { id: 2105, sender: "Harsh", text: "Kal canteen me wait kar raha hu, jaldi aana", ts: "2023-11-14T11:20:00" }
        ]
      },
      {
        heading: "The holiday marathon",
        paragraphs: [
          "December 25th was your single highest message count of the entire year: 406 messages in one day. You bounced jokes and commentary across the evening without pausing.",
          "Even when the conversation peaked, the speed remained natural. Neither of you was holding back."
        ],
        quotes: [
          { id: 3120, sender: "Vanshika", text: "Aadha din toh humara sirf memes discuss karne me nikal gaya 😭", ts: "2023-12-25T21:15:00" }
        ]
      },
      {
        heading: "Cleo's reflection for you",
        paragraphs: [
          "You don't need to overthink the quiet stretches. Your dynamic has already proved that a slow week doesn't mean the bond is brittle.",
          "If there is one thing to keep in mind, it is to keep saying the spontaneous things out loud. That easy playfulness is what keeps this space alive."
        ],
        quotes: []
      }
    ],
    turningPoints: [
      {
        month: "2023-07",
        title: "The Late Night Shift",
        note: "Closeness climbed to 86 as late-night exchanges nearly doubled."
      },
      {
        month: "2023-09",
        title: "The Academic Pause",
        note: "A low-volume month where message speed slowed down before rebounding."
      },
      {
        month: "2023-12",
        title: "The 406-Message Record",
        note: "Christmas day created the record spike of the entire year."
      }
    ],
    closing: [
      "Hold on to the ease you have built here. It is rare to find conversations where silence does not feel like distance."
    ],
    safetyNote: null
  }
};

