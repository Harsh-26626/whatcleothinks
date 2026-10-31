import { describe, it, expect } from 'vitest';
import { computeStats, computeMonthlyStats } from '../src/stats.js';
import { Message } from '../src/types.js';

describe('Stats and Monthly Computation', () => {
  it('computes correct share of voice and message counts', () => {
    const messages: Message[] = [
      { id: 0, ts: new Date('2023-05-01T10:00:00Z'), sender: 'Alice', text: 'Hi' },
      { id: 1, ts: new Date('2023-05-01T10:02:00Z'), sender: 'Bob', text: 'Hello' },
      { id: 2, ts: new Date('2023-05-01T10:05:00Z'), sender: 'Alice', text: 'How are you?' },
    ];

    const stats = computeStats(messages, ['Alice', 'Bob']);
    expect(stats.totalMessages).toBe(3);
    expect(stats.bySender['Alice']).toBe(2);
    expect(stats.bySender['Bob']).toBe(1);
    expect(stats.shareOfVoice['Alice']).toBe(67);
    expect(stats.shareOfVoice['Bob']).toBe(33);
  });

  it('detects conversation initiations with 6+ hours gap', () => {
    const messages: Message[] = [
      // Alice starts first
      { id: 0, ts: new Date('2023-05-01T08:00:00Z'), sender: 'Alice', text: 'Good morning' },
      // Bob replies 5 min later (not an initiation)
      { id: 1, ts: new Date('2023-05-01T08:05:00Z'), sender: 'Bob', text: 'Morning!' },
      // Bob sends another 7 hours later (initiation by Bob!)
      { id: 2, ts: new Date('2023-05-01T15:05:00Z'), sender: 'Bob', text: 'Free for lunch?' },
    ];

    const stats = computeStats(messages, ['Alice', 'Bob']);
    // 2 total initiations: Alice (1), Bob (1)
    expect(stats.initiationPct['Alice']).toBe(50);
    expect(stats.initiationPct['Bob']).toBe(50);
  });

  it('calculates median reply time within 12 hours window', () => {
    const messages: Message[] = [
      { id: 0, ts: new Date('2023-05-01T10:00:00Z'), sender: 'Alice', text: 'Question 1' },
      // Bob replies in 4 minutes
      { id: 1, ts: new Date('2023-05-01T10:04:00Z'), sender: 'Bob', text: 'Answer 1' },
      // Alice replies in 6 minutes
      { id: 2, ts: new Date('2023-05-01T10:10:00Z'), sender: 'Alice', text: 'Question 2' },
      // Bob replies in 10 minutes
      { id: 3, ts: new Date('2023-05-01T10:20:00Z'), sender: 'Bob', text: 'Answer 2' },
    ];

    const stats = computeStats(messages, ['Alice', 'Bob']);
    // Bob deltas: 4 min, 10 min -> median = (4+10)/2 = 7.0
    expect(stats.replyMedianMinutes['Bob']).toBe(7);
    // Alice deltas: 6 min -> median = 6.0
    expect(stats.replyMedianMinutes['Alice']).toBe(6);
  });

  it('filters Hinglish and English stopwords in top words', () => {
    const messages: Message[] = [
      { id: 0, ts: new Date('2023-05-01T10:00:00Z'), sender: 'natasha', text: 'hai yeh kya baat hui college chalenge' },
      { id: 1, ts: new Date('2023-05-01T10:02:00Z'), sender: 'natasha', text: 'college assignment submission today' },
      { id: 2, ts: new Date('2023-05-01T10:05:00Z'), sender: 'natasha', text: 'college canteen best hai' },
    ];

    const stats = computeStats(messages, ['natasha']);
    // 'college' should be top word, stopwords like 'hai', 'yeh', 'kya' stripped
    expect(stats.topWords['natasha']).toContain('college');
    expect(stats.topWords['natasha']).not.toContain('hai');
    expect(stats.topWords['natasha']).not.toContain('yeh');
  });

  it('extracts top emojis using emoji-regex', () => {
    const messages: Message[] = [
      { id: 0, ts: new Date('2023-05-01T10:00:00Z'), sender: 'natasha', text: 'so funny 😭 😭 😂' },
      { id: 1, ts: new Date('2023-05-01T10:02:00Z'), sender: 'natasha', text: 'crying 😭' },
    ];

    const stats = computeStats(messages, ['natasha']);
    expect(stats.topEmojis['natasha'][0]).toBe('😭');
    expect(stats.topEmojis['natasha']).toContain('😂');
  });

  it('computes monthly aggregations', () => {
    const messages: Message[] = [
      { id: 0, ts: new Date('2023-05-01T10:00:00Z'), sender: 'Alice', text: 'May msg 1' },
      { id: 1, ts: new Date('2023-05-15T12:00:00Z'), sender: 'Bob', text: 'May msg 2' },
      { id: 2, ts: new Date('2023-06-01T10:00:00Z'), sender: 'Alice', text: 'June msg 1' },
    ];

    const monthly = computeMonthlyStats(messages, ['Alice', 'Bob']);
    expect(monthly.length).toBe(2);
    expect(monthly[0].month).toBe('2023-05');
    expect(monthly[0].messages).toBe(2);
    expect(monthly[1].month).toBe('2023-06');
    expect(monthly[1].messages).toBe(1);
  });
});

