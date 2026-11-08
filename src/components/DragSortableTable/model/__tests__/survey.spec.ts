import {describe, expect, it} from 'vitest';
import {survey} from '../survey';

describe('the pointer vocabulary', () => {
  const order = ['window', 'trades', 'buys', 'change'];
  const across = (columnWidths: Record<string, number>) => {
    const width = Object.values(columnWidths).reduce((sum, each) => sum + each, 0);
    return survey.columnUnder(order, {left: 0, top: 0, width, height: 100, columnWidths});
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
