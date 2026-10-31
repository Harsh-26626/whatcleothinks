import React from 'react';
import { MonthlyItem, TurningPoint } from '../../types';

interface MonthlyEvolutionProps {
  monthly: MonthlyItem[];
  turningPoints: TurningPoint[];
}

export const MonthlyEvolution: React.FC<MonthlyEvolutionProps> = ({
  monthly,
  turningPoints,
}) => {
  if (!monthly || monthly.length === 0) return null;

  const formatMonth = (m: string) => {
    try {
      const parts = m.split('-');
      const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, 1);
      return date.toLocaleDateString([], { month: 'short', year: 'numeric' });
    } catch {
      return m;
    }
  };

  const maxMessages = Math.max(1, ...monthly.map((m) => m.messages));

  const width = 800;
  const height = 240;
  const paddingX = 48;
  const paddingY = 40;
  const plotWidth = width - paddingX * 2;
  const plotHeight = height - paddingY * 2;

  const points = monthly.map((item, index) => {
    const x = paddingX + (index / Math.max(1, monthly.length - 1)) * plotWidth;
    const closenessVal = item.closeness ?? 50;
    const y = paddingY + (1 - closenessVal / 100) * plotHeight;
    return { x, y, item, index };
  });

  const linePath = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`;
  }, '');

  const tintRotation = ['bg-[#FFE5D6]', 'bg-[#DCEBFF]', 'bg-[#E9E3FF]', 'bg-[#FFF3C9]', 'bg-[#FFE0E8]'];

  return (
    <section id="over-time" className="p-6 sm:p-8 bg-white border border-[#E7E5F0] rounded-[28px] flex flex-col gap-8 scroll-mt-24">
      <div>
        <h2 className="font-heading font-bold text-[28px] sm:text-[34px] text-[#1C1A33] tracking-tight">
          Closeness over time
        </h2>
        <p className="text-base text-[#5A5873] mt-1">
          Month-by-month changes in connection, shown with monthly message volume bars.
        </p>
      </div>

      {/* SVG Chart on 28px white panel */}
      <div className="w-full relative overflow-x-auto pt-2 pb-2">
        <svg viewBox={`0 0 ${width} ${height + 30}`} className="w-full min-w-[600px] h-auto overflow-visible">
          {/* Baseline axis */}
          <line
            x1={paddingX - 10}
            y1={height - paddingY + 14}
            x2={width - paddingX + 10}
            y2={height - paddingY + 14}
            stroke="#E7E5F0"
            strokeWidth="1.5"
          />

          {/* Volume Bars in Lilac #CFC3FF behind the line */}
          {points.map((p, i) => {
            const barHeight = (p.item.messages / maxMessages) * (plotHeight * 0.75);
            const barY = height - paddingY + 14 - barHeight;
            return (
              <rect
                key={`bar-${i}`}
                x={p.x - 16}
                y={barY}
                width={32}
                height={barHeight}
                fill="#CFC3FF"
                rx={4}
                className="transition-opacity hover:opacity-80"
              >
                <title>{`${formatMonth(p.item.month)}: ${p.item.messages} messages`}</title>
              </rect>
            );
          })}

          {/* Closeness Line in Coral #CF3A26, 3px thick */}
          <path
            d={linePath}
            fill="none"
            stroke="#CF3A26"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points & Numbered Coral Circles for Turning Points */}
          {points.map((p) => {
            const tpIndex = turningPoints.findIndex((tp) => tp.month === p.item.month);
            const isTurningPoint = tpIndex !== -1;

            return (
              <g key={`pt-${p.index}`}>
                {isTurningPoint ? (
                  /* Numbered Coral Circle on the line for turning points */
                  <g className="cursor-pointer">
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={13}
                      fill="#CF3A26"
                      stroke="#FFFFFF"
                      strokeWidth={2.5}
                    />
                    <text
                      x={p.x}
                      y={p.y + 4.5}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="11"
                      fontWeight="bold"
                      className="font-sans select-none"
                    >
                      #{tpIndex + 1}
                    </text>
                  </g>
                ) : (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={4.5}
                    fill="#FFFFFF"
                    stroke="#CF3A26"
                    strokeWidth={2.5}
                  />
                )}

                {/* Month label on x-axis */}
                <text
                  x={p.x}
                  y={height + 18}
                  textAnchor="middle"
                  className="text-xs font-semibold fill-[#5A5873]"
                >
                  {formatMonth(p.item.month)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend & Note */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-semibold text-[#5A5873] pt-4 border-t border-[#E7E5F0]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 bg-[#CF3A26] rounded-full" />
            <span className="text-[#1C1A33]">Closeness (0–100)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 bg-[#CFC3FF] rounded-[3px]" />
            <span className="text-[#1C1A33]">Message volume</span>
          </div>
        </div>
        <div className="text-[#5A5873] font-normal">
          Closeness is an estimate based on message volume, reply speed and tone.
        </div>
      </div>

      {/* Turning Points List */}
      {turningPoints && turningPoints.length > 0 && (
        <div className="mt-4 pt-6 border-t border-[#E7E5F0]">
          <h3 className="font-heading font-bold text-2xl text-[#1C1A33] mb-6">
            Turning points
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {turningPoints.map((tp, index) => {
              const bgClass = tintRotation[index % tintRotation.length];
              return (
                <div
                  key={index}
                  className={`p-6 rounded-[20px] ${bgClass} flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#CF3A26] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                        #{index + 1}
                      </div>
                      <span className="text-xs font-bold text-[#1C1A33]/70">
                        {formatMonth(tp.month)}
                      </span>
                    </div>
                    <div className="font-heading font-bold text-lg text-[#1C1A33] mb-2 leading-snug">
                      {tp.title}
                    </div>
                    <p className="text-sm text-[#1C1A33]/85 leading-normal">
                      {tp.note}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};