import {describe, expect, it} from 'vitest';
import {sorting} from '../sorting';

describe('the sorting vocabulary', () => {
  it('ranks by the value in either direction, the unvalued counting as least', () => {
    const rows = [{trades: 3}, {trades: 9}, {}, {trades: 5}];

    expect(sorting.ranked(rows, row => row.trades, 'ascending')).toEqual([{}, {trades: 3}, {trades: 5}, {trades: 9}]);
    expect(sorting.ranked(rows, row => row.trades, 'descending')).toEqual([{trades: 9}, {trades: 5}, {trades: 3}, {}]);
  });

  it('offers ascending, descending and reset', () => {
    expect(sorting.choices.map(({display}) => display)).toEqual(['ascending', 'descending', 'reset']);
  });

  it('reads a direction from a choice, and none from reset or nonsense', () => {
    expect(sorting.directionOf('ascending')).toBe('ascending');
    expect(sorting.directionOf('descending')).toBe('descending');
    expect(sorting.directionOf('reset')).toBeUndefined();
    expect(sorting.directionOf('nonsense')).toBeUndefined();
  });
});
