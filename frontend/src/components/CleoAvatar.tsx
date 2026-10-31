import React from 'react';

interface CleoAvatarProps {
  size?: 32 | 48 | 96 | number;
  className?: string;
}

export const CleoAvatar: React.FC<CleoAvatarProps> = ({ size = 32, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="Cleo"
    >
      {/* Coral Circle */}
      <circle cx="48" cy="48" r="48" fill="#CF3A26" />

      {/* White Speech Bubble Motif */}
      <path
        d="M26 31C26 25.4772 30.4772 21 36 21H60C65.5228 21 70 25.4772 70 31V53C70 58.5228 65.5228 63 60 63H40L28 73V61.5C26.75 60 26 57 26 53V31Z"
        fill="#FFFFFF"
      />

      {/* Eyes (Two Ink Dots) */}
      <circle cx="42" cy="41" r="3.2" fill="#1C1A33" />
      <circle cx="54" cy="41" r="3.2" fill="#1C1A33" />

      {/* Small Smile Curve */}
      <path
        d="M43 49C44.5 52 51.5 52 53 49"
        stroke="#1C1A33"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

