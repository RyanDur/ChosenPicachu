import {TableMiddleware, tableStore} from '../store';
import {measured} from '../actions';
import {tableReducer} from '../reducer';
import {resting, widthsOf} from '../table-state';
import {arrangementOf, arrangementReducer, arrived, columnMoved, rowMoved, sorted, standingOf} from '../arrangement';

const shares = (window: number, trades: number): Readonly<Record<string, number>> => ({window, trades, buys: 100 - window - trades});
const widths = (state: typeof resting): readonly number[] => Object.values(widthsOf(state) ?? {});

describe('the table store', () => {
  test('a dispatch applies the reducer and every subscriber hears it once', () => {
    const store = tableStore();
    const heard: (readonly number[])[] = [];
    store.subscribe(() => heard.push(widths(store.state)));

    store.dispatch(measured(shares(40, 30)));

    expect(widths(store.state)).toEqual([40, 30, 30]);
    expect(heard).toEqual([[40, 30, 30]]);
  });

  test('the reducer applies its own actions', () => {
    const measuredState = tableReducer(resting, measured(shares(40, 30)));

    expect(widths(measuredState)).toEqual([40, 30, 30]);
  });

  test("the reducer hands back the same state for anyone else's action", () => {
    const untouched = tableReducer(resting, {type: 'userArrived'});

    expect(untouched).toBe(resting);
  });

  test('an unsubscribed listener hears nothing more', () => {
    const store = tableStore();
    let heard = 0;
    const leave = store.subscribe(() => heard++);

    store.dispatch(measured(shares(40, 30)));
    leave();
    store.dispatch(measured(shares(50, 20)));

    expect(heard).toBe(1);
  });

  test('the state read between dispatches is the same value', () => {
    const store = tableStore();

    expect(store.state).toBe(store.state);
    store.dispatch(measured(shares(40, 30)));
    expect(store.state).toBe(store.state);
  });

  test('middleware sees every dispatch before the reducer runs', () => {
    const seen: (readonly number[])[] = [];
    const watching: TableMiddleware = () => next => action => {
      seen.push(widths(store.state));
      next(action);
    };
    const store = tableStore(watching);

    store.dispatch(measured(shares(40, 30)));

    expect(seen).toEqual([[]]);
    expect(widths(store.state)).toEqual([40, 30, 30]);
  });

  test("nothing outside can swap the store's dispatch or its state", () => {
    const store = tableStore();

    expect(() => {
      (store as {dispatch: unknown}).dispatch = () => undefined;
    }).toThrow(TypeError);
    expect(() => {
      (store as {state: unknown}).state = resting;
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
        api.dispatch(measured(shares(50, 20)));
      }
    };
    const store = tableStore(outer, inner);

    store.dispatch(measured(shares(40, 30)));

    expect(passed).toEqual(['outer', 'inner', 'outer', 'inner']);
    expect(widths(store.state)).toEqual([50, 20, 30]);
  });

  test('a listener sees the state before and after the change, and can dispatch again', () => {
    const store = tableStore();
    const heard: [readonly number[], readonly number[]][] = [];
    store.subscribe((previous, current, dispatch) => {
      heard.push([widths(previous), widths(current())]);
      if (heard.length === 1) {
        dispatch(measured(shares(50, 20)));
      }
    });

    store.dispatch(measured(shares(40, 30)));

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

    store.dispatch(measured(shares(40, 30)));

    expect(order).toEqual(['middleware', 'listener saw  become 40,30,30', 'middleware after']);
  });
});

describe('the arrangement', () => {
  const trades: Readonly<Record<string, number>> = {'this minute': 3, 'this hour': 9, session: 5};
  const valueOf = (row: string, column: string) => column === 'trades' ? trades[row] : undefined;
  const arranged = arrangementOf(['window', 'trades', 'buys'], ['this minute', 'this hour']);

  test('a column moves to the seat the hand chose', () => {
    expect(arrangementReducer(arranged, columnMoved('trades', 2)).columns).toEqual(['window', 'buys', 'trades']);
  });

  test('a sort ranks the standing over the values given; the rows stay as the hand left them', () => {
    const byTrades = arrangementReducer(arranged, sorted('trades', 'descending'));

    expect(byTrades.rows).toEqual(['this minute', 'this hour']);
    expect(standingOf(byTrades, valueOf)).toEqual(['this hour', 'this minute']);
  });

  test('keys that arrive later sit after the ones still seated, and the sort ranks them all', () => {
    const byTrades = arrangementReducer(arranged, sorted('trades', 'descending'));

    const more = arrangementReducer(byTrades, arrived(['this minute', 'this hour', 'session']));

    expect(more.rows).toEqual(['this minute', 'this hour', 'session']);
    expect(standingOf(more, valueOf)).toEqual(['this hour', 'session', 'this minute']);
  });

  test('a row moved under a sort ends the sort, and the rows stay where the sort showed them', () => {
    const byTrades = arrangementReducer(arranged, sorted('trades', 'descending'));

    const ended = arrangementReducer(byTrades, rowMoved('this hour', 0, ['this hour', 'this minute']));

    expect(ended.sort).toBeUndefined();
    expect(ended.rows).toEqual(['this hour', 'this minute']);
    expect(standingOf(ended, valueOf)).toEqual(['this hour', 'this minute']);
  });

  test('a moved row takes the seat the hand chose in the standing it was shown', () => {
    const moved = arrangementReducer(arranged, rowMoved('this minute', 1, ['this minute', 'this hour']));

    expect(moved.rows).toEqual(['this hour', 'this minute']);
  });

  test('a foreign action leaves the arrangement as it was', () => {
    expect(arrangementReducer(arranged, {type: 'tradeArrived'})).toBe(arranged);
  });
});
