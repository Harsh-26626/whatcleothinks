import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="w-full flex flex-col py-12 md:py-[72px]">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start pb-16 md:pb-24 border-b border-[#E5E5E1]">
        {/* Left Column: Heading, Subtitle, Actions */}
        <div className="flex flex-col items-start max-w-[520px]">
          <h1 className="text-[30px] md:text-[40px] font-bold leading-tight text-[#1A1A1A] tracking-tight">
            See how your chat changed, month by month.
          </h1>
          <p className="text-base md:text-lg text-[#5F5F5A] mt-4 leading-normal">
            Upload a WhatsApp chat. Cleo reads it and tells you what she notices, honestly and kindly.
          </p>
          <div className="flex flex-wrap items-center gap-6 mt-8">
            <Link
              to={user ? "/new" : "/signup"}
              className="min-h-[44px] px-6 py-3 bg-[#F2B01E] text-[#1A1A1A] font-semibold text-base rounded-lg hover:opacity-90 transition-opacity duration-150 inline-flex items-center justify-center"
            >
              Upload a chat
            </Link>
            <Link
              to="/privacy"
              className="text-base text-[#1A1A1A] underline underline-offset-4 hover:text-[#5F5F5A] transition-colors duration-150 font-medium"
            >
              How privacy works
            </Link>
          </div>
        </div>

        {/* Right Column: Clean static sample of a real report section */}
        <div className="w-full bg-[#F6F6F4] border border-[#E5E5E1] rounded-xl p-6 flex flex-col gap-4">
          <div className="text-xs text-[#5F5F5A] font-medium uppercase tracking-wider">
            Sample report · Aarav and Meera
          </div>

          <div>
            <div className="text-sm font-semibold text-[#1A1A1A]">Monthly closeness (Jul – Dec)</div>
            <div className="text-xs text-[#5F5F5A] mt-0.5">Scale from 0 to 100 based on message volume and reply speed</div>
          </div>

          {/* Simple static SVG closeness line chart */}
          <div className="w-full h-32 pt-2">
            <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible">
              {/* Reference line */}
              <line x1="20" y1="90" x2="380" y2="90" stroke="#E5E5E1" strokeWidth="1" />
              {/* Line path for sampleMonthly */}
              <path
                d="M 30,50 L 100,20 L 170,75 L 240,40 L 310,30 L 370,12"
                fill="none"
                stroke="#F2B01E"
                strokeWidth="2.5"
              />
              {/* Points with labels */}
              {[
                { x: 30, y: 50, month: 'Jul', val: 72 },
                { x: 100, y: 20, month: 'Aug', val: 86 },
                { x: 170, y: 75, month: 'Sep', val: 58 },
                { x: 240, y: 40, month: 'Oct', val: 75 },
                { x: 310, y: 30, month: 'Nov', val: 82 },
                { x: 370, y: 12, month: 'Dec', val: 91 },
              ].map((pt, i) => (
                <g key={i}>
                  <circle cx={pt.x} cy={pt.y} r="3.5" fill="#FFFFFF" stroke="#F2B01E" strokeWidth="2" />
                  <text x={pt.x} y="98" textAnchor="middle" className="text-[10px] fill-[#5F5F5A]">
                    {pt.month}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* One chat bubble quote */}
          <div className="border-t border-[#E5E5E1] pt-3 flex flex-col gap-2">
            <div className="text-xs text-[#5F5F5A]">18 Aug 2024 · 02:04 AM</div>
            <div className="self-end bg-[#2F5BEA] text-white px-3 py-2 rounded-lg text-sm max-w-[85%]">
              <span className="text-[11px] block font-semibold text-white/80">You</span>
              Tu soyi nahi abhi tak? 2 baj rahe
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (3 steps in a row, numbered 1-3 in plain bold text) */}
      <section className="py-16 md:py-20 border-b border-[#E5E5E1]">
        <h2 className="text-[28px] font-bold text-[#1A1A1A] mb-8">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div>
            <div className="text-xl font-bold text-[#1A1A1A] mb-2">1. Export your chat</div>
            <p className="text-base text-[#5F5F5A]">
              In WhatsApp, tap your chat options and select Export Chat without media. It produces a plain text file.
            </p>
          </div>
          <div>
            <div className="text-xl font-bold text-[#1A1A1A] mb-2">2. Upload it and pick who you are</div>
            <p className="text-base text-[#5F5F5A]">
              Select your export file and choose your name so Cleo speaks directly to you.
            </p>
          </div>
          <div>
            <div className="text-xl font-bold text-[#1A1A1A] mb-2">3. Read your report</div>
            <p className="text-base text-[#5F5F5A]">
              Get your daily heatmap, reply times, month-by-month changes, and written observations with quotes.
            </p>
          </div>
        </div>
      </section>

      {/* What's in your report (plain two-column list) */}
      <section className="py-16 md:py-20 border-b border-[#E5E5E1]">
        <h2 className="text-[28px] font-bold text-[#1A1A1A] mb-8">What is in your report</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-base text-[#1A1A1A]">
          <div className="py-2 border-b border-[#E5E5E1]">
            <strong>Heatmap of every day:</strong> see busy weeks and quiet stretches across the entire conversation.
          </div>
          <div className="py-2 border-b border-[#E5E5E1]">
            <strong>Who starts and who replies faster:</strong> simple metrics on conversation balance and median response speed.
          </div>
          <div className="py-2 border-b border-[#E5E5E1]">
            <strong>Late-night patterns:</strong> message totals between 10 PM and 4 AM compared to daytime hours.
          </div>
          <div className="py-2 border-b border-[#E5E5E1]">
            <strong>Month-by-month closeness:</strong> track when the conversation sped up or dipped over time.
          </div>
          <div className="py-2 border-b border-[#E5E5E1]">
            <strong>Turning points:</strong> specific months where message habits noticeably shifted.
          </div>
          <div className="py-2 border-b border-[#E5E5E1]">
            <strong>Cleo's written read with real quotes:</strong> an honest, friendly summary quoting exact messages from your chat.
          </div>
        </div>
      </section>

      {/* Your privacy (the five statements as a numbered list) */}
      <section className="py-16 md:py-20 border-b border-[#E5E5E1]">
        <h2 className="text-[28px] font-bold text-[#1A1A1A] mb-6">Your privacy</h2>
        <ol className="list-decimal pl-5 space-y-3 text-base text-[#1A1A1A] max-w-[680px]">
          <li>Your chat file is deleted right after your report is created.</li>
          <li>Your report is saved to your account until you delete it.</li>
          <li>Reports can include short quotes from your chat.</li>
          <li>You can delete any report, or your whole account, at any time.</li>
          <li>Nothing is shared with the people in the chat, and nothing is sold.</li>
        </ol>
        <div className="mt-6">
          <Link
            to="/privacy"
            className="text-base text-[#1A1A1A] underline underline-offset-4 hover:text-[#5F5F5A] transition-colors duration-150 font-medium"
          >
            Read the full privacy page
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pt-16 md:pt-20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-[28px] font-bold text-[#1A1A1A]">Ready to see your chat?</h2>
          <p className="text-base text-[#5F5F5A] mt-1">
            Export a chat without media and upload it to start.
          </p>
        </div>
        <Link
          to={user ? "/new" : "/signup"}
          className="min-h-[44px] px-6 py-3 bg-[#F2B01E] text-[#1A1A1A] font-semibold text-base rounded-lg hover:opacity-90 transition-opacity duration-150 inline-flex items-center justify-center self-start sm:self-auto"
        >
          Upload a chat
        </Link>
      </section>
    </div>
  );
};
