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
    <div className={`flex flex-col my-1 max-w-[85%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
      <div
        className={`px-3.5 py-2.5 rounded-lg text-base leading-normal ${
          isMe
            ? 'bg-[#2F5BEA] text-white'
            : 'bg-[#F6F6F4] border border-[#E5E5E1] text-[#1A1A1A]'
        }`}
      >
        <span className={`block text-xs font-semibold mb-0.5 ${isMe ? 'text-white/80' : 'text-[#5F5F5A]'}`}>
          {isMe ? 'You' : quote.sender}
        </span>
        <p className="whitespace-pre-wrap">{quote.text}</p>
        <span
          className={`block text-[11px] text-right mt-1 font-mono ${
            isMe ? 'text-white/70' : 'text-[#5F5F5A]'
          }`}
        >
          {formatTime(quote.ts)}
        </span>
      </div>
    </div>
  );
};
