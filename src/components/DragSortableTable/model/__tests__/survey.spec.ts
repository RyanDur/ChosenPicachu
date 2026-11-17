import {describe, expect, it} from 'vitest';
import {survey} from '../survey';

describe('the pointer vocabulary', () => {
  const order = ['lookback', 'trades', 'buys', 'change'];
  const across = (columnWidths: Record<string, number>) => {
    const width = Object.values(columnWidths).reduce((sum, each) => sum + each, 0);
    return survey.columnUnder(order, {left: 0, top: 0, width, height: 100, columnWidths});
  };

  it('switches with an even neighbor only once the pointer is a quarter into it', () => {
    const under = across({lookback: 100, trades: 100, buys: 100, change: 100});

    expect(under(224, 50, 'trades').orNull()).toBeNull();
    expect(under(226, 50, 'trades').orNull()).toBe('buys');
  });

  it('a slim column reaches deeper into a wide neighbor before switching', () => {
    const under = across({lookback: 100, trades: 40, buys: 360, change: 100});

    expect(under(140 + 360 / 3, 50, 'trades').orNull()).toBeNull();
    expect(under(140 + 360 / 2, 50, 'trades').orNull()).toBe('buys');
  });

  it('finds the row under the pointer when a row had no height measured at the lift', () => {
    const under = survey.rowUnder(['day', 'week', 'month'], {
      left: 0, top: 0, width: 400, height: 100, columnWidths: {}, rowHeights: {day: 50, month: 50}
    });

    expect(under(200, 90, 'day').orNull()).toBe('month');
  });
});
