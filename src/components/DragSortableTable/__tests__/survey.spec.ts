import {describe, expect, it} from 'vitest';
import {columnNudge, gripLabel, nudgedColumn, nudgedRow, rowNudge, struckAway} from '../survey';

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


  it('a column nudge moves the column one seat', () => {
    const order = ['window', 'trades', 'buys', 'change'];

    expect(columnNudge(order)('trades', 1)).toEqual({from: 1, to: 2});
  });

  it('a column nudge against an anchored edge moves nothing', () => {
    const order = ['window', 'trades', 'buys', 'change'];

    expect(columnNudge(order)('trades', -1)).toBeUndefined();
  });

  it("a row nudge answers the row's new seat and the order it leaves behind", () => {
    const nudge = rowNudge(['this minute', 'this hour', 'session'])('this minute', 1);

    expect(nudge.to).toBe(1);
    expect(nudge.after).toEqual(['this hour', 'this minute', 'session']);
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
