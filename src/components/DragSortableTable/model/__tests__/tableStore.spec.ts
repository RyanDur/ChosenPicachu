import {TableMiddleware, tableStore} from '../store';
import {columnShares} from '../../__test_support';
import {tableActions} from '../actions';
import {tableReducer} from '../reducer';
import {tableState} from '../table-state';
import {arrangements} from '../arrangement';

const noFloors = {};

const widths = (state: typeof tableState.resting): readonly number[] => Object.values(tableState.widthsOf(state) ?? {});

describe('the table store', () => {
  test('a dispatch applies the reducer and every subscriber hears it once', () => {
    const store = tableStore();
    const heard: (readonly number[])[] = [];
    store.subscribe(() => heard.push(widths(store.state)));

    store.dispatch(tableActions.measured(columnShares(40, 30), noFloors));

    expect(widths(store.state)).toEqual([40, 30, 30]);
    expect(heard).toEqual([[40, 30, 30]]);
  });

  test('the reducer applies its own actions', () => {
    const measuredState = tableReducer(tableState.resting, tableActions.measured(columnShares(40, 30), noFloors));

    expect(widths(measuredState)).toEqual([40, 30, 30]);
  });

  test("the reducer hands back the same state for anyone else's action", () => {
    const untouched = tableReducer(tableState.resting, {type: 'userArrived'});

    expect(untouched).toBe(tableState.resting);
  });

  test('an unsubscribed listener hears nothing more', () => {
    const store = tableStore();
    let heard = 0;
    const leave = store.subscribe(() => heard++);

    store.dispatch(tableActions.measured(columnShares(40, 30), noFloors));
    leave();
    store.dispatch(tableActions.measured(columnShares(50, 20), noFloors));

    expect(heard).toBe(1);
  });

  test('the state read between dispatches is the same value', () => {
    const store = tableStore();

    expect(store.state).toBe(store.state);
    store.dispatch(tableActions.measured(columnShares(40, 30), noFloors));
    expect(store.state).toBe(store.state);
  });

  test('middleware sees every dispatch before the reducer runs', () => {
    const seen: (readonly number[])[] = [];
    const watching: TableMiddleware = () => next => action => {
      seen.push(widths(store.state));
      next(action);
    };
    const store = tableStore(watching);

    store.dispatch(tableActions.measured(columnShares(40, 30), noFloors));

    expect(seen).toEqual([[]]);
    expect(widths(store.state)).toEqual([40, 30, 30]);
  });

  test("nothing outside can swap the store's dispatch or its state", () => {
    const store = tableStore();

    expect(() => {
      (store as {dispatch: unknown}).dispatch = () => undefined;
    }).toThrow(TypeError);
    expect(() => {
      (store as {state: unknown}).state = tableState.resting;
    }).toThrow(TypeError);
  });

  test('a middleware has two dispatches: next goes down the chain, the api goes back to the top', () => {
    const passed: string[] = [];
    const outer: TableMiddleware = () => next => action => {
      passed.push('outer');
      next(action);
    };
    const inner: TableMiddleware = api => next => action => {
      passed.push('inner');
      next(action);
      if (passed.length === 2) {
        api.dispatch(tableActions.measured(columnShares(50, 20), noFloors));
      }
    };
    const store = tableStore(outer, inner);

    store.dispatch(tableActions.measured(columnShares(40, 30), noFloors));

    expect(passed).toEqual(['outer', 'inner', 'outer', 'inner']);
    expect(widths(store.state)).toEqual([50, 20, 30]);
  });

  test('a listener sees the state before and after the change, and can dispatch again', () => {
    const store = tableStore();
    const heard: [readonly number[], readonly number[]][] = [];
    store.subscribe((previous, current, dispatch) => {
      heard.push([widths(previous), widths(current())]);
      if (heard.length === 1) {
        dispatch(tableActions.measured(columnShares(50, 20), noFloors));
      }
    });

    store.dispatch(tableActions.measured(columnShares(40, 30), noFloors));

    expect(heard).toEqual([
      [[], [40, 30, 30]],
      [[40, 30, 30], [50, 20, 30]]
    ]);
  });

  test('the pattern holds its order: middleware, then the reducer, then the listeners', () => {
    const order: string[] = [];
    const layer: TableMiddleware = () => next => action => {
      order.push('middleware');
      next(action);
      order.push('middleware after');
    };
    const store = tableStore(layer);
    store.subscribe(previous => order.push(`listener saw ${widths(previous).join()} become ${widths(store.state).join()}`));

    store.dispatch(tableActions.measured(columnShares(40, 30), noFloors));

    expect(order).toEqual(['middleware', 'listener saw  become 40,30,30', 'middleware after']);
  });
});

describe('the arrangement', () => {
  const trades: Readonly<Record<string, number>> = {'this minute': 3, 'this hour': 9, session: 5};
  const valueOf = (row: string, column: string) => column === 'trades' ? trades[row] : undefined;
  const arranged = arrangements.of(['window', 'trades', 'buys'], ['this minute', 'this hour']);

  test('keys that arrive later sit after the ones still seated, and the sort ranks them all', () => {
    const byTrades = arrangements.reducer(arranged, arrangements.sorted('trades', 'descending'));

    const more = arrangements.reducer(byTrades, arrangements.arrived(['this minute', 'this hour', 'session']));

    expect(more.rows).toEqual(['this minute', 'this hour', 'session']);
    expect(arrangements.standingOf(more, valueOf)).toEqual(['this hour', 'session', 'this minute']);
  });

  test('a foreign action leaves the arrangement as it was', () => {
    expect(arrangements.reducer(arranged, {type: 'tradeArrived'})).toBe(arranged);
  });
});

describe('a sizing', () => {
  const after = (...actions: Parameters<typeof tableReducer>[1][]) => actions.reduce(tableReducer, tableState.resting);

  test('says nothing when it ends on the whole percent it began at, however far the fractions drifted', () => {
    const ended = after(
      tableActions.measured({window: 12.999544950163525, trades: 40, buys: 47.000455049836475}, noFloors),
      tableActions.tradedBy('window', 'trades', 1),
      tableActions.tradedBy('window', 'trades', -1.000012166),
      tableActions.arrowLifted('window'));

    expect(ended.report).toBeUndefined();
  });

  test('says the new share when it ends on another whole percent', () => {
    const ended = after(
      tableActions.measured({window: 12.999544950163525, trades: 40, buys: 47.000455049836475}, noFloors),
      tableActions.tradedBy('window', 'trades', 2),
      tableActions.arrowLifted('window'));

    expect(ended.report).toEqual({about: 'share', name: 'window', share: 14.999544950163525});
  });

  test('an arrow on another handle ends a keyboard resize and says its new share', () => {
    const ended = after(
      tableActions.measured({window: 13, trades: 40, buys: 47}, noFloors),
      tableActions.tradedBy('window', 'trades', 2),
      tableActions.tradedBy('trades', 'buys', 1));

    expect(ended.report).toEqual({about: 'share', name: 'window', share: 15});
  });

  test('a press on another handle ends a keyboard resize and says its new share', () => {
    const ended = after(
      tableActions.measured({window: 13, trades: 40, buys: 47}, noFloors),
      tableActions.tradedBy('window', 'trades', 2),
      tableActions.gripped('trades', {fromX: 100, pxPerShare: 10}));

    expect(ended.report).toEqual({about: 'share', name: 'window', share: 15});
  });

  test('a lifted arrow leaves a pointer drag of the same column under way', () => {
    const dragged = after(
      tableActions.measured({window: 13, trades: 40, buys: 47}, noFloors),
      tableActions.gripped('window', {fromX: 100, pxPerShare: 10}),
      tableActions.tradedBy('window', 'trades', 1),
      tableActions.arrowLifted('window'),
      tableActions.handleDragged('window', 'trades', 120));

    expect(tableState.widthsOf(dragged)?.window).toBe(16);
  });

  test('a pointer moving while an arrow holds the resize trades nothing', () => {
    const keyed = after(
      tableActions.measured({window: 13, trades: 40, buys: 47}, noFloors),
      tableActions.tradedBy('window', 'trades', 1),
      tableActions.handleDragged('window', 'trades', 200));

    expect(tableState.widthsOf(keyed)?.window).toBe(14);
  });

  test('a pointer move on a handle that holds no grip trades nothing', () => {
    const elsewhere = after(
      tableActions.measured({window: 13, trades: 40, buys: 47}, noFloors),
      tableActions.gripped('window', {fromX: 100, pxPerShare: 10}),
      tableActions.handleDragged('trades', 'buys', 120));

    expect(tableState.widthsOf(elsewhere)).toEqual({window: 13, trades: 40, buys: 47});
  });

  test('a release on another handle leaves the grip under way', () => {
    const dragged = after(
      tableActions.measured({window: 13, trades: 40, buys: 47}, noFloors),
      tableActions.gripped('window', {fromX: 100, pxPerShare: 10}),
      tableActions.handleReleased('trades'),
      tableActions.handleDragged('window', 'trades', 120));

    expect(tableState.widthsOf(dragged)?.window).toBe(15);
  });

  test('a release on the gripped handle ends the grip and says its new share', () => {
    const released = after(
      tableActions.measured({window: 13, trades: 40, buys: 47}, noFloors),
      tableActions.gripped('window', {fromX: 100, pxPerShare: 10}),
      tableActions.handleDragged('window', 'trades', 120),
      tableActions.handleReleased('window'),
      tableActions.handleDragged('window', 'trades', 200));

    expect(tableState.widthsOf(released)?.window).toBe(15);
    expect(released.report).toEqual({about: 'share', name: 'window', share: 15});
  });
});
