import React, { useState } from 'react';
import { Narrative, Participant } from '../../types';
import { ChatBubble } from './ChatBubble';
import { CleoAvatar } from '../CleoAvatar';

interface NarrativeViewProps {
  narrative: Narrative;
  participants: Participant[];
}

export const NarrativeView: React.FC<NarrativeViewProps> = ({
  narrative,
  participants,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const myParticipant = participants.find((p) => p.isMe);

  const formatDateHeader = (ts: string) => {
    try {
      const d = new Date(ts);
      if (isNaN(d.getTime())) return ts;
      return d.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return ts;
    }
  };

  return (
    <section id="cleos-read" className="w-full max-w-[680px] mx-auto flex flex-col gap-6 sm:gap-8 scroll-mt-24">
      {/* Top Bar: Cleo Avatar + "Cleo's read" + "Take a break" */}
      <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-[#E7E5F0]">
        <div className="flex items-center gap-3 sm:gap-3.5">
          <div className="scale-90 sm:scale-100">
            <CleoAvatar size={40} />
          </div>
          <h2 className="font-heading font-bold text-[22px] sm:text-[32px] text-[#1C1A33]">
            Cleo's read
          </h2>
        </div>
        {!isPaused && (
          <button
            onClick={() => setIsPaused(true)}
            className="text-xs sm:text-sm font-semibold text-[#5A5873] hover:text-[#CF3A26] underline underline-offset-4 transition-colors duration-150 p-1"
          >
            Take a break
          </button>
        )}
      </div>

      {/* Paused State: Soft Peach Card (#FFE5D6, 28px radius on desktop, 22px on mobile) */}
      {isPaused ? (
        <div className="bg-[#FFE5D6] rounded-[22px] sm:rounded-[28px] p-6 sm:p-10 flex flex-col items-start gap-4 sm:gap-5 shadow-sm">
          <CleoAvatar size={44} />
          <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#1C1A33]">
            Reading paused
          </h3>
          <p className="text-base sm:text-[18px] leading-[1.65] sm:leading-[1.7] text-[#1C1A33] font-medium">
            Taking in old conversations can bring up a lot. Take all the time you need.
          </p>
          <button
            onClick={() => setIsPaused(false)}
            className="w-full sm:w-auto mt-2 min-h-[48px] px-7 py-2.5 bg-white border-[1.5px] border-[#1C1A33] text-[#1C1A33] font-semibold text-base rounded-full hover:bg-[#F1EDFF] transition-colors duration-150 flex items-center justify-center"
          >
            Continue reading
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6 sm:gap-8">
          {/* Safety Note if present: Peach bubble callout (#FFE5D6) with Cleo avatar (32) */}
          {narrative.safetyNote && (
            <div className="bg-[#FFE5D6] rounded-[18px] sm:rounded-[20px] p-4 sm:p-6 flex items-start gap-3 sm:gap-4">
              <div className="shrink-0 mt-0.5">
                <CleoAvatar size={28} />
              </div>
              <div className="text-sm sm:text-[17px] leading-[1.6] text-[#1C1A33]">
                <strong className="font-heading font-bold block mb-1 text-[#1C1A33]">
                  A note from Cleo:
                </strong>
                {narrative.safetyNote}
              </div>
            </div>
          )}

          {/* Intro Paragraphs: 16px/1.65 on mobile, 18px/1.7 on desktop */}
          {narrative.intro && narrative.intro.length > 0 && (
            <div className="flex flex-col gap-4 sm:gap-5 text-[16px] sm:text-[18px] leading-[1.65] sm:leading-[1.7] text-[#1C1A33]">
              {narrative.intro.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}

          {/* Sections with Headings & WhatsApp-style quote exchanges */}
          {narrative.sections.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-3.5 sm:gap-4 pt-6 sm:pt-8 border-t border-[#E7E5F0]">
              <h3 className="font-heading font-bold text-xl sm:text-[28px] text-[#1C1A33]">
                {section.heading}
              </h3>

              <div className="flex flex-col gap-4 sm:gap-5 text-[16px] sm:text-[18px] leading-[1.65] sm:leading-[1.7] text-[#1C1A33]">
                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>

              {/* Grouped Quote Exchange inside a Chat-Exchange Panel: Lilac tint (#F1EDFF) */}
              {section.quotes && section.quotes.length > 0 && (
                <div className="my-4 sm:my-6 p-4 sm:p-8 bg-[#F1EDFF] rounded-[22px] sm:rounded-[28px] flex flex-col gap-2.5 sm:gap-3">
                  {/* White date pill at the top of the exchange */}
                  <div className="bg-white px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold text-[#5A5873] border border-[#E7E5F0] self-center mb-2 shadow-xs">
                    {formatDateHeader(section.quotes[0].ts)}
                  </div>
                  {section.quotes.map((quote) => {
                    const isMe = myParticipant ? quote.sender === myParticipant.name : false;
                    return <ChatBubble key={quote.id} quote={quote} isMe={isMe} />;
                  })}
                </div>
              )}
            </div>
          ))}

          {/* Closing Reflection */}
          {narrative.closing && narrative.closing.length > 0 && (
            <div className="pt-6 sm:pt-8 border-t border-[#E7E5F0] flex flex-col gap-4 sm:gap-5 text-[16px] sm:text-[18px] leading-[1.65] sm:leading-[1.7] text-[#1C1A33]">
              {narrative.closing.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};