# whatcleothinks — Frontend (`/frontend`)

React 18 + Vite + TypeScript + Tailwind CSS application for **whatcleothinks**, an honest, gentle, mobile-first WhatsApp chat relationship reflection guide powered by the Cleo persona.

---

## Features

- **Cozy, tactile design system**: Designed with warm cream backgrounds (`#FBF6EF`), soft terracotta accents (`#C96B5C`), pure white cards (`#FFFFFF`), organic brown-ink text (`#2B2320`), and generous rounded geometry (16–24px).
- **Typography hierarchy**: Editorial serif headlines with `Playfair Display` + `Lora` (with `Noto Serif Devanagari` fallback for Hindi/Hinglish) and clean rounded geometric UI with `Plus Jakarta Sans` (`Noto Sans Devanagari` fallback).
- **The Five Core Privacy Truths**: Prominently featured verbatim across the landing and privacy pages.
- **5-Step New Report Stepper**:
  1. Chat type selection (Romance, Close Friends, Group Chat)
  2. Platform export guide (Android & iPhone instructions for exporting "Without Media")
  3. Upload dropzone with in-memory preview, automatic participant extraction, "Which one is you?" selector, and required consent checkbox
  4. Persona guide selection (Cleo active, locked future personas)
  5. Live processing status with warm breathing animation and 3-second polling
- **Rich Report Page**:
  - **Daily Activity Rhythm Heatmap**: Compact grid with message density scaling
  - **Initiation & Share of Voice Balance**: Reciprocity indicators and median reply times
  - **Peak Days & Silence Tracking**: Streaks, silences, and 24-hour hourly distributions (with late-night 10 PM - 4 AM highlights)
  - **Frequent Lexicon & Emojis**: Top Hinglish/English words and emoji reactions per person
  - **Monthly Closeness Trajectory**: Smooth area curve with turning point markers and milestone cards
  - **Cleo's Editorial Perspective**: Warm, insightful prose paired with authentic WhatsApp-style message bubbles
  - **Pause & Breathe Modal**: Affordance to pause and reflect
  - **PDF Export via `window.print()`**: Tailored `@media print` clean stylesheet
  - **Quiet Permanent Deletion**: Reassuring modal with hard-delete guarantees
- **Settings & Account Management**: Report deletion, bulk deletion, and permanent account removal.
- **Mock Mode Support**: Runs completely offline or decoupled from backend when `VITE_USE_MOCK=true`.

---

## Getting Started

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Environment Variables
Create `.env` in the `/frontend` directory:
```env
VITE_API_URL=http://localhost:8000
VITE_USE_MOCK=false
```

When `VITE_USE_MOCK=true`, the app functions fully using realistic mock reports without requiring the backend server. When `VITE_USE_MOCK=false`, it communicates with the live backend API.

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build for Production
```bash
npm run build
```
Builds optimized production assets to `dist/`.
