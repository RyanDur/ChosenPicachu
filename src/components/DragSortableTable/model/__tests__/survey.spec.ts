import {describe, expect, it} from 'vitest';
import {columnUnder, gripLabel, nudgedColumn, nudgedRow, struckAway} from '../survey';

describe('the keyboard vocabulary', () => {
  it('walks a column, clamped inside the anchored edges', () => {
    const order = ['window', 'trades', 'buys', 'change'];

    expect(nudgedColumn(order, 'trades', 1)).toEqual({from: 1, to: 2});
    expect(nudgedColumn(order, 'trades', -1)).toEqual({from: 1, to: 1});
    expect(nudgedColumn(order, 'buys', 1)).toEqual({from: 2, to: 2});
  });

  it('walks a row the full range, and stops at the rails', () => {
    expect(nudgedRow(['session', 'this minute', 'this hour'], 'this minute', 1)).toEqual({from: 1, to: 2});
    expect(nudgedRow(['session', 'this minute', 'this hour'], 'session', -1)).toEqual({from: 0, to: 0});
    expect(nudgedRow(['session', 'this minute', 'this hour'], 'this hour', 1)).toEqual({from: 2, to: 2});
  });

  it('a seat is struck only by a different seat, never by itself or by nothing', () => {
    expect(struckAway('trades', 'buys')).toBe(true);
    expect(struckAway('trades', 'trades')).toBe(false);
    expect(struckAway('trades', undefined)).toBe(false);
    expect(struckAway(2, 0)).toBe(true);
    expect(struckAway(2, 2)).toBe(false);
  });

  it('speaks the grip label from the displayed position', () => {
    expect(gripLabel(0)).toBe('move row 1');
    expect(gripLabel(4)).toBe('move row 5');
  });
});

describe('the pointer vocabulary', () => {
  const order = ['window', 'trades', 'buys', 'change'];
  const across = (columnWidths: Record<string, number>) => {
    const width = Object.values(columnWidths).reduce((sum, each) => sum + each, 0);
    return columnUnder(order, {left: 0, top: 0, width, height: 100, columnWidths});
  };

  it('switches with an even neighbor only once the pointer is a quarter into it', () => {
    const under = across({window: 100, trades: 100, buys: 100, change: 100});

    expect(under(224, 50, 'trades')).toBeUndefined();
    expect(under(226, 50, 'trades')).toBe('buys');
  });

  it('a slim column reaches deeper into a wide neighbor before switching', () => {
    const under = across({window: 100, trades: 40, buys: 360, change: 100});

    expect(under(140 + 360 / 3, 50, 'trades')).toBeUndefined();
    expect(under(140 + 360 / 2, 50, 'trades')).toBe('buys');
  });
});
