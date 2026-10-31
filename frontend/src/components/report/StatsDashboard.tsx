import React, { useMemo } from 'react';
import { Participant, ReportStats, DateRange } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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

  // 5-step blue scale: #EEF1FF, #C9D3FF, #94A8FF, #5F7BEA, #3B5BDB
  const getHeatmapColor = (count: number) => {
    if (count === 0) return '#FFFFFF';
    const ratio = count / maxDayCount;
    if (ratio < 0.2) return '#EEF1FF';
    if (ratio < 0.4) return '#C9D3FF';
    if (ratio < 0.6) return '#94A8FF';
    if (ratio < 0.8) return '#5F7BEA';
    return '#3B5BDB';
  };

  const maxHour = Math.max(1, ...(stats.hourly || []));

  // Donut data for share of messages
  const donutData = useMemo(() => {
    const list = Object.entries(stats.shareOfVoice || {}).map(([name, pct]) => {
      const isMe = name === myName;
      return {
        name,
        value: pct,
        color: isMe ? '#3B5BDB' : '#F28C28',
      };
    });
    if (list.length === 0) {
      return [
        { name: myName, value: 50, color: '#3B5BDB' },
        { name: otherName, value: 50, color: '#F28C28' },
      ];
    }
    return list;
  }, [stats.shareOfVoice, myName, otherName]);

  return (
    <section id="overview" className="flex flex-col gap-6 sm:gap-10 scroll-mt-24">
      {/* 1. Plain Stat Tiles Grid: 2-col (mobile) / 4-col (desktop) rotating tints */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Tile 1: Total Messages (Peach #FFE5D6) */}
        <div className="p-4 sm:p-6 bg-[#FFE5D6] rounded-[18px] sm:rounded-[20px] flex flex-col justify-between">
          <div className="font-heading font-bold text-[24px] xs:text-[28px] sm:text-[36px] md:text-[40px] text-[#1C1A33] leading-tight">
            {stats.totalMessages.toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm font-semibold text-[#5A5873] mt-2 leading-snug">
            Total messages
          </div>
        </div>

        {/* Tile 2: Share of Messages (Sky #DCEBFF) */}
        <div className="p-4 sm:p-6 bg-[#DCEBFF] rounded-[18px] sm:rounded-[20px] flex flex-col justify-between">
          <div className="flex items-baseline gap-1 font-heading font-bold text-[22px] xs:text-[26px] sm:text-[34px] md:text-[40px] text-[#1C1A33] leading-tight flex-wrap">
            <span>{stats.shareOfVoice[myName] ?? 50}%</span>
            <span className="text-sm sm:text-xl font-normal text-[#5A5873]">
              / {stats.shareOfVoice[otherName] ?? 50}%
            </span>
          </div>
          <div className="text-xs sm:text-sm font-semibold text-[#5A5873] mt-2 leading-snug">
            Share of messages
            <span className="block text-[11px] font-normal text-[#5A5873]/80">
              {myName} / {otherName}
            </span>
          </div>
        </div>

        {/* Tile 3: Who Starts Conversations (Lilac #E9E3FF) */}
        <div className="p-4 sm:p-6 bg-[#E9E3FF] rounded-[18px] sm:rounded-[20px] flex flex-col justify-between">
          <div className="flex items-baseline gap-1 font-heading font-bold text-[22px] xs:text-[26px] sm:text-[34px] md:text-[40px] text-[#1C1A33] leading-tight flex-wrap">
            <span>{stats.initiationPct[myName] ?? 50}%</span>
            <span className="text-sm sm:text-xl font-normal text-[#5A5873]">
              / {stats.initiationPct[otherName] ?? 50}%
            </span>
          </div>
          <div className="text-xs sm:text-sm font-semibold text-[#5A5873] mt-2 leading-snug">
            Conversation starts
            <span className="block text-[11px] font-normal text-[#5A5873]/80">
              {myName} / {otherName}
            </span>
          </div>
        </div>

        {/* Tile 4: Median Reply Time (Butter #FFF3C9) */}
        <div className="p-4 sm:p-6 bg-[#FFF3C9] rounded-[18px] sm:rounded-[20px] flex flex-col justify-between">
          <div className="flex items-baseline gap-1 font-heading font-bold text-[22px] xs:text-[26px] sm:text-[34px] md:text-[40px] text-[#1C1A33] leading-tight flex-wrap">
            <span>{stats.replyMedianMinutes[myName] ?? 4}m</span>
            <span className="text-sm sm:text-xl font-normal text-[#5A5873]">
              / {stats.replyMedianMinutes[otherName] ?? 6}m
            </span>
          </div>
          <div className="text-xs sm:text-sm font-semibold text-[#5A5873] mt-2 leading-snug">
            Median reply time
            <span className="block text-[11px] font-normal text-[#5A5873]/80">
              {myName} / {otherName}
            </span>
          </div>
        </div>

        {/* Tile 5: Longest Streak (Blush #FFE0E8) */}
        <div className="p-4 sm:p-6 bg-[#FFE0E8] rounded-[18px] sm:rounded-[20px] flex flex-col justify-between">
          <div className="font-heading font-bold text-[24px] xs:text-[28px] sm:text-[36px] md:text-[40px] text-[#1C1A33] leading-tight">
            {stats.longestStreakDays}{' '}
            <span className="text-base sm:text-2xl font-normal text-[#5A5873]">days</span>
          </div>
          <div className="text-xs sm:text-sm font-semibold text-[#5A5873] mt-2 leading-snug">
            Longest streak
          </div>
        </div>

        {/* Tile 6: Longest Silence (Peach #FFE5D6) */}
        <div className="p-4 sm:p-6 bg-[#FFE5D6] rounded-[18px] sm:rounded-[20px] flex flex-col justify-between">
          <div className="font-heading font-bold text-[24px] xs:text-[28px] sm:text-[36px] md:text-[40px] text-[#1C1A33] leading-tight">
            {stats.longestSilenceDays}{' '}
            <span className="text-base sm:text-2xl font-normal text-[#5A5873]">days</span>
          </div>
          <div className="text-xs sm:text-sm font-semibold text-[#5A5873] mt-2 leading-snug">
            Longest silence
          </div>
        </div>

        {/* Tile 7: Busiest Day (Sky #DCEBFF) */}
        <div className="p-4 sm:p-6 bg-[#DCEBFF] rounded-[18px] sm:rounded-[20px] flex flex-col justify-between">
          <div className="font-heading font-bold text-[24px] xs:text-[28px] sm:text-[36px] md:text-[40px] text-[#1C1A33] leading-tight">
            {stats.recordDay?.count ?? 0}{' '}
            <span className="text-base sm:text-2xl font-normal text-[#5A5873]">msgs</span>
          </div>
          <div className="text-xs sm:text-sm font-semibold text-[#5A5873] mt-2 leading-snug">
            Busiest day
            <span className="block text-[11px] font-normal text-[#5A5873]/80 truncate">
              {stats.recordDay?.date ?? ''}
            </span>
          </div>
        </div>

        {/* Tile 8: Messages 10pm-4am (Lilac #E9E3FF) */}
        <div className="p-4 sm:p-6 bg-[#E9E3FF] rounded-[18px] sm:rounded-[20px] flex flex-col justify-between">
          <div className="font-heading font-bold text-[24px] xs:text-[28px] sm:text-[36px] md:text-[40px] text-[#1C1A33] leading-tight">
            {stats.lateNightPct}%
          </div>
          <div className="text-xs sm:text-sm font-semibold text-[#5A5873] mt-2 leading-snug">
            Messages 10pm to 4am
          </div>
        </div>
      </div>

      {/* 2. Middle Row: Share of Messages Donut & Calendar Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Share of Messages Donut (Recharts) */}
        <div className="p-5 sm:p-8 bg-white border border-[#E7E5F0] rounded-[22px] sm:rounded-[28px] flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg sm:text-[22px] text-[#1C1A33]">
              Share of messages
            </h3>
            <p className="text-xs sm:text-sm text-[#5A5873] mt-1">
              Who sent what percentage of the total conversation.
            </p>
          </div>

          <div className="w-full h-44 sm:h-48 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`${val}%`, 'Share']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E7E5F0',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-3 border-t border-[#E7E5F0] text-xs sm:text-sm font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#3B5BDB] shrink-0" />
              <span className="text-[#1C1A33]">{myName} ({stats.shareOfVoice[myName] ?? 50}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#F28C28] shrink-0" />
              <span className="text-[#1C1A33]">{otherName} ({stats.shareOfVoice[otherName] ?? 50}%)</span>
            </div>
          </div>
        </div>

        {/* Calendar Heatmap (2 cols on large screen) */}
        <div className="lg:col-span-2 p-5 sm:p-8 bg-white border border-[#E7E5F0] rounded-[22px] sm:rounded-[28px] flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-heading font-bold text-lg sm:text-[22px] text-[#1C1A33]">Daily activity</h3>
              <p className="text-xs sm:text-sm text-[#5A5873] mt-0.5 sm:mt-1">
                Every day of the conversation, shaded from zero to peak messages.
              </p>
            </div>
            <span className="sm:hidden text-[10px] font-semibold text-[#CF3A26] bg-[#FFE0E8] px-2 py-0.5 rounded-full shrink-0">
              Swipe →
            </span>
          </div>

          {/* Grid Container with smooth horizontal swipe on mobile */}
          <div className="w-full overflow-x-auto touch-scroll py-4 sm:py-6">
            <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5 min-w-[500px]">
              {heatmapDays.map((day, idx) => (
                <div
                  key={idx}
                  title={`${day.date}: ${day.count} messages`}
                  className="w-3.5 h-3.5 rounded-[3px] border border-[#E7E5F0]/50 transition-colors"
                  style={{ backgroundColor: getHeatmapColor(day.count) }}
                />
              ))}
            </div>
          </div>

          {/* 5-step Blue Legend */}
          <div className="flex flex-wrap items-center justify-between text-[11px] sm:text-xs font-semibold text-[#5A5873] pt-3 sm:pt-4 border-t border-[#E7E5F0] gap-2">
            <span>{dateRange?.start || 'Start'}</span>
            <div className="flex items-center gap-1.5">
              <span>Fewer</span>
              <span className="w-3 h-3 rounded-[2px] bg-white border border-[#E7E5F0]" title="0 messages" />
              <span className="w-3 h-3 rounded-[2px] bg-[#EEF1FF]" title="Low" />
              <span className="w-3 h-3 rounded-[2px] bg-[#C9D3FF]" title="Medium-Low" />
              <span className="w-3 h-3 rounded-[2px] bg-[#94A8FF]" title="Medium" />
              <span className="w-3 h-3 rounded-[2px] bg-[#5F7BEA]" title="Medium-High" />
              <span className="w-3 h-3 rounded-[2px] bg-[#3B5BDB]" title="Peak" />
              <span>More messages</span>
            </div>
            <span>{dateRange?.end || 'End'}</span>
          </div>
        </div>
      </div>

      {/* 3. Hourly Chart with Late-Night Shading (28px white panel on desktop, 22px on mobile) */}
      <div className="p-5 sm:p-8 bg-white border border-[#E7E5F0] rounded-[22px] sm:rounded-[28px] flex flex-col gap-4 sm:gap-5">
        <div>
          <h3 className="font-heading font-bold text-lg sm:text-[22px] text-[#1C1A33]">
            Messages by hour of the day
          </h3>
          <p className="text-xs sm:text-sm text-[#5A5873] mt-1">
            Hourly volume across 24 hours. Late-night hours (10pm to 4am) are highlighted in coral.
          </p>
        </div>

        {/* Bar chart container */}
        <div className="h-36 sm:h-44 flex items-end justify-between gap-1 sm:gap-1.5 pt-4 sm:pt-6 pb-2 border-b border-[#E7E5F0]">
          {(stats.hourly || Array(24).fill(0)).map((count, hour) => {
            const heightPct = Math.max(6, (count / maxHour) * 100);
            const isLateNight = hour >= 22 || hour <= 4;

            return (
              <div key={hour} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                <div
                  className="w-full rounded-t-sm sm:rounded-t-md transition-all duration-150 hover:opacity-85"
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: isLateNight ? '#CF3A26' : '#CFC3FF',
                  }}
                  title={`${hour}:00 — ${count} messages`}
                />
              </div>
            );
          })}
        </div>

        {/* Hour Axis & Legend */}
        <div className="flex items-center justify-between text-[10px] sm:text-xs font-semibold text-[#5A5873]">
          <span>12am</span>
          <span>3am</span>
          <span>6am</span>
          <span>9am</span>
          <span>12pm</span>
          <span>3pm</span>
          <span>6pm</span>
          <span>9pm</span>
          <span>11pm</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-semibold text-[#5A5873] pt-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-[3px] bg-[#CF3A26] shrink-0" />
            <span className="text-[#1C1A33]">10pm to 4am (late night)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-[3px] bg-[#CFC3FF] shrink-0" />
            <span className="text-[#1C1A33]">Daytime & evening</span>
          </div>
        </div>
      </div>

      {/* 4. Top Words and Emojis: Simple side-by-side lists per person */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Person 1 (Them) */}
        <div className="p-5 sm:p-8 bg-white border border-[#E7E5F0] rounded-[22px] sm:rounded-[28px] flex flex-col gap-5 sm:gap-6">
          <div className="flex items-center justify-between border-b border-[#E7E5F0] pb-3 sm:pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-[#F28C28] shrink-0" />
              <h4 className="font-heading font-bold text-lg sm:text-xl text-[#1C1A33]">
                {otherName}
              </h4>
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-[#5A5873] uppercase tracking-wider">
              Top vocabulary
            </span>
          </div>

          <div>
            <div className="text-xs font-bold text-[#5A5873] uppercase tracking-wider mb-2.5 sm:mb-3">
              Most used words
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {(stats.topWords[otherName] || []).map((word, i) => (
                <span
                  key={i}
                  className="px-2.5 sm:px-3 py-1 bg-[#F1EDFF] text-[#1C1A33] rounded-full text-xs sm:text-sm font-semibold"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#E7E5F0]">
            <div className="text-xs font-bold text-[#5A5873] uppercase tracking-wider mb-2.5 sm:mb-3">
              Most used emojis
            </div>
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-2xl sm:text-3xl">
              {(stats.topEmojis[otherName] || []).map((emoji, i) => (
                <span key={i} title={emoji} className="hover:scale-110 transition-transform">
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Person 2 (You) */}
        <div className="p-5 sm:p-8 bg-white border border-[#E7E5F0] rounded-[22px] sm:rounded-[28px] flex flex-col gap-5 sm:gap-6">
          <div className="flex items-center justify-between border-b border-[#E7E5F0] pb-3 sm:pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-[#3B5BDB] shrink-0" />
              <h4 className="font-heading font-bold text-lg sm:text-xl text-[#1C1A33]">
                {myName} (You)
              </h4>
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-[#5A5873] uppercase tracking-wider">
              Top vocabulary
            </span>
          </div>

          <div>
            <div className="text-xs font-bold text-[#5A5873] uppercase tracking-wider mb-2.5 sm:mb-3">
              Most used words
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {(stats.topWords[myName] || []).map((word, i) => (
                <span
                  key={i}
                  className="px-2.5 sm:px-3 py-1 bg-[#DCEBFF] text-[#1C1A33] rounded-full text-xs sm:text-sm font-semibold"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#E7E5F0]">
            <div className="text-xs font-bold text-[#5A5873] uppercase tracking-wider mb-2.5 sm:mb-3">
              Most used emojis
            </div>
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-2xl sm:text-3xl">
              {(stats.topEmojis[myName] || []).map((emoji, i) => (
                <span key={i} title={emoji} className="hover:scale-110 transition-transform">
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};