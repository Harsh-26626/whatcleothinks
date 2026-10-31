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
    <section id="cleos-read" className="w-full max-w-[680px] mx-auto flex flex-col gap-8 scroll-mt-24">
      {/* Top Bar: Cleo Avatar (48) + "Cleo's read" + "Take a break" */}
      <div className="flex items-center justify-between pb-6 border-b border-[#E7E5F0]">
        <div className="flex items-center gap-3.5">
          <CleoAvatar size={48} />
          <h2 className="font-heading font-bold text-[28px] sm:text-[32px] text-[#1C1A33]">
            Cleo's read
          </h2>
        </div>
        {!isPaused && (
          <button
            onClick={() => setIsPaused(true)}
            className="text-sm font-semibold text-[#5A5873] hover:text-[#CF3A26] underline underline-offset-4 transition-colors duration-150"
          >
            Take a break
          </button>
        )}
      </div>

      {/* Paused State: Soft Peach Card (#FFE5D6, 28px radius) */}
      {isPaused ? (
        <div className="bg-[#FFE5D6] rounded-[28px] p-8 sm:p-10 flex flex-col items-start gap-5 shadow-sm">
          <CleoAvatar size={48} />
          <h3 className="font-heading font-bold text-2xl text-[#1C1A33]">
            Reading paused
          </h3>
          <p className="text-[18px] leading-[1.7] text-[#1C1A33] font-medium">
            Taking in old conversations can bring up a lot. Take all the time you need.
          </p>
          <button
            onClick={() => setIsPaused(false)}
            className="mt-2 min-h-[48px] px-7 py-2.5 bg-white border-[1.5px] border-[#1C1A33] text-[#1C1A33] font-semibold text-base rounded-full hover:bg-[#F1EDFF] transition-colors duration-150"
          >
            Continue reading
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Safety Note if present: Peach bubble callout (#FFE5D6) with Cleo avatar (32) */}
          {narrative.safetyNote && (
            <div className="bg-[#FFE5D6] rounded-[20px] p-6 flex items-start gap-4">
              <div className="shrink-0 mt-0.5">
                <CleoAvatar size={32} />
              </div>
              <div className="text-[17px] leading-[1.6] text-[#1C1A33]">
                <strong className="font-heading font-bold block mb-1 text-[#1C1A33]">
                  A note from Cleo:
                </strong>
                {narrative.safetyNote}
              </div>
            </div>
          )}

          {/* Intro Paragraphs: 18px / 1.7 in Figtree */}
          {narrative.intro && narrative.intro.length > 0 && (
            <div className="flex flex-col gap-5 text-[18px] leading-[1.7] text-[#1C1A33]">
              {narrative.intro.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}

          {/* Sections with Headings & WhatsApp-style quote exchanges */}
          {narrative.sections.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-4 pt-8 border-t border-[#E7E5F0]">
              <h3 className="font-heading font-bold text-[24px] sm:text-[28px] text-[#1C1A33]">
                {section.heading}
              </h3>

              <div className="flex flex-col gap-5 text-[18px] leading-[1.7] text-[#1C1A33]">
                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>

              {/* Grouped Quote Exchange inside a Chat-Exchange Panel: Lilac tint (#F1EDFF), 28px radius */}
              {section.quotes && section.quotes.length > 0 && (
                <div className="my-6 p-6 sm:p-8 bg-[#F1EDFF] rounded-[28px] flex flex-col gap-3">
                  {/* White date pill at the top of the exchange */}
                  <div className="bg-white px-3.5 py-1 rounded-full text-xs font-semibold text-[#5A5873] border border-[#E7E5F0] self-center mb-3 shadow-xs">
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
            <div className="pt-8 border-t border-[#E7E5F0] flex flex-col gap-5 text-[18px] leading-[1.7] text-[#1C1A33]">
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