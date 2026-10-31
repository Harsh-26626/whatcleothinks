import { describe, it, expect } from 'vitest';
import { parseChat, isSystemMessage, normalizeText } from '../src/parser.js';

describe('WhatsApp Chat Parser', () => {
  // Helper to generate N dummy messages for count threshold (> 50)
  function makeDummyLines(count: number, prefix: string): string[] {
    const lines: string[] = [];
    for (let i = 1; i <= count; i++) {
      const day = ((i % 25) + 1).toString().padStart(2, '0');
      lines.push(`15/06/2023, 10:${(i % 50).toString().padStart(2, '0')} - Harsh: ${prefix} message number ${i}`);
    }
    return lines;
  }

  it('1. Parses Android 12h format correctly', () => {
    const prefix = [
      '12/03/24, 9:41 pm - Vanshika: Hey, did you reach home?',
      '12/03/24, 9:45 pm - Harsh: Yes just reached!',
    ];
    const fullChat = [...prefix, ...makeDummyLines(55, 'filler')].join('\n');
    const result = parseChat(fullChat);

    expect(result.messages.length).toBeGreaterThanOrEqual(52);
    expect(result.messages[0].sender).toBe('Vanshika');
    expect(result.messages[0].text).toBe('Hey, did you reach home?');
    expect(result.messages[0].ts.getUTCHours()).toBe(21);
    expect(result.messages[0].ts.getUTCMinutes()).toBe(41);
    expect(result.messages[1].sender).toBe('Harsh');
    expect(result.messages[1].text).toBe('Yes just reached!');
  });

  it('2. Parses Android 24h format correctly', () => {
    const prefix = [
      '12/03/2024, 21:41 - Vanshika: Still studying?',
      '12/03/2024, 21:43 - Harsh: Yeah almost done',
    ];
    const fullChat = [...prefix, ...makeDummyLines(55, 'filler2')].join('\n');
    const result = parseChat(fullChat);

    expect(result.messages[0].sender).toBe('Vanshika');
    expect(result.messages[0].text).toBe('Still studying?');
    expect(result.messages[0].ts.getUTCHours()).toBe(21);
    expect(result.messages[0].ts.getUTCMinutes()).toBe(41);
    expect(result.messages[1].ts.getUTCHours()).toBe(21);
    expect(result.messages[1].ts.getUTCMinutes()).toBe(43);
  });

  it('3. Parses iPhone bracket format correctly', () => {
    const prefix = [
      '[12/03/24, 9:41:22 PM] Vanshika: Morning coffee?',
      '[12/03/24, 9:45:10 PM] Harsh: Absolutely, let us meet',
    ];
    const fullChat = [...prefix, ...makeDummyLines(55, 'filler3')].join('\n');
    const result = parseChat(fullChat);

    expect(result.messages[0].sender).toBe('Vanshika');
    expect(result.messages[0].text).toBe('Morning coffee?');
    expect(result.messages[0].ts.getUTCHours()).toBe(21);
    expect(result.messages[0].ts.getUTCSeconds()).toBe(22);
  });

  it('4. Handles multi-line messages correctly', () => {
    const prefix = [
      '12/03/24, 10:00 am - Vanshika: First line of message\nSecond line of message\nThird line here',
      '12/03/24, 10:05 am - Harsh: Received all three lines cleanly',
    ];
    const fullChat = [...prefix, ...makeDummyLines(55, 'filler4')].join('\n');
    const result = parseChat(fullChat);

    expect(result.messages[0].text).toBe('First line of message\nSecond line of message\nThird line here');
    expect(result.messages[1].text).toBe('Received all three lines cleanly');
  });

  it('5. Drops system messages and omitted media', () => {
    const prefix = [
      '12/03/24, 10:00 am - Messages and calls are end-to-end encrypted. No one outside of this chat can read or listen.',
      '12/03/24, 10:01 am - Vanshika: Check this photo',
      '12/03/24, 10:02 am - Vanshika: <Media omitted>',
      '12/03/24, 10:03 am - Harsh: image omitted',
      '12/03/24, 10:04 am - Harsh: This message was deleted',
      '12/03/24, 10:05 am - Harsh: Nice picture!',
    ];
    const fullChat = [...prefix, ...makeDummyLines(55, 'filler5')].join('\n');
    const result = parseChat(fullChat);

    const texts = result.messages.map((m) => m.text);
    expect(texts).toContain('Check this photo');
    expect(texts).toContain('Nice picture!');
    expect(texts).not.toContain('<Media omitted>');
    expect(texts).not.toContain('image omitted>');
    expect(texts).not.toContain('This message was deleted');
  });

  it('6. Ambiguous dates default to DD/MM (India standard)', () => {
    // Dates like 05/06/23 where both 5 and 6 are <= 12
    const prefix = [
      '05/06/2023, 10:00 am - Vanshika: 5th June meeting',
      '06/07/2023, 11:00 am - Harsh: 6th July follow up',
    ];
    const fullChat = [...prefix, ...makeDummyLines(55, 'filler6')].join('\n');
    const result = parseChat(fullChat);

    // 05/06 -> Day 5, Month 6 (June)
    expect(result.messages[0].ts.getUTCDate()).toBe(5);
    expect(result.messages[0].ts.getUTCMonth()).toBe(5); // 0-indexed: 5 is June
  });

  it('7. Handles narrow no-break space U+202F and LTR marks', () => {
    const sample = '12/03/24, 9:41\u202Fpm - \u200EVanshika: Hello with unicode space';
    const normalized = normalizeText(sample);
    expect(normalized).toBe('12/03/24, 9:41 pm - Vanshika: Hello with unicode space');
  });

  it('8. Throws too_short if chat has fewer than 50 messages', () => {
    const shortChat = [
      '12/03/24, 9:41 pm - Vanshika: Hello',
      '12/03/24, 9:42 pm - Harsh: Hey',
    ].join('\n');

    expect(() => parseChat(shortChat)).toThrow('too_short');
  });
});

