import {describe, expect, it} from 'vitest';
import {carried, drifted, eagerTravel, pointerTravel} from '../travel';
import {columnArrows, rowArrows} from '../arrows';

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

  it('seeds the origin on the first move, and drifts from it after', () => {
    const first = carried(undefined, {clientX: 100, clientY: 50});
    expect(first).toEqual({origin: {x: 100, y: 50}, drift: {x: 0, y: 0}});

    expect(carried(first.origin, {clientX: 130, clientY: 45}))
      .toEqual({origin: {x: 100, y: 50}, drift: {x: 30, y: -5}});
  });

  it('a move with no buttons is the drop', async () => {
    const happened: string[] = [];
    const holder = document.createElement('th');
    holder.setPointerCapture = () => undefined;
    const listener = pointerTravel(() => happened.push('moved'), () => happened.push('drop'));

    listener({buttons: 0, pointerId: 7, clientX: 0, clientY: 0, currentTarget: holder});
    await Promise.resolve();

    expect(happened).toEqual(['drop']);
  });

  it('the holder keeps the pointer capture across a move', async () => {
    const happened: string[] = [];
    const holder = document.createElement('th');
    holder.setPointerCapture = id => happened.push(`captured ${id}`);
    const listener = pointerTravel(() => happened.push('moved'), () => happened.push('drop'));

    listener({buttons: 1, pointerId: 7, clientX: 0, clientY: 0, currentTarget: holder});
    expect(happened).toEqual(['captured 7', 'moved']);
    await Promise.resolve();
    expect(happened).toEqual(['captured 7', 'moved', 'captured 7']);
  });


  const measuredTable = () => {
    const table = document.createElement('table');
    table.innerHTML = '<thead><tr><th class="cell window"></th><th class="cell trades"></th><th class="cell buys"></th><th class="cell change"></th></tr></thead><tbody><tr><td></td></tr><tr><td></td></tr></tbody>';
    [...table.tHead?.rows[0]?.cells ?? []].forEach((th, at) => {
      th.getBoundingClientRect = () => new DOMRect(0, 0, 100 + at, 0);
    });
    [...table.tBodies[0]?.rows ?? []].forEach((lane, at) => {
      lane.getBoundingClientRect = () => new DOMRect(0, 0, 0, 40 + at);
    });
    return table;
  };

  it('a column arrow hands over the column widths as they stand', () => {
    const th = measuredTable().tHead?.rows[0]?.cells[1];
    const widths: Readonly<Record<string, number>>[] = [];

    columnArrows('trades', () => ['window', 'trades', 'buys', 'change'], nudge => widths.push(nudge.widths))({...pressed('ArrowRight'), currentTarget: th ?? null});

    expect(widths).toEqual([{window: 100, trades: 101, buys: 102, change: 103}]);
  });

  it('a row arrow hands over the row heights as they stand', () => {
    const grip = measuredTable().tBodies[0]?.rows[0]?.cells[0];
    const heights: Readonly<Record<string, number>>[] = [];

    rowArrows('this minute', () => ['this minute', 'this hour'], nudge => heights.push(nudge.heights))({...pressed('ArrowDown'), currentTarget: grip ?? null});

    expect(heights).toEqual([{'this minute': 40, 'this hour': 41}]);
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

  it('row arrows always arrange, so the rail nudge still bakes', () => {
    const arranged: {to: number; after: string[]}[] = [];
    const rows = ['this minute', 'this hour', 'session'];

    rowArrows('this minute', () => rows, ({to, after}) => arranged.push({to, after}))(pressed('ArrowDown'));
    rowArrows('session', () => rows, ({to, after}) => arranged.push({to, after}))(pressed('ArrowDown'));

    expect(arranged).toEqual([
      {to: 1, after: ['this hour', 'this minute', 'session']},
      {to: 2, after: ['this minute', 'this hour', 'session']}
    ]);
  });
});
