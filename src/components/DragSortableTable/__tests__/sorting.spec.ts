import {describe, expect, it} from 'vitest';
import {choices, directionOf, ranked} from '../sorting';

describe('the sorting vocabulary', () => {
  it('ranks by the value in either direction, the unvalued counting as least', () => {
    const rows = [{trades: 3}, {trades: 9}, {}, {trades: 5}];

    expect(ranked(rows, row => row.trades, 'ascending')).toEqual([{}, {trades: 3}, {trades: 5}, {trades: 9}]);
    expect(ranked(rows, row => row.trades, 'descending')).toEqual([{trades: 9}, {trades: 5}, {trades: 3}, {}]);
  });

  it('speaks the three choices both worlds offer', () => {
    expect(choices.map(({display}) => display)).toEqual(['ascending', 'descending', 'reset']);
    expect(directionOf('ascending')).toBe('ascending');
    expect(directionOf('descending')).toBe('descending');
    expect(directionOf('reset')).toBeUndefined();
    expect(directionOf('nonsense')).toBeUndefined();
  });
});
