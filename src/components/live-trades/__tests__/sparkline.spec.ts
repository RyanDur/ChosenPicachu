import {sparklinePoints} from '../sparkline';

describe('sparklinePoints', () => {
  test('fewer than two prices draw no line', () => {
    expect(sparklinePoints([], 100, 40)).toEqual([]);
    expect(sparklinePoints([{at: 0, price: 50000}], 100, 40)).toEqual([]);
  });

  test('points spread by time, not by index', () => {
    expect(sparklinePoints([
      {at: 0, price: 1},
      {at: 1000, price: 2},
      {at: 4000, price: 5}
    ], 100, 40)).toEqual([
      {x: 0, y: 40},
      {x: 25, y: 30},
      {x: 100, y: 0}
    ]);
  });

  test('a flat series draws along the midline', () => {
    expect(sparklinePoints([
      {at: 0, price: 5},
      {at: 500, price: 5},
      {at: 1000, price: 5}
    ], 100, 40)).toEqual([
      {x: 0, y: 20},
      {x: 50, y: 20},
      {x: 100, y: 20}
    ]);
  });
});
