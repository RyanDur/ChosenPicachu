import {describe, expect, it} from 'vitest';
import {drifted, eagerTravel, pointerTravel} from '../travel';
import {columnArrows} from '../arrows';

const pressed = (key: string) => ({key, preventDefault: (): void => undefined, currentTarget: null});

describe('the travel vocabulary', () => {
  it('measures the drift from the grab to the pointer', () => {
    expect(drifted({clientX: 130, clientY: 45}, {x: 100, y: 50})).toEqual({x: 30, y: -5});
  });

  it('eager travel settles a strike on the spot, and home or nothing settles nothing', () => {
    const settled: string[] = [];
    const under = (x: number) => x > 100 ? 'buys' : x > 50 ? 'trades' : undefined;

    eagerTravel(under, 'trades', struck => settled.push(struck))({clientX: 130, clientY: 10});
    eagerTravel(under, 'trades', struck => settled.push(struck))({clientX: 60, clientY: 10});
    eagerTravel(under, 'trades', struck => settled.push(struck))({clientX: 10, clientY: 10});

    expect(settled).toEqual(['buys']);
  });

  it('a move with no buttons is the drop', () => {
    const happened: string[] = [];
    const listener = pointerTravel(() => happened.push('moved'), () => happened.push('drop'));

    listener({buttons: 0, pointerId: 7, clientX: 0, clientY: 0, currentTarget: null});

    expect(happened).toEqual(['drop']);
  });

  it('column arrows answer only to left and right', () => {
    const arranged: {from: number; to: number}[] = [];
    const listener = columnArrows('trades', () => ['window', 'trades', 'buys', 'change'],
      ({from, to}) => arranged.push({from, to}));

    listener(pressed('ArrowRight'));
    listener(pressed('Enter'));

    expect(arranged).toEqual([{from: 1, to: 2}]);
  });

  it('a column arrow at the anchored edge arranges nothing', () => {
    const arranged: {from: number; to: number}[] = [];
    const listener = columnArrows('trades', () => ['window', 'trades', 'buys', 'change'],
      ({from, to}) => arranged.push({from, to}));

    listener(pressed('ArrowLeft'));

    expect(arranged).toEqual([]);
  });
});
