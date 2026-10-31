import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Squiggle } from '../components/Squiggle';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="w-full flex flex-col">
      {/* 1. HERO BAND ON BUTTER #FFF3C9 */}
      <section className="w-full bg-[#FFF3C9] py-16 md:py-24">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading, Subtitle, CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <h1 className="text-[34px] sm:text-[42px] lg:text-[52px] font-heading font-bold leading-[1.15] text-[#1C1A33] tracking-tight">
              See how your chat changed,{' '}
              <span className="relative inline-block whitespace-nowrap">
                month by month.
                <Squiggle className="absolute -bottom-2.5 left-0 w-full" />
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[#5A5873] mt-6 leading-relaxed max-w-[540px]">
              Upload a WhatsApp chat. Cleo reads it and tells you what she notices, honestly and kindly.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Link
                to={user ? "/new" : "/signup"}
                className="min-h-[48px] px-8 py-3 bg-[#CF3A26] hover:bg-[#B32F1D] text-white font-semibold text-base rounded-full transition-colors duration-150 inline-flex items-center justify-center shadow-sm"
              >
                Upload a chat
              </Link>
              <Link
                to="/privacy"
                className="min-h-[48px] px-6 py-3 bg-white border-[1.5px] border-[#1C1A33] text-[#1C1A33] hover:bg-[#F6F6F4] font-semibold text-base rounded-full transition-colors duration-150 inline-flex items-center justify-center"
              >
                How privacy works
              </Link>
            </div>
          </div>

          {/* Right Column: White Sample Panel (28px radius) */}
          <div className="lg:col-span-5 w-full bg-white border border-[#E7E5F0] rounded-[28px] p-6 sm:p-7 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5A5873]">
                Sample report · Aarav & Meera
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FFE0E8] text-[#1C1A33]">
                Romance
              </span>
            </div>

            {/* Real Closeness Chart (Coral line, lilac bars, Jul to Dec) */}
            <div className="w-full">
              <div className="text-sm font-bold text-[#1C1A33]">Closeness over time</div>
              <div className="text-xs text-[#5A5873] mt-0.5">Scale from 0 to 100 based on replies and volume</div>

              <div className="w-full h-28 pt-2">
                <svg viewBox="0 0 360 90" className="w-full h-full overflow-visible">
                  {/* Baseline */}
                  <line x1="10" y1="80" x2="350" y2="80" stroke="#E7E5F0" strokeWidth="1" />

                  {/* Lilac volume bars */}
                  {[
                    { x: 30, h: 25 },
                    { x: 90, h: 48 },
                    { x: 150, h: 22 },
                    { x: 210, h: 35 },
                    { x: 270, h: 40 },
                    { x: 330, h: 54 },
                  ].map((b, i) => (
                    <rect
                      key={i}
                      x={b.x - 10}
                      y={80 - b.h}
                      width={20}
                      height={b.h}
                      rx={3}
                      fill="#CFC3FF"
                    />
                  ))}

                  {/* Coral closeness line */}
                  <path
                    d="M 30,42 L 90,18 L 150,56 L 210,32 L 270,24 L 330,12"
                    fill="none"
                    stroke="#CF3A26"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Points */}
                  {[
                    { x: 30, y: 42, m: 'Jul' },
                    { x: 90, y: 18, m: 'Aug' },
                    { x: 150, y: 56, m: 'Sep' },
                    { x: 210, y: 32, m: 'Oct' },
                    { x: 270, y: 24, m: 'Nov' },
                    { x: 330, y: 12, m: 'Dec' },
                  ].map((p, i) => (
                    <g key={i}>
                      <circle cx={p.x} cy={p.y} r="3.5" fill="#FFFFFF" stroke="#CF3A26" strokeWidth="2.5" />
                      <text x={p.x} y="89" textAnchor="middle" className="text-[10px] fill-[#5A5873]">
                        {p.m}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Lilac Chat Panel (#F1EDFF) with Date Chip & 2 Bubbles */}
            <div className="bg-[#F1EDFF] p-4 rounded-[20px] flex flex-col gap-2.5">
              <div className="self-center bg-white px-3 py-0.5 rounded-full text-[11px] font-semibold text-[#5A5873] border border-[#E7E5F0]">
                18 Aug 2024
              </div>

              {/* Incoming from Aarav (left) */}
              <div className="self-start max-w-[85%] bg-white border border-[#E7E5F0] bubble-in p-3 text-sm text-[#1C1A33]">
                <span className="block text-[11px] font-bold text-[#F28C28] mb-0.5">Aarav</span>
                Tu soyi nahi abhi tak? 2 baj rahe
                <span className="block text-[10px] text-right text-[#5A5873] mt-1">02:04 AM</span>
              </div>

              {/* Outgoing from "You" (right) */}
              <div className="self-end max-w-[85%] bg-[#D6E2FF] bubble-out p-3 text-sm text-[#1C1A33]">
                <span className="block text-[11px] font-bold text-[#3B5BDB] mb-0.5">You</span>
                Nahi, bas abhi sone ja rahi thi ✨
                <span className="block text-[10px] text-right text-[#5A5873] mt-1">02:05 AM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS BAND ON WHITE */}
      <section className="w-full bg-white py-20 md:py-24">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <h2 className="text-[28px] md:text-[36px] font-heading font-bold text-[#1C1A33] mb-12">
            How it works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
            {/* Step 1: Peach round bubble */}
            <div className="flex flex-col items-start">
              <div className="w-14 h-14 rounded-full bg-[#FFE5D6] flex items-center justify-center font-heading font-bold text-2xl text-[#1C1A33] mb-4">
                1
              </div>
              <h3 className="text-[22px] font-heading font-bold text-[#1C1A33] mb-2">
                Export your chat
              </h3>
              <p className="text-base text-[#5A5873] leading-relaxed">
                In WhatsApp, tap your chat options and select Export Chat without media. It produces a plain text file.
              </p>
            </div>

            {/* Step 2: Sky round bubble */}
            <div className="flex flex-col items-start">
              <div className="w-14 h-14 rounded-full bg-[#DCEBFF] flex items-center justify-center font-heading font-bold text-2xl text-[#1C1A33] mb-4">
                2
              </div>
              <h3 className="text-[22px] font-heading font-bold text-[#1C1A33] mb-2">
                Upload it and pick who you are
              </h3>
              <p className="text-base text-[#5A5873] leading-relaxed">
                Select your export file and choose your name so Cleo speaks directly to you.
              </p>
            </div>

            {/* Step 3: Lilac round bubble */}
            <div className="flex flex-col items-start">
              <div className="w-14 h-14 rounded-full bg-[#E9E3FF] flex items-center justify-center font-heading font-bold text-2xl text-[#1C1A33] mb-4">
                3
              </div>
              <h3 className="text-[22px] font-heading font-bold text-[#1C1A33] mb-2">
                Read your report
              </h3>
              <p className="text-base text-[#5A5873] leading-relaxed">
                Get your daily heatmap, reply times, month-by-month changes, and written observations with quotes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHAT'S IN YOUR REPORT BAND ON SKY #DCEBFF */}
      <section className="w-full bg-[#DCEBFF] py-20 md:py-24">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <h2 className="text-[28px] md:text-[36px] font-heading font-bold text-[#1C1A33] mb-12">
            What is in your report
          </h2>

          {/* 2x3 Grid of Flat Tinted Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tile 1: White with Mini Heatmap */}
            <div className="p-6 bg-white rounded-[20px] flex flex-col justify-between gap-4">
              <div className="h-16 flex items-center">
                {/* Mini Heatmap Visual */}
                <div className="grid grid-rows-3 grid-flow-col gap-1">
                  {Array.from({ length: 27 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-3.5 h-3.5 rounded-[3px]"
                      style={{
                        backgroundColor:
                          i % 5 === 0 ? '#3B5BDB' : i % 3 === 0 ? '#94A8FF' : i % 2 === 0 ? '#C9D3FF' : '#EEF1FF',
                      }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-[20px] font-heading font-bold text-[#1C1A33] mb-1">Daily heatmap</h3>
                <p className="text-sm text-[#5A5873]">
                  See every busy week and quiet pause across the entire conversation.
                </p>
              </div>
            </div>

            {/* Tile 2: Peach with Mini Donut */}
            <div className="p-6 bg-[#FFE5D6] rounded-[20px] flex flex-col justify-between gap-4">
              <div className="h-16 flex items-center">
                {/* Mini Donut Visual */}
                <div className="flex items-center gap-3">
                  <svg width="48" height="48" viewBox="0 0 48 48" className="rotate-[-90deg]">
                    <circle cx="24" cy="24" r="16" fill="transparent" stroke="#F28C28" strokeWidth="8" />
                    <circle
                      cx="24"
                      cy="24"
                      r="16"
                      fill="transparent"
                      stroke="#3B5BDB"
                      strokeWidth="8"
                      strokeDasharray="100.5"
                      strokeDashoffset="44"
                    />
                  </svg>
                  <div className="text-xs font-semibold text-[#1C1A33]">
                    <span className="text-[#3B5BDB]">You: 56%</span> / <span className="text-[#F28C28]">Them: 44%</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-[20px] font-heading font-bold text-[#1C1A33] mb-1">Who starts & who replies faster</h3>
                <p className="text-sm text-[#5A5873]">
                  Simple metrics on conversation balance and median response speed.
                </p>
              </div>
            </div>

            {/* Tile 3: Butter with Mini Hourly Bars */}
            <div className="p-6 bg-[#FFF3C9] rounded-[20px] flex flex-col justify-between gap-4">
              <div className="h-16 flex items-end gap-1.5 pb-1">
                {[12, 18, 30, 24, 45, 60, 80, 75, 40, 20].map((h, i) => (
                  <div
                    key={i}
                    className="w-3 rounded-t"
                    style={{
                      height: `${(h / 80) * 44}px`,
                      backgroundColor: i >= 6 ? '#CF3A26' : '#CFC3FF',
                    }}
                  />
                ))}
              </div>
              <div>
                <h3 className="text-[20px] font-heading font-bold text-[#1C1A33] mb-1">Late-night patterns</h3>
                <p className="text-sm text-[#5A5873]">
                  Message volume sent between 10pm and 4am highlighted in coral.
                </p>
              </div>
            </div>

            {/* Tile 4: Lilac with Mini Closeness Line */}
            <div className="p-6 bg-[#E9E3FF] rounded-[20px] flex flex-col justify-between gap-4">
              <div className="h-16 flex items-center">
                <svg viewBox="0 0 140 40" className="w-36 h-10 overflow-visible">
                  <path
                    d="M 5,28 Q 35,5 70,22 T 135,8"
                    fill="none"
                    stroke="#CF3A26"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="70" cy="22" r="3.5" fill="#FFFFFF" stroke="#CF3A26" strokeWidth="2.5" />
                  <circle cx="135" cy="8" r="3.5" fill="#FFFFFF" stroke="#CF3A26" strokeWidth="2.5" />
                </svg>
              </div>
              <div>
                <h3 className="text-[20px] font-heading font-bold text-[#1C1A33] mb-1">Month-by-month closeness</h3>
                <p className="text-sm text-[#5A5873]">
                  Watch the trajectory deepen or pause across months.
                </p>
              </div>
            </div>

            {/* Tile 5: Blush with Turning Point Marker */}
            <div className="p-6 bg-[#FFE0E8] rounded-[20px] flex flex-col justify-between gap-4">
              <div className="h-16 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#CF3A26] text-white flex items-center justify-center font-bold text-sm">
                  #1
                </div>
                <div className="text-xs font-semibold text-[#1C1A33]">
                  Late night shift · Aug
                </div>
              </div>
              <div>
                <h3 className="text-[20px] font-heading font-bold text-[#1C1A33] mb-1">Turning points</h3>
                <p className="text-sm text-[#5A5873]">
                  Spot the notable months where your conversation pace changed.
                </p>
              </div>
            </div>

            {/* Tile 6: White with Mini Bubble Pair */}
            <div className="p-6 bg-white rounded-[20px] flex flex-col justify-between gap-4">
              <div className="h-16 flex flex-col justify-center gap-1.5">
                <div className="self-start bg-[#F1EDFF] px-2.5 py-1 rounded-t-lg rounded-br-lg text-xs font-medium text-[#1C1A33]">
                  "Kal milte hain canteen me"
                </div>
                <div className="self-end bg-[#D6E2FF] px-2.5 py-1 rounded-t-lg rounded-bl-lg text-xs font-medium text-[#1C1A33]">
                  "Done deal!"
                </div>
              </div>
              <div>
                <h3 className="text-[20px] font-heading font-bold text-[#1C1A33] mb-1">Cleo's written read with quotes</h3>
                <p className="text-sm text-[#5A5873]">
                  An honest, friendly summary quoting exact messages from your chat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. YOUR PRIVACY BAND ON LILAC #E9E3FF */}
      <section className="w-full bg-[#E9E3FF] py-20 md:py-24">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <div className="max-w-[760px] mx-auto bg-white border border-[#E7E5F0] rounded-[28px] p-8 sm:p-12">
            <h2 className="text-[28px] md:text-[34px] font-heading font-bold text-[#1C1A33] mb-6">
              Your privacy
            </h2>
            <ol className="list-decimal pl-5 space-y-4 text-base text-[#1C1A33] leading-relaxed">
              <li>Your chat file is deleted right after your report is created.</li>
              <li>Your report is saved to your account until you delete it.</li>
              <li>Reports can include short quotes from your chat.</li>
              <li>You can delete any report, or your whole account, at any time.</li>
              <li>Nothing is shared with the people in the chat, and nothing is sold.</li>
            </ol>
            <div className="mt-8 pt-6 border-t border-[#E7E5F0]">
              <Link
                to="/privacy"
                className="text-base text-[#1C1A33] underline underline-offset-4 hover:text-[#CF3A26] font-semibold transition-colors duration-150"
              >
                Read the full privacy page
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA BAND ON CORAL #CF3A26 */}
      <section className="w-full bg-[#CF3A26] text-white py-16 md:py-20">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-8 text-center sm:text-left">
          <div>
            <h2 className="text-[32px] md:text-[40px] font-heading font-bold text-white tracking-tight">
              Ready to see your chat?
            </h2>
            <p className="text-white/80 text-base md:text-lg mt-2">
              Export your chat without media and upload it to start.
            </p>
          </div>
          <Link
            to={user ? "/new" : "/signup"}
            className="min-h-[48px] px-8 py-3 bg-white text-[#1C1A33] hover:bg-[#FFF3C9] font-semibold text-base rounded-full transition-colors duration-150 inline-flex items-center justify-center shrink-0"
          >
            Upload a chat
          </Link>
        </div>
      </section>
    </div>
  );
};
