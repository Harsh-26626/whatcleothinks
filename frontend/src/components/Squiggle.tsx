import React from 'react';

export const Squiggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 280 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full overflow-visible ${className}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M3 11C35 4 65 14 98 8C130 3 162 13 194 8C226 3 255 12 277 7"
        stroke="#CF3A26"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
};

