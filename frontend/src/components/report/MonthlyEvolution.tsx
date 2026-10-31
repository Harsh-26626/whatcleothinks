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
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;
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

  return (
    <section id="over-time" className="p-6 bg-white border border-[#E5E5E1] rounded-xl flex flex-col gap-6 scroll-mt-20">
      <div>
        <h2 className="text-[28px] font-bold text-[#1A1A1A]">Closeness over time</h2>
        <p className="text-base text-[#5F5F5A] mt-1">
          Month-by-month changes in connection, shown with monthly message volume bars.
        </p>
      </div>

      {/* SVG Chart */}
      <div className="w-full relative overflow-hidden pt-2 pb-2">
        <svg viewBox={`0 0 ${width} ${height + 20}`} className="w-full h-auto overflow-visible">
          {/* Baseline axis */}
          <line
            x1={paddingX}
            y1={height - paddingY + 10}
            x2={width - paddingX}
            y2={height - paddingY + 10}
            stroke="#E5E5E1"
            strokeWidth="1"
          />

          {/* Volume Bars */}
          {points.map((p, i) => {
            const barHeight = (p.item.messages / maxMessages) * (plotHeight * 0.7);
            const barY = height - paddingY + 10 - barHeight;
            return (
              <rect
                key={`bar-${i}`}
                x={p.x - 14}
                y={barY}
                width={28}
                height={barHeight}
                fill="#E5E5E1"
                rx={2}
              />
            );
          })}

          {/* Closeness Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#F2B01E"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points & Numbered Turning Point Markers */}
          {points.map((p) => {
            const tpIndex = turningPoints.findIndex((tp) => tp.month === p.item.month);
            const isTurningPoint = tpIndex !== -1;

            return (
              <g key={`pt-${p.index}`}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isTurningPoint ? 7 : 4}
                  fill="#FFFFFF"
                  stroke="#F2B01E"
                  strokeWidth={isTurningPoint ? 3 : 2}
                />
                {isTurningPoint && (
                  <text
                    x={p.x}
                    y={p.y - 12}
                    textAnchor="middle"
                    className="text-[12px] font-bold fill-[#1A1A1A]"
                  >
                    #{tpIndex + 1}
                  </text>
                )}
                {/* Month label on x-axis */}
                <text
                  x={p.x}
                  y={height + 15}
                  textAnchor="middle"
                  className="text-[12px] fill-[#5F5F5A]"
                >
                  {formatMonth(p.item.month)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend & Tiny Note */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#5F5F5A] pt-3 border-t border-[#E5E5E1]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-[#F2B01E]" />
            <span>Closeness (0–100)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#E5E5E1] rounded-[2px]" />
            <span>Message volume</span>
          </div>
        </div>
        <div className="text-[#5F5F5A]">
          Closeness is an estimate based on message volume, reply speed and tone.
        </div>
      </div>

      {/* Turning Points List */}
      {turningPoints && turningPoints.length > 0 && (
        <div className="mt-4 pt-6 border-t border-[#E5E5E1]">
          <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">Turning points</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {turningPoints.map((tp, index) => (
              <div key={index} className="p-4 bg-[#F6F6F4] rounded-lg border border-[#E5E5E1]">
                <div className="text-xs font-semibold text-[#5F5F5A]">
                  #{index + 1} · {formatMonth(tp.month)}
                </div>
                <div className="text-base font-bold text-[#1A1A1A] mt-1">{tp.title}</div>
                <p className="text-sm text-[#5F5F5A] mt-1.5 leading-normal">{tp.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
