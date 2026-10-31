import React from 'react';
import { Quote } from '../../types';

interface ChatBubbleProps {
  quote: Quote;
  isMe: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ quote, isMe }) => {
  // Format timestamp (naive local time)
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
    <div
      className={`flex flex-col my-1 max-w-[85%] sm:max-w-[75%] ${
        isMe ? 'self-end items-end' : 'self-start items-start'
      }`}
    >
      <div
        className={`p-space-sm sm:p-space-md rounded-2xl shadow-sm text-body-md transition-all ${
          isMe
            ? 'bg-primary text-on-primary rounded-tr-none'
            : 'bg-surface-container-high text-on-surface rounded-tl-none border border-outline-variant/20'
        }`}
      >
        {!isMe && (
          <div className="text-[11px] font-semibold tracking-wide text-primary mb-1 uppercase">
            {quote.sender}
          </div>
        )}
        <p className="leading-relaxed whitespace-pre-wrap select-text">{quote.text}</p>
        <div
          className={`text-[10px] text-right mt-1.5 font-mono ${
            isMe ? 'text-on-primary/80' : 'text-on-surface-variant'
          }`}
        >
          {formatTime(quote.ts)}
        </div>
      </div>
    </div>
  );
};
