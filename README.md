# Cleo

Cleo reads your WhatsApp chats and gives you a friendly, honest reflection of them :)

[![Live Site](https://img.shields.io/badge/Live_Demo-whatcleothinks.vercel.app-blue)](https://whatcleothinks.vercel.app)
[![Stack](https://img.shields.io/badge/Stack-React_|_Express_|_Prisma-green)](#tech-stack)

**Live:** [whatcleothinks.vercel.app](https://whatcleothinks.vercel.app)

![Report screenshot](docs/report.png)

## The Idea

Cleo is a character who goes through an exported WhatsApp chat and writes a friendly reflection of the conversation: who reached out more, how things changed month by month, and what stood out, with real quotes from the chat. It works with Hinglish chats.

## Use Cases

- **Romance**: how warmth and effort changed over time
- **Friends**: the dynamic, inside jokes, who keeps the friendship going
- **Student groups**: who starts things, who goes quiet, group energy over time

## What You Get in a Report

- **Activity summary**: message counts, share of voice, streak, and longest silence
- **Daily heatmap**: calendar grid of message volume across the timeline
- **Hourly rhythm**: 24-hour distribution highlighting late nights
- **Initiation & reply times**: who starts conversations and median response speed
- **Top words and emojis**: most used words (Hinglish/English filtered) and emojis
- **Monthly closeness chart**: month-by-month connection score and volume
- **Turning points**: key shifts marked on the timeline
- **Written narrative**: Cleo's reflection with WhatsApp-style quote bubbles

## How It Works

```
Upload → Parse → Compute stats → Summarise each month (AI) → Write report (AI) → Save report → Delete chat file
```

- **Upload**: chat file (`.txt` or `.zip`) loaded into server memory only (never saved to disk).
- **Parse**: extracts senders, timestamps, multi-line texts, and strips system lines.
- **Compute stats**: calculates volume shares, 6-hour initiations, reply speeds, and word counts without AI.
- **Summarise each month (AI)**: Claude Haiku scores closeness and mood for active months in parallel.
- **Write report (AI)**: Claude Sonnet synthesises the story and selects quote IDs.
- **Save report**: saves metrics and resolved quotes into PostgreSQL.
- **Delete chat file**: raw text and parsed messages are dereferenced in a `finally` block.

Quotes are copied from the original chat by message ID, not written by the AI.

## Cost Per Report

Official Anthropic API pricing (checked October 2026): Claude 3.5 Haiku is $0.80 / million input tokens and $4.00 / million output tokens. Claude 3.5 Sonnet is $3.00 / million input tokens and $15.00 / million output tokens.

*Assumptions: WhatsApp chats average ~7 words (~10 tokens) per message; monthly transcripts are sampled to at most 15,000 characters (~3,500 tokens).*

| Chat Size | AI Calls | Approx Input Tokens | Approx Output Tokens | Approx Cost (USD) | Approx Cost (INR) |
|---|---|---|---|---|---|
| Small (500 msgs, 3 mo) | 4 calls | ~7,400 | ~1,840 | $0.032 | ₹2.70 |
| Medium (5,000 msgs, 8 mo) | 9 calls | ~31,200 | ~2,840 | $0.059 | ₹5.00 |
| Large (40,000 msgs, 12 mo cap) | 13 calls | ~45,800 | ~3,660 | $0.076 | ₹6.50 |

Estimates, not exact bills. Actual cost depends on chat length and language. (Exchange rate: ₹84.50 per USD, checked October 2026).
Frontend hosted on Vercel (free tier); backend web service and PostgreSQL database hosted on Render (free tier).

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Recharts
- **Backend**: Node.js 22, Express, TypeScript, Multer, Adm-Zip, Zod
- **Database & ORM**: PostgreSQL, Prisma ORM
- **AI**: Anthropic Claude API (Claude 3.5 Haiku & Sonnet)
- **Hosting**: Vercel (Frontend), Render (Backend & PostgreSQL)

## Privacy

- Your chat file is deleted right after your report is created.
- Your report is saved to your account until you delete it.
- Reports can include short quotes from your chat.
- You can delete any report, or your whole account, at any time.
- Nothing is shared with the people in the chat, and nothing is sold.

The chat text is sent to an AI provider (Anthropic) to write the report. We store your email and a hashed password.

## Run It Locally

```bash
git clone https://github.com/Harsh-26626/whatcleothinks.git
cd whatcleothinks
# Backend
cd backend && npm install && npx prisma db push
npm run dev # configure backend/.env (PORT, DATABASE_URL, JWT_SECRET, ANTHROPIC_API_KEY, MODEL_MAP, MODEL_REPORT, FRONTEND_ORIGIN, MAX_UPLOAD_MB)
# Frontend
cd ../frontend && npm install
npm run dev # configure frontend/.env (VITE_API_URL, VITE_USE_MOCK)
```

---

Built for a hackathon by [Harsh-26626](https://github.com/Harsh-26626).
