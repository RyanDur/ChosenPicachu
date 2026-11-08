import {describe, expect, it} from 'vitest';
import {sorting} from '../sorting';

describe('the sorting vocabulary', () => {
  it('ranks by the value in either direction, the unvalued counting as least', () => {
    const rows = [{trades: 3}, {trades: 9}, {}, {trades: 5}];

    expect(sorting.ranked(rows, row => row.trades, 'ascending')).toEqual([{}, {trades: 3}, {trades: 5}, {trades: 9}]);
    expect(sorting.ranked(rows, row => row.trades, 'descending')).toEqual([{trades: 9}, {trades: 5}, {trades: 3}, {}]);
  });

  it('a value that is no choice reads as nothing', () => {
    expect(sorting.choiceOf('nonsense').isNothing).toBe(true);
  });
});
