import {describe, expect, it} from 'vitest';
import {travel} from '../travel';

describe('the travel vocabulary', () => {
  it('measures the drift from the grab to the pointer', () => {
    expect(travel.drifted({clientX: 130, clientY: 45}, {x: 100, y: 50})).toEqual({x: 30, y: -5});
  });

  it('eager travel settles a strike on the spot, and home or nothing settles nothing', () => {
    const settled: string[] = [];
    const under = (x: number) => x > 100 ? 'buys' : x > 50 ? 'trades' : undefined;

    travel.eager(under, 'trades', struck => settled.push(struck))({clientX: 130, clientY: 10});
    travel.eager(under, 'trades', struck => settled.push(struck))({clientX: 60, clientY: 10});
    travel.eager(under, 'trades', struck => settled.push(struck))({clientX: 10, clientY: 10});

    expect(settled).toEqual(['buys']);
  });

  it('a move with no buttons is the drop', () => {
    const happened: string[] = [];
    const listener = travel.pointer(() => happened.push('moved'), () => happened.push('drop'));

    listener({buttons: 0, pointerId: 7, clientX: 0, clientY: 0, currentTarget: null});

    expect(happened).toEqual(['drop']);
  });
});
