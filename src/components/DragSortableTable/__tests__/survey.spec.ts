import {describe, expect, it} from 'vitest';
import {columnNudge, columnSteps, gripLabel, nudgedColumn, nudgedRow, rowNudge, rowSteps, struckAway} from '../survey';

describe('the keyboard vocabulary', () => {
  it('claims exactly the two arrows per axis', () => {
    expect(columnSteps).toEqual({ArrowRight: 1, ArrowLeft: -1});
    expect(rowSteps).toEqual({ArrowDown: 1, ArrowUp: -1});
  });

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


  it('rules a column nudge whole: the walk and the clamp', () => {
    const order = ['window', 'trades', 'buys', 'change'];

    expect(columnNudge(order)('trades', 1)).toEqual({from: 1, to: 2});
    expect(columnNudge(order)('trades', -1)).toBeUndefined();
  });

  it('rules a row nudge whole: the seat and the seating after', () => {
    const nudge = rowNudge(['this minute', 'this hour', 'session'])('this minute', 1);

    expect(nudge.to).toBe(1);
    expect(nudge.after).toEqual(['this hour', 'this minute', 'session']);
  });

  it('rules a strike: another seat strikes, home and nothing never do', () => {
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
