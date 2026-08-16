import {describe, expect, it} from 'vitest';
import {columnNudge, columnSteps, gripLabel, nudgedColumn, nudgedRow, rowNudge, rowSteps, struckAway, swapped} from '../survey';

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
    expect(nudgedRow([2, 0, 1], 0, 1)).toEqual({from: 1, to: 2});
    expect(nudgedRow([2, 0, 1], 2, -1)).toEqual({from: 0, to: 0});
    expect(nudgedRow([2, 0, 1], 1, 1)).toEqual({from: 2, to: 2});
  });

  it('marks both parties of a swap, each by the other’s share of the gap', () => {
    const measured = {left: 0, top: 0, width: 110, height: 40, columnWidths: {trades: 40, buys: 60}};

    expect(swapped(measured, ['trades', 'buys'])('trades', 'buys', 1)).toEqual({
      trades: {toward: 'right', by: 70},
      buys: {toward: 'left', by: 50}
    });
  });

  it('rules a column nudge whole: the walk, the clamp, and both marks', () => {
    const measured = {left: 0, top: 0, width: 110, height: 40, columnWidths: {window: 10, trades: 40, buys: 60, change: 0}};
    const order = ['window', 'trades', 'buys', 'change'];

    expect(columnNudge(order, measured)('trades', 1)).toEqual({
      from: 1,
      to: 2,
      marks: {
        trades: {toward: 'right', by: 60},
        buys: {toward: 'left', by: 40}
      }
    });
    expect(columnNudge(order, measured)('trades', -1)).toBeUndefined();
  });

  it('rules a row nudge whole: the seat, the seating after, and the drops', () => {
    const nudge = rowNudge([0, 1, 2], {0: 40, 1: 40, 2: 40})(0, 1);

    expect(nudge.to).toBe(1);
    expect(nudge.after).toEqual([1, 0, 2]);
    expect(nudge.drops).toEqual({0: -40, 1: 40});
    expect(rowNudge([0, 1, 2], {0: 40, 1: 40, 2: 40})(0, -1).drops).toEqual({});
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
