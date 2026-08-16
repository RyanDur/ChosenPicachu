import {describe, expect, it} from 'vitest';
import {drifted, eagerTravel} from '../travel';

describe('the travel vocabulary', () => {
  it('measures the drift from the grab to the pointer', () => {
    expect(drifted({clientX: 130, clientY: 45}, {x: 100, y: 50})).toEqual({x: 30, y: -5});
  });

  it('eager travel settles a strike on the spot, and home or nothing settles nothing', () => {
    const settled: string[] = [];
    const under = (x: number) => x > 100 ? 'buys' : x > 50 ? 'trades' : undefined;

    eagerTravel(under, struck => settled.push(struck))('trades', {clientX: 130, clientY: 10});
    eagerTravel(under, struck => settled.push(struck))('trades', {clientX: 60, clientY: 10});
    eagerTravel(under, struck => settled.push(struck))('trades', {clientX: 10, clientY: 10});

    expect(settled).toEqual(['buys']);
  });
});
