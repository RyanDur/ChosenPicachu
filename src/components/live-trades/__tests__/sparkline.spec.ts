import {sparklinePath} from '../sparkline';

describe('sparklinePath', () => {
  test('fewer than two prices draw no line', () => {
    expect(sparklinePath([], 100, 40)).toBe('');
    expect(sparklinePath([50000], 100, 40)).toBe('');
  });

  test('a rising pair spans the box corner to corner', () => {
    expect(sparklinePath([1, 2], 100, 40)).toBe('0,40 100,0');
  });

  test('a flat series draws along the midline', () => {
    expect(sparklinePath([5, 5, 5], 100, 40)).toBe('0,20 50,20 100,20');
  });

  test('prices spread evenly across the width and scale to the height', () => {
    expect(sparklinePath([0, 10, 5], 100, 40)).toBe('0,40 50,0 100,20');
  });
});
