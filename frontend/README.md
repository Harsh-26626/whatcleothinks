# Cleo — Frontend (`/frontend`)

React 18 + Vite + TypeScript + Tailwind CSS application for **Cleo**, a clean, easy-to-read web app that shows how your WhatsApp chat changed month by month.

---

## Design System

- **Clean & Calm**: Pure white background (`#FFFFFF`), subtle surface (`#F6F6F4`), border (`#E5E5E1`), dark text (`#1A1A1A`), and marigold accent (`#F2B01E`).
- **Typography**: Single family **Figtree** (with `Noto Sans Devanagari` fallback for Hinglish and Hindi).
- **Geometry**: Strict 8px and 12px radii; 1px borders instead of drop shadows.
- **Reading-Focused Layout**: Long-form narrative and privacy pages capped at a comfortable 680px reading column.
- **Brand Constant**: Product name managed in one single source of truth in `src/brand.ts` (`BRAND_NAME = "Cleo"`).
- **The Five Privacy Statements**: Displayed verbatim across landing and privacy pages.
- **Fictional Sample Data**: Sample reports and fixtures use fictional participants (Aarav and Meera).

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
