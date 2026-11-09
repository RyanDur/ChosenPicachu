import {coinbaseHistory} from '../coinbase-history';
import {Period} from '../Period';

describe('asking Coinbase for a period’s history', () => {
  test('should ask for the period’s span that ends now, one candle per granularity', () => {
    const now = new Date('2026-11-08T12:00:00.000Z');

    expect(coinbaseHistory.periodQuery(Period.hour, now)).toBe(
      'granularity=60&start=2026-11-08T11%3A00%3A00.000Z&end=2026-11-08T12%3A00%3A00.000Z'
    );
  });
});
