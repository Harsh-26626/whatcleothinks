# whatcleothinks — Backend API

Express + TypeScript + Prisma + PostgreSQL backend service for whatcleothinks.

## Features
- **Privacy by Design**: Chat text lives in server memory only during processing; never persisted to disk, database, or server logs. Dereferenced in `finally` blocks.
- **WhatsApp Parser**: Full support for Android (12h/24h) and iPhone exports, automatic DD/MM vs MM/DD detection, multi-line preservation, and system/omitted message filtering.
- **Relationship Stats**: Computes share of voice, 6-hour initiation percentage, median reply time, late-night percentage, streaks, silences, and Hinglish stopword-filtered top words and emojis.
- **LLM Pipeline**: Anthropic Claude pipeline with parallel monthly mapping (`p-limit(5)`), reduce narrative synthesis, and strict client-side quote resolution (LLM never writes quotes).
- **Authentication**: Email/password authentication with bcrypt password hashing and 7-day HS256 JWT tokens with rate limiting on auth endpoints.
- **Job Lifecycle**: In-process asynchronous job queue with state transitions (`queued -> parsing -> computing_stats -> reading_months -> writing_report -> done`), crash recovery on startup.

## Environment Variables

Create `.env` in `backend/`:

```ini
PORT=8000
DATABASE_URL="postgresql://whatcleothinks_user:axz7u4aXGagBl7YibHa5PrRPeQ5ebkpe@dpg-dbirrltg1s2s73e357cg-a.ohio-postgres.render.com/whatcleothinks?sslmode=require"
JWT_SECRET=your_long_random_jwt_secret_min_32_chars
ANTHROPIC_API_KEY=your_anthropic_api_key_optional
MODEL_MAP=claude-3-5-haiku-20241022
MODEL_REPORT=claude-3-5-sonnet-20241022
FRONTEND_ORIGIN=http://localhost:5173
MAX_UPLOAD_MB=20
```

## Setup & Run

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Sync database schema**:
   ```bash
   npx prisma db push
   ```

3. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Run test suite**:
   ```bash
   npm test
   ```

6. **Debug stats CLI**:
   ```bash
   npm run debug:stats -- path/to/chat.txt
   ```
