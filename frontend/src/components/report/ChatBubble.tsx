import React from 'react';
import { Quote } from '../../types';

interface ChatBubbleProps {
  quote: Quote;
  isMe: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ quote, isMe }) => {
  const formatTime = (ts: string) => {
    try {
      const date = new Date(ts);
      if (isNaN(date.getTime())) return ts;
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return ts;
    }
  };

  return (
    <div className={`flex flex-col my-1 max-w-[90%] sm:max-w-[85%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
      <div
        className={`px-3.5 py-2.5 sm:px-4 sm:py-3 leading-normal ${
          isMe
            ? 'bg-[#D6E2FF] text-[#1C1A33] bubble-out shadow-xs'
            : 'bg-white border border-[#E7E5F0] text-[#1C1A33] bubble-in shadow-xs'
        }`}
      >
        <span className="block text-[11px] sm:text-xs font-semibold mb-0.5 text-[#5A5873]">
          {isMe ? 'You' : quote.sender}
        </span>
        <p className="whitespace-pre-wrap font-sans text-[14px] sm:text-[15px] md:text-base text-[#1C1A33] break-words">
          {quote.text}
        </p>
        <span className="block text-[10px] sm:text-[11px] text-right mt-1 font-sans text-[#5A5873]">
          {formatTime(quote.ts)}
        </span>
      </div>
    </div>
  );
};