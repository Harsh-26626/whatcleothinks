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
  const myParticipant = participants.find((p) => p.isMe);
  const otherParticipant = participants.find((p) => !p.isMe);
  const myName = myParticipant?.name || 'You';
  const otherName = otherParticipant?.name || 'Them';

  // Heatmap generation
  const heatmapDays = useMemo(() => {
    if (!dateRange || !stats.daily) {
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

  const maxDayCount = useMemo(() => {
    return Math.max(1, ...heatmapDays.map((d) => d.count));
  }, [heatmapDays]);

  const getHeatmapColor = (count: number) => {
    if (count === 0) return '#F6F6F4';
    const ratio = count / maxDayCount;
    if (ratio < 0.25) return '#FDE68A'; // light yellow/marigold
    if (ratio < 0.5) return '#FBBF24';
    if (ratio < 0.75) return '#F2B01E'; // primary marigold
    return '#D97706';
  };

  const maxHour = Math.max(1, ...(stats.hourly || []));

  return (
    <section id="overview" className="flex flex-col gap-10 scroll-mt-20">
      {/* 1. Plain Stat Tiles Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Total Messages */}
        <div className="p-4 bg-white border border-[#E5E5E1] rounded-lg">
          <div className="text-[28px] font-bold text-[#1A1A1A]">
            {stats.totalMessages.toLocaleString()}
          </div>
          <div className="text-sm text-[#5F5F5A] mt-1">Total messages</div>
        </div>

        {/* Share of Messages */}
        <div className="p-4 bg-white border border-[#E5E5E1] rounded-lg">
          <div className="text-[28px] font-bold text-[#1A1A1A]">
            {stats.shareOfVoice[myName] ?? 50}% <span className="text-base font-normal text-[#5F5F5A]">/ {stats.shareOfVoice[otherName] ?? 50}%</span>
          </div>
          <div className="text-sm text-[#5F5F5A] mt-1">
            Share of messages ({myName} / {otherName})
          </div>
        </div>

        {/* Who Starts Conversations */}
        <div className="p-4 bg-white border border-[#E5E5E1] rounded-lg">
          <div className="text-[28px] font-bold text-[#1A1A1A]">
            {stats.initiationPct[myName] ?? 50}% <span className="text-base font-normal text-[#5F5F5A]">/ {stats.initiationPct[otherName] ?? 50}%</span>
          </div>
          <div className="text-sm text-[#5F5F5A] mt-1">
            Conversation starts ({myName} / {otherName})
          </div>
        </div>

        {/* Median Reply Time */}
        <div className="p-4 bg-white border border-[#E5E5E1] rounded-lg">
          <div className="text-[28px] font-bold text-[#1A1A1A]">
            {stats.replyMedianMinutes[myName] ?? 4}m <span className="text-base font-normal text-[#5F5F5A]">/ {stats.replyMedianMinutes[otherName] ?? 6}m</span>
          </div>
          <div className="text-sm text-[#5F5F5A] mt-1">
            Median reply time ({myName} / {otherName})
          </div>
        </div>

        {/* Longest Streak */}
        <div className="p-4 bg-white border border-[#E5E5E1] rounded-lg">
          <div className="text-[28px] font-bold text-[#1A1A1A]">
            {stats.longestStreakDays} <span className="text-base font-normal text-[#5F5F5A]">days</span>
          </div>
          <div className="text-sm text-[#5F5F5A] mt-1">Longest streak</div>
        </div>

        {/* Longest Silence */}
        <div className="p-4 bg-white border border-[#E5E5E1] rounded-lg">
          <div className="text-[28px] font-bold text-[#1A1A1A]">
            {stats.longestSilenceDays} <span className="text-base font-normal text-[#5F5F5A]">days</span>
          </div>
          <div className="text-sm text-[#5F5F5A] mt-1">Longest silence</div>
        </div>

        {/* Busiest Day */}
        <div className="p-4 bg-white border border-[#E5E5E1] rounded-lg col-span-2 sm:col-span-1">
          <div className="text-[28px] font-bold text-[#1A1A1A]">
            {stats.recordDay?.count ?? 0} <span className="text-base font-normal text-[#5F5F5A]">msgs</span>
          </div>
          <div className="text-sm text-[#5F5F5A] mt-1">
            Busiest day ({stats.recordDay?.date ?? ''})
          </div>
        </div>

        {/* Late Night Messages */}
        <div className="p-4 bg-white border border-[#E5E5E1] rounded-lg col-span-2 sm:col-span-1">
          <div className="text-[28px] font-bold text-[#1A1A1A]">
            {stats.lateNightPct}%
          </div>
          <div className="text-sm text-[#5F5F5A] mt-1">Messages sent 10pm to 4am</div>
        </div>
      </div>

      {/* 2. Calendar Heatmap Chart */}
      <div className="p-6 bg-white border border-[#E5E5E1] rounded-xl flex flex-col gap-4">
        <div>
          <h3 className="text-[22px] font-semibold text-[#1A1A1A]">Daily activity</h3>
          <p className="text-base text-[#5F5F5A] mt-0.5">
            Every day of the conversation, shaded from zero to peak messages.
          </p>
        </div>

        {/* Grid Container */}
        <div className="w-full overflow-x-auto pb-2">
          <div className="inline-grid grid-rows-7 grid-flow-col gap-1 min-w-[500px]">
            {heatmapDays.map((day, idx) => (
              <div
                key={idx}
                title={`${day.date}: ${day.count} messages`}
                className="w-3 h-3 rounded-[2px]"
                style={{ backgroundColor: getHeatmapColor(day.count) }}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-[#5F5F5A] pt-2 border-t border-[#E5E5E1]">
          <span>{dateRange?.start || 'Start'}</span>
          <div className="flex items-center gap-1.5">
            <span>Fewer</span>
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#F6F6F4] border border-[#E5E5E1]" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#FDE68A]" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#FBBF24]" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#F2B01E]" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#D97706]" />
            <span>More messages</span>
          </div>
          <span>{dateRange?.end || 'End'}</span>
        </div>
      </div>

      {/* 3. Hourly Chart with Late-Night Shading */}
      <div className="p-6 bg-white border border-[#E5E5E1] rounded-xl flex flex-col gap-4">
        <div>
          <h3 className="text-[22px] font-semibold text-[#1A1A1A]">Messages by hour of the day</h3>
          <p className="text-base text-[#5F5F5A] mt-0.5">
            Hourly volume across 24 hours. Late-night hours (10pm to 4am) are shaded.
          </p>
        </div>

        {/* Bar chart container */}
        <div className="h-40 flex items-end justify-between gap-1 pt-6 pb-2 border-b border-[#E5E5E1]">
          {(stats.hourly || Array(24).fill(0)).map((count, hour) => {
            const heightPct = Math.max(6, (count / maxHour) * 100);
            const isLateNight = hour >= 22 || hour <= 4;

            return (
              <div key={hour} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                <div
                  className="w-full rounded-t"
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: isLateNight ? '#2F5BEA' : '#E5E5E1',
                  }}
                  title={`${hour}:00 — ${count} messages`}
                />
              </div>
            );
          })}
        </div>

        {/* Hour Axis & Legend */}
        <div className="flex items-center justify-between text-xs text-[#5F5F5A]">
          <span>12am</span>
          <span>6am</span>
          <span>12pm</span>
          <span>6pm</span>
          <span>11pm</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-[#5F5F5A] pt-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#2F5BEA]" />
            <span>10pm to 4am (late night)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#E5E5E1]" />
            <span>Daytime & evening</span>
          </div>
        </div>
      </div>

      {/* 4. Top Words and Emojis (Simple Lists Per Person) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Person 1 */}
        <div className="p-6 bg-white border border-[#E5E5E1] rounded-xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#E5E5E1] pb-3">
            <h4 className="text-base font-bold text-[#1A1A1A]">
              {otherName} {otherParticipant?.isMe && '(You)'}
            </h4>
            <span className="text-xs text-[#5F5F5A]">Top vocabulary</span>
          </div>

          <div>
            <div className="text-xs font-semibold text-[#5F5F5A] uppercase tracking-wider mb-2">
              Most used words
            </div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-[#1A1A1A]">
              {(stats.topWords[otherName] || []).map((word, i) => (
                <li key={i}>{word}</li>
              ))}
            </ul>
          </div>

          <div className="pt-2 border-t border-[#E5E5E1]">
            <div className="text-xs font-semibold text-[#5F5F5A] uppercase tracking-wider mb-2">
              Most used emojis
            </div>
            <div className="flex items-center gap-3 text-2xl">
              {(stats.topEmojis[otherName] || []).map((emoji, i) => (
                <span key={i} title={emoji}>{emoji}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Person 2 (You) */}
        <div className="p-6 bg-white border border-[#E5E5E1] rounded-xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#E5E5E1] pb-3">
            <h4 className="text-base font-bold text-[#1A1A1A]">
              {myName} {myParticipant?.isMe && '(You)'}
            </h4>
            <span className="text-xs text-[#5F5F5A]">Top vocabulary</span>
          </div>

          <div>
            <div className="text-xs font-semibold text-[#5F5F5A] uppercase tracking-wider mb-2">
              Most used words
            </div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-[#1A1A1A]">
              {(stats.topWords[myName] || []).map((word, i) => (
                <li key={i}>{word}</li>
              ))}
            </ul>
          </div>

          <div className="pt-2 border-t border-[#E5E5E1]">
            <div className="text-xs font-semibold text-[#5F5F5A] uppercase tracking-wider mb-2">
              Most used emojis
            </div>
            <div className="flex items-center gap-3 text-2xl">
              {(stats.topEmojis[myName] || []).map((emoji, i) => (
                <span key={i} title={emoji}>{emoji}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
