import {describe, expect, it} from 'vitest';
import {carried, drifted, eagerTravel, staticColumnArrows, staticRowArrows, surfaceTravel} from '../travel';

const pressed = (key: string) => ({key, preventDefault: (): void => undefined, currentTarget: null});

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

  it('seeds the origin on the first move, and drifts from it after', () => {
    const first = carried(undefined, {clientX: 100, clientY: 50});
    expect(first).toEqual({origin: {x: 100, y: 50}, drift: {x: 0, y: 0}});

    expect(carried(first.origin, {clientX: 130, clientY: 45}))
      .toEqual({origin: {x: 100, y: 50}, drift: {x: 30, y: -5}});
  });

  it('a surface move with no buttons is the drop; otherwise it drifts and strikes', () => {
    const happened: string[] = [];
    const listener = surfaceTravel(() => happened.push('drift'), () => happened.push('strike'), () => happened.push('drop'));

    listener({buttons: 1, pointerId: 1, clientX: 0, clientY: 0, currentTarget: null});
    listener({buttons: 0, pointerId: 1, clientX: 0, clientY: 0, currentTarget: null});

    expect(happened).toEqual(['drift', 'strike', 'drop']);
  });

  it('static column arrows claim the keys, arrange inside the anchors, and never at the rail', () => {
    const arranged: {from: number; to: number}[] = [];
    const listener = staticColumnArrows('trades', () => ['window', 'trades', 'buys', 'change'],
      nudge => arranged.push(nudge));

    listener(pressed('ArrowRight'));
    listener(pressed('ArrowLeft'));
    listener(pressed('Enter'));

    expect(arranged).toEqual([{from: 1, to: 2}]);
  });

  it('static row arrows always arrange, so the rail nudge still bakes', () => {
    const arranged: {to: number; after: number[]}[] = [];

    staticRowArrows(0, () => [0, 1, 2], nudge => arranged.push(nudge))(pressed('ArrowDown'));
    staticRowArrows(2, () => [0, 1, 2], nudge => arranged.push(nudge))(pressed('ArrowDown'));

    expect(arranged).toEqual([
      {to: 1, after: [1, 0, 2]},
      {to: 2, after: [0, 1, 2]}
    ]);
  });
});
