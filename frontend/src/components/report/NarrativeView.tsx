import React from 'react';
import { Narrative, Participant } from '../../types';
import { ChatBubble } from './ChatBubble';

interface NarrativeViewProps {
  narrative: Narrative;
  participants: Participant[];
  onTakeBreak: () => void;
}

export const NarrativeView: React.FC<NarrativeViewProps> = ({
  narrative,
  participants,
  onTakeBreak,
}) => {
  const myParticipant = participants.find((p) => p.isMe);

  return (
    <section className="bg-surface-container-lowest p-space-lg md:p-space-xl rounded-2xl shadow-sm border border-outline-variant/20 relative overflow-hidden flex flex-col gap-space-xl w-full">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Narrative Section Header & "Take a Breath" Pause Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md border-b border-surface-container-high pb-space-md">
        <div className="flex items-center gap-space-md">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-on-primary font-serif font-bold text-2xl shadow-md">
            C
          </div>
          <div>
            <div className="flex items-center gap-2 text-label-sm text-primary font-medium uppercase tracking-wider">
              <span>Cleo's Editorial Perspective</span>
              <span>•</span>
              <span>Quiet Observations</span>
            </div>
            <h2 className="font-headline-lg text-on-surface">The Story Between the Lines</h2>
          </div>
        </div>

        {/* Take a break button */}
        <button
          onClick={onTakeBreak}
          className="flex items-center gap-space-xs bg-surface-container-low hover:bg-surface-container px-space-md py-2.5 rounded-xl text-label-md text-on-surface transition-colors shadow-sm border border-outline-variant/25"
        >
          <span className="material-symbols-outlined text-primary text-[20px]">spa</span>
          <span>Take a breath</span>
        </button>
      </div>

      {/* Gentle Safety Note (if flagged in narrative) */}
      {narrative.safetyNote && (
        <div className="bg-amber-50 border border-amber-200 p-space-md rounded-2xl text-amber-900 text-body-md flex items-start gap-space-sm shadow-sm">
          <span className="material-symbols-outlined text-amber-600 text-2xl shrink-0 mt-0.5">favorite</span>
          <div>
            <h4 className="font-headline-sm text-amber-950">A Caring Note from Cleo</h4>
            <p className="mt-1 leading-relaxed">{narrative.safetyNote}</p>
          </div>
        </div>
      )}

      {/* Editorial Intro Paragraphs */}
      {narrative.intro && narrative.intro.length > 0 && (
        <div className="flex flex-col gap-space-md border-l-2 border-primary/40 pl-space-lg py-1 italic font-serif text-body-lg text-on-surface leading-relaxed max-w-3xl">
          {narrative.intro.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      )}

      {/* Story Sections */}
      <div className="flex flex-col gap-space-xl">
        {narrative.sections.map((sec, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-space-md pt-space-lg border-t border-surface-container-high first:border-t-0 first:pt-0"
          >
            <h3 className="font-headline-lg text-on-surface tracking-tight">
              {sec.heading}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
              {/* Text prose */}
              <div className="lg:col-span-7 flex flex-col gap-space-md font-serif text-body-lg text-on-surface/90 leading-relaxed">
                {sec.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>

              {/* Chat Quotes in WhatsApp Style Bubbles */}
              {sec.quotes && sec.quotes.length > 0 && (
                <div className="lg:col-span-5 flex flex-col justify-center">
                  <div className="bg-surface-container-low/70 p-space-md rounded-2xl border border-outline-variant/20 flex flex-col gap-space-sm shadow-inner">
                    <div className="text-[11px] font-semibold tracking-wider text-on-surface-variant uppercase mb-1">
                      Memorable Exchange
                    </div>
                    {sec.quotes.map((q) => {
                      const isMe = myParticipant ? q.sender === myParticipant.name : false;
                      return <ChatBubble key={q.id} quote={q} isMe={isMe} />;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Closing Reflection */}
      {narrative.closing && narrative.closing.length > 0 && (
        <div className="bg-surface-container-low p-space-lg md:p-space-xl rounded-2xl border border-outline-variant/25 flex flex-col gap-space-md">
          <div className="flex items-center gap-2 text-label-sm font-semibold text-primary uppercase tracking-wider">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Cleo's Parting Thought</span>
          </div>

          <div className="font-serif text-headline-sm text-on-surface leading-relaxed">
            {narrative.closing.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
