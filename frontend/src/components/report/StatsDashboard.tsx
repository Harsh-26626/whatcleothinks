import React, { useMemo } from 'react';
import { Participant, ReportStats, DateRange } from '../../types';

interface StatsDashboardProps {
  stats: ReportStats;
  participants: Participant[];
  dateRange?: DateRange;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  stats,
  participants,
  dateRange,
}) => {
  // Compute Daily Calendar Heatmap grid
  const heatmapDays = useMemo(() => {
    if (!dateRange || !stats.daily) {
      // Fallback 120 days
      return Array.from({ length: 84 }, (_, i) => ({
        date: `Day ${i + 1}`,
        count: (i * 7) % 50,
      }));
    }

    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    const days: { date: string; count: number }[] = [];

    const current = new Date(start);
    while (current <= end) {
      const dateStr = current.toISOString().slice(0, 10);
      days.push({
        date: dateStr,
        count: stats.daily[dateStr] || 0,
      });
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, [dateRange, stats.daily]);

  // Max daily message count for heatmap opacity scaling
  const maxDayCount = useMemo(() => {
    return Math.max(1, ...heatmapDays.map((d) => d.count));
  }, [heatmapDays]);

  const getDayColor = (count: number) => {
    if (count === 0) return 'bg-surface-container-high/60';
    const ratio = count / maxDayCount;
    if (ratio < 0.15) return 'bg-primary/25';
    if (ratio < 0.4) return 'bg-primary/50';
    if (ratio < 0.75) return 'bg-primary/75';
    return 'bg-primary';
  };

  // Group participants for Share of Voice & Initiation
  const senderKeys = Object.keys(stats.bySender || {});
  const myParticipant = participants.find((p) => p.isMe);
  const otherParticipant = participants.find((p) => !p.isMe);

  // Hourly peak calculation
  const maxHour = Math.max(1, ...(stats.hourly || []));

  return (
    <div className="flex flex-col gap-space-lg w-full">
      {/* 4 Key Metric Stat Pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm">
        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="text-label-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-primary">local_fire_department</span>
            <span>Longest Streak</span>
          </div>
          <div className="font-headline-lg text-on-surface mt-2">
            {stats.longestStreakDays} <span className="text-label-md font-normal text-on-surface-variant">days</span>
          </div>
          <div className="text-body-sm text-on-surface-variant mt-1">Talking without a break</div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="text-label-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-primary">bedtime</span>
            <span>Longest Silence</span>
          </div>
          <div className="font-headline-lg text-on-surface mt-2">
            {stats.longestSilenceDays} <span className="text-label-md font-normal text-on-surface-variant">days</span>
          </div>
          <div className="text-body-sm text-on-surface-variant mt-1">Longest quiet stretch</div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="text-label-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-primary">emoji_events</span>
            <span>Record Day</span>
          </div>
          <div className="font-headline-lg text-on-surface mt-2">
            {stats.recordDay?.count || 0} <span className="text-label-md font-normal text-on-surface-variant">msgs</span>
          </div>
          <div className="text-body-sm text-on-surface-variant mt-1">
            {stats.recordDay?.date || 'Peak'}
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="text-label-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-primary">nightlight</span>
            <span>Late Night Messages</span>
          </div>
          <div className="font-headline-lg text-on-surface mt-2">
            {stats.lateNightPct}%
          </div>
          <div className="text-body-sm text-on-surface-variant mt-1">Sent between 10 PM & 4 AM</div>
        </div>
      </div>

      {/* Grid: Calendar Activity Heatmap + Initiation/Balance Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
        {/* Calendar Activity Heatmap (2 cols on lg) */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-space-md">
            <div>
              <h3 className="font-headline-md text-on-surface">Activity Rhythm</h3>
              <p className="font-body-sm text-on-surface-variant">
                Daily frequency and quiet stretches across the chat timeline
              </p>
            </div>
            <div className="flex items-center gap-space-xs text-label-sm text-on-surface-variant">
              <span className="w-3 h-3 rounded bg-surface-container-high/60"></span>
              <span>Quiet</span>
              <span className="w-3 h-3 rounded bg-primary/50 ml-2"></span>
              <span className="w-3 h-3 rounded bg-primary ml-1"></span>
              <span>Active</span>
            </div>
          </div>

          {/* Horizontally scrollable calendar grid */}
          <div className="w-full overflow-x-auto pb-2">
            <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5 min-w-[500px] py-1">
              {heatmapDays.map((day, idx) => (
                <div
                  key={idx}
                  title={`${day.date}: ${day.count} messages`}
                  className={`w-3.5 h-3.5 rounded-xs transition-colors cursor-pointer hover:ring-2 hover:ring-on-surface/40 ${getDayColor(
                    day.count
                  )}`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-space-xs border-t border-surface-container-high mt-space-sm">
            <span>{dateRange?.start || 'Start'}</span>
            <span className="italic font-serif">"Consistency is a quiet testament to steady affection."</span>
            <span>{dateRange?.end || 'End'}</span>
          </div>
        </div>

        {/* Initiation & Share of Voice Card */}
        <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between gap-space-md">
          <div>
            <h3 className="font-headline-md text-on-surface">Initiation & Share of Voice</h3>
            <p className="font-body-sm text-on-surface-variant">Who started conversations vs who sent more words</p>
          </div>

          <div className="flex flex-col gap-space-md">
            {/* Share of Voice Bar */}
            <div>
              <div className="flex justify-between text-label-sm text-on-surface-variant mb-1.5">
                <span className="font-medium text-on-surface">
                  {myParticipant?.name || 'You'}: {stats.shareOfVoice[myParticipant?.name || ''] || 50}%
                </span>
                <span className="font-medium text-on-surface">
                  {otherParticipant?.name || 'Partner'}: {stats.shareOfVoice[otherParticipant?.name || ''] || 50}%
                </span>
              </div>
              <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden flex">
                <div
                  className="bg-primary h-full transition-all duration-700"
                  style={{ width: `${stats.shareOfVoice[myParticipant?.name || ''] || 50}%` }}
                ></div>
                <div
                  className="bg-secondary-container h-full transition-all duration-700"
                  style={{ width: `${stats.shareOfVoice[otherParticipant?.name || ''] || 50}%` }}
                ></div>
              </div>
              <div className="text-[11px] text-on-surface-variant mt-1 flex justify-between">
                <span>Share of Total Messages</span>
                <span>{stats.totalMessages} total msgs</span>
              </div>
            </div>

            {/* Conversation Initiation */}
            <div>
              <div className="flex justify-between text-label-sm text-on-surface-variant mb-1.5">
                <span className="font-medium text-on-surface">
                  {myParticipant?.name || 'You'}: {stats.initiationPct[myParticipant?.name || ''] || 50}%
                </span>
                <span className="font-medium text-on-surface">
                  {otherParticipant?.name || 'Partner'}: {stats.initiationPct[otherParticipant?.name || ''] || 50}%
                </span>
              </div>
              <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden flex">
                <div
                  className="bg-tertiary-fixed-variant bg-amber-600 h-full transition-all duration-700"
                  style={{ width: `${stats.initiationPct[myParticipant?.name || ''] || 50}%` }}
                ></div>
                <div
                  className="bg-surface-container-highest h-full transition-all duration-700"
                  style={{ width: `${stats.initiationPct[otherParticipant?.name || ''] || 50}%` }}
                ></div>
              </div>
              <div className="text-[11px] text-on-surface-variant mt-1 flex justify-between">
                <span>Conversation Starts (&gt;6h silence)</span>
                <span>Natural reciprocity</span>
              </div>
            </div>

            {/* Reply Speed Median */}
            <div className="bg-surface-container-low p-space-sm rounded-xl flex items-center justify-between text-body-sm">
              <span className="text-on-surface-variant">Median Reply Speed:</span>
              <span className="font-medium text-on-surface">
                {myParticipant?.name}: {stats.replyMedianMinutes[myParticipant?.name || ''] || 4}m • {otherParticipant?.name}: {stats.replyMedianMinutes[otherParticipant?.name || ''] || 6}m
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Heatmap & Top Vocabulary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
        {/* Hourly Distribution (24 hours) */}
        <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-space-sm">
            <div>
              <h3 className="font-headline-md text-on-surface">24-Hour Rhythm</h3>
              <p className="font-body-sm text-on-surface-variant">
                Message frequency by time of day (Late night highlighted)
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[14px]">nightlight</span>
              <span>10 PM – 4 AM</span>
            </div>
          </div>

          {/* 24 vertical bars */}
          <div className="h-32 flex items-end justify-between gap-1 pt-4 pb-2">
            {(stats.hourly || Array(24).fill(0)).map((count, hour) => {
              const heightPct = Math.max(8, (count / maxHour) * 100);
              const isLateNight = hour >= 22 || hour <= 4;

              return (
                <div
                  key={hour}
                  className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end"
                >
                  {/* Tooltip */}
                  <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-on-surface text-surface text-[10px] px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-10">
                    {hour}:00 — {count} msgs
                  </div>
                  <div
                    className={`w-full rounded-t transition-all ${
                      isLateNight ? 'bg-primary' : 'bg-surface-container-high group-hover:bg-primary/50'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[9px] text-on-surface-variant font-mono">
                    {hour % 6 === 0 ? hour : ''}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-[11px] text-on-surface-variant border-t border-surface-container-high pt-1">
            <span>12 AM</span>
            <span>6 AM</span>
            <span>12 PM</span>
            <span>6 PM</span>
            <span>11 PM</span>
          </div>
        </div>

        {/* Top Vocabulary & Emojis Per Person */}
        <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between gap-space-md">
          <div>
            <h3 className="font-headline-md text-on-surface">Frequent Words & Emojis</h3>
            <p className="font-body-sm text-on-surface-variant">Signature Hinglish expressions and reactions</p>
          </div>

          <div className="flex flex-col gap-space-md">
            {senderKeys.slice(0, 4).map((sender) => (
              <div key={sender} className="bg-surface-container-low p-space-sm rounded-xl flex flex-col gap-2">
                <div className="flex items-center justify-between text-label-sm font-semibold text-on-surface">
                  <span className="text-primary">{sender}</span>
                  <div className="flex items-center gap-1 text-base">
                    {(stats.topEmojis[sender] || []).map((emoji, i) => (
                      <span key={i} title={emoji}>{emoji}</span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(stats.topWords[sender] || []).map((word, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface text-label-sm border border-outline-variant/30 font-mono"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

