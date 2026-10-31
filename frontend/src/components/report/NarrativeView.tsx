import React, { useState } from 'react';
import { Narrative, Participant } from '../../types';
import { ChatBubble } from './ChatBubble';

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
    <section id="cleos-read" className="w-full max-w-[680px] flex flex-col gap-8 scroll-mt-20">
      {/* Section Title and "Take a break" Link */}
      <div className="flex items-center justify-between border-b border-[#E5E5E1] pb-4">
        <h2 className="text-[28px] font-bold text-[#1A1A1A]">Cleo's read</h2>
        {!isPaused && (
          <button
            onClick={() => setIsPaused(true)}
            className="text-sm text-[#5F5F5A] hover:text-[#1A1A1A] underline underline-offset-4"
          >
            Take a break
          </button>
        )}
      </div>

      {/* Paused State */}
      {isPaused ? (
        <div className="p-6 bg-[#F6F6F4] border border-[#E5E5E1] rounded-xl flex flex-col items-start gap-4">
          <p className="text-base text-[#1A1A1A]">
            Reading paused. Taking in old conversations can bring up a lot. Take all the time you need.
          </p>
          <button
            onClick={() => setIsPaused(false)}
            className="min-h-[44px] px-5 py-2.5 bg-[#F2B01E] text-[#1A1A1A] font-semibold text-base rounded-lg hover:opacity-90"
          >
            Continue reading
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Safety Note if present */}
          {narrative.safetyNote && (
            <div className="p-4 bg-white border border-[#E5E5E1] rounded-lg text-base text-[#1A1A1A] leading-[1.7]">
              <strong className="block font-semibold mb-1">A note from Cleo:</strong>
              {narrative.safetyNote}
            </div>
          )}

          {/* Intro Paragraphs */}
          {narrative.intro && narrative.intro.length > 0 && (
            <div className="flex flex-col gap-4 text-lg leading-[1.7] text-[#1A1A1A]">
              {narrative.intro.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}

          {/* Sections with Headings & WhatsApp-style quote exchanges */}
          {narrative.sections.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-4 pt-6 border-t border-[#E5E5E1]">
              <h3 className="text-[22px] font-bold text-[#1A1A1A]">{section.heading}</h3>

              <div className="flex flex-col gap-4 text-lg leading-[1.7] text-[#1A1A1A]">
                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>

              {/* Grouped Quote Exchange with Date Header */}
              {section.quotes && section.quotes.length > 0 && (
                <div className="my-4 p-4 bg-white border border-[#E5E5E1] rounded-xl flex flex-col gap-2">
                  {/* Date shown above the exchange */}
                  <div className="text-xs font-semibold text-[#5F5F5A] border-b border-[#E5E5E1] pb-2 mb-1">
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
            <div className="pt-6 border-t border-[#E5E5E1] flex flex-col gap-4 text-lg leading-[1.7] text-[#1A1A1A]">
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
