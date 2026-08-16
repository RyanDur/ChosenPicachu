import {describe, expect, it} from 'vitest';
import {choices, directionOf, sortedBy} from '../sorting';

describe('the sorting vocabulary', () => {
  it('derives the sorted direction only for the ruled column', () => {
    const rule = {column: 'trades', direction: 'descending'} as const;

    expect(sortedBy('trades', rule)).toBe('descending');
    expect(sortedBy('buys', rule)).toBeUndefined();
    expect(sortedBy('trades', undefined)).toBeUndefined();
  });

  it('speaks the three choices both worlds offer', () => {
    expect(choices.map(({display}) => display)).toEqual(['ascending', 'descending', 'as dealt']);
    expect(directionOf('ascending')).toBe('ascending');
    expect(directionOf('descending')).toBe('descending');
    expect(directionOf('as dealt')).toBeUndefined();
    expect(directionOf('nonsense')).toBeUndefined();
  });
});
