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
  if (!monthly || monthly.length === 0) {
    return null;
  }

  // Format month names (e.g. "2023-05" -> "May 23")
  const formatMonth = (m: string) => {
    try {
      const parts = m.split('-');
      const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, 1);
      return date.toLocaleDateString([], { month: 'short', year: '2-digit' });
    } catch {
      return m;
    }
  };

  // Max messages for secondary scaling
  const maxMessages = Math.max(1, ...monthly.map((m) => m.messages));

  // Compute SVG coordinates for the closeness curve
  const width = 800;
  const height = 180;
  const paddingX = 40;
  const paddingY = 25;
  const plotWidth = width - paddingX * 2;
  const plotHeight = height - paddingY * 2;

  const points = monthly.map((item, index) => {
    const x = paddingX + (index / Math.max(1, monthly.length - 1)) * plotWidth;
    // Closeness is 0-100 (null defaults to 50 for rendering)
    const closenessVal = item.closeness ?? 50;
    const y = paddingY + (1 - closenessVal / 100) * plotHeight;
    return { x, y, item };
  });

  // Construct SVG Path
  const linePath = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`;
  }, '');

  const areaPath = `${linePath} L ${points[points.length - 1].x},${height - 10} L ${points[0].x},${height - 10} Z`;

  return (
    <section className="bg-surface-container-lowest p-space-lg md:p-space-xl rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-lg w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1 text-label-sm font-medium text-primary uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[16px]">show_chart</span>
            <span>Month-by-Month Evolution</span>
          </div>
          <h3 className="font-headline-lg text-on-surface">Closeness & Rhythms Over Time</h3>
          <p className="font-body-sm text-on-surface-variant">
            How warmth, unhurried ease, and communication frequency evolved across {monthly.length} months
          </p>
        </div>

        <div className="flex items-center gap-space-sm text-label-sm">
          <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1 rounded-full border border-outline-variant/30">
            <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
            <span className="text-on-surface font-medium">Closeness (0–100)</span>
          </div>
          <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1 rounded-full border border-outline-variant/30">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
            <span className="text-on-surface-variant">Volume</span>
          </div>
        </div>
      </div>

      {/* Interactive Responsive SVG Area Chart */}
      <div className="w-full relative overflow-hidden pt-4 pb-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="closenessGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C96B5C" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#C96B5C" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Secondary Volume Bars */}
          {points.map((p, i) => {
            const barHeight = (p.item.messages / maxMessages) * (plotHeight * 0.7);
            const barY = height - 10 - barHeight;
            return (
              <rect
                key={`bar-${i}`}
                x={p.x - 12}
                y={barY}
                width={24}
                height={barHeight}
                rx={4}
                fill="#E3D7FE"
                opacity={0.65}
              />
            );
          })}

          {/* Area fill */}
          <path d={areaPath} fill="url(#closenessGrad)" />

          {/* Line stroke */}
          <path
            d={linePath}
            fill="none"
            stroke="#C96B5C"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points & Turning Point Highlights */}
          {points.map((p, i) => {
            const isTurningPoint = turningPoints.some((tp) => tp.month === p.item.month);
            return (
              <g key={`pt-${i}`} className="group cursor-pointer">
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isTurningPoint ? 7 : 5}
                  fill="#FBF6EF"
                  stroke="#C96B5C"
                  strokeWidth={isTurningPoint ? 3.5 : 2.5}
                />
                {isTurningPoint && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={12}
                    fill="none"
                    stroke="#C96B5C"
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                    className="animate-spin"
                  />
                )}
                {/* Closeness label above point */}
                <text
                  x={p.x}
                  y={p.y - 12}
                  textAnchor="middle"
                  className="text-[11px] font-bold fill-current text-primary"
                >
                  {p.item.closeness ?? ''}
                </text>
                {/* Month label below */}
                <text
                  x={p.x}
                  y={height + 2}
                  textAnchor="middle"
                  className="text-[11px] fill-current text-on-surface-variant font-medium"
                >
                  {formatMonth(p.item.month)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Turning Point Milestone Cards */}
      {turningPoints && turningPoints.length > 0 && (
        <div className="mt-space-xs">
          <div className="text-label-sm font-semibold uppercase tracking-wider text-on-surface mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-primary">flag</span>
            <span>Key Turning Points Identified by Cleo</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            {turningPoints.map((tp, index) => {
              const matchedMonth = monthly.find((m) => m.month === tp.month);
              return (
                <div
                  key={index}
                  className="bg-surface-container-low p-space-md rounded-2xl flex flex-col justify-between gap-2 border border-outline-variant/20 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-center justify-between text-label-sm text-primary font-medium">
                      <span>{formatMonth(tp.month)}</span>
                      <span className="text-[11px] bg-primary/10 px-2 py-0.5 rounded-full">
                        Turning Point {index + 1}
                      </span>
                    </div>
                    <h4 className="font-headline-sm text-on-surface mt-1">{tp.title}</h4>
                    <p className="text-body-sm text-on-surface-variant mt-1.5 leading-relaxed">
                      {tp.note}
                    </p>
                  </div>

                  {matchedMonth?.mood && (
                    <div className="text-[11px] text-on-surface-variant/90 italic pt-2 border-t border-surface-container-high">
                      Mood: "{matchedMonth.mood}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
