import {sparkline} from '../sparkline';

describe('sparkline.points', () => {
  test('fewer than two prices draw no line', () => {
    expect(sparkline.points([], 100, 40)).toEqual([]);
    expect(sparkline.points([{at: 0, price: 50000}], 100, 40)).toEqual([]);
  });

  test('points spread by time, not by index', () => {
    expect(sparkline.points([
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
    expect(sparkline.points([
      {at: 0, price: 5},
      {at: 500, price: 5},
      {at: 1000, price: 5}
    ], 100, 40)).toEqual([
      {x: 0, y: 20},
      {x: 50, y: 20},
      {x: 100, y: 20}
    ]);
  });

  test('with headroom the last point stops short of the right edge', () => {
    const points = sparkline.points([
      {at: 0, price: 1},
      {at: 1000, price: 2}
    ], 100, 40, 1000);

    expect(points[points.length - 1].x).toBe(50);
  });
});
