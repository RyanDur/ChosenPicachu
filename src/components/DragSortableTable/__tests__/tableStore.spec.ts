import {TableMiddleware, tableStore} from '../store';
import {Labelled, Seated, orderOf, standingOf, tableOf} from '../table-state';
import {orderedTo, ruledBy, seated as seating} from '../actions';
import {tableReducer} from '../reducer';
import {selectStanding} from '../selectors';

const labelled = (name: string) => ({name, data: {label: name}});

const window = (key: string, trades: number): Seated => ({key, values: {trades}});

describe('the table store', () => {
  const seated = tableOf([labelled('window'), labelled('trades'), labelled('buys')], ['this minute', 'this hour']);
  const rows = [window('this minute', 3), window('this hour', 9)];

  test('a dispatch applies the reducer and every subscriber hears it once', () => {
    const store = tableStore(seated);
    const heard: (readonly string[])[] = [];
    store.subscribe(() => heard.push(orderOf(store.state)));

    store.dispatch(orderedTo(1, 2));

    expect(orderOf(store.state)).toEqual(['window', 'buys', 'trades']);
    expect(heard).toEqual([['window', 'buys', 'trades']]);
  });

  test('the reducer answers its own actions and hands back the same state for anyone else’s', () => {
    const reordered = tableReducer(seated, orderedTo(1, 2));
    const untouched = tableReducer(seated, {type: 'userArrived'});

    expect(orderOf(reordered)).toEqual(['window', 'buys', 'trades']);
    expect(untouched).toBe(seated);
  });

  test('an unsubscribed listener hears nothing more', () => {
    const store = tableStore(seated);
    let heard = 0;
    const leave = store.subscribe(() => heard++);

    store.dispatch(orderedTo(1, 2));
    leave();
    store.dispatch(orderedTo(1, 2));

    expect(heard).toBe(1);
  });

  test('the state read between dispatches is the same value', () => {
    const store = tableStore(seated);

    expect(store.state).toBe(store.state);
    store.dispatch(orderedTo(1, 2));
    expect(store.state).toBe(store.state);
  });

  test('a rule marks the column and ranks the standing over the rows given; the seats stay as the hand left them', () => {
    const store = tableStore(seated);

    store.dispatch(ruledBy('trades', 'descending'));

    expect(store.state.columns.map(({sorted}) => sorted)).toEqual([undefined, 'descending', undefined]);
    expect(standingOf(store.state)).toEqual(['this minute', 'this hour']);
    expect(selectStanding(store.state, rows)).toEqual(['this hour', 'this minute']);
  });

  test('middleware sees every dispatch before the reducer runs', () => {
    const seen: string[] = [];
    const watching: TableMiddleware<Labelled> = () => next => action => {
      seen.push(orderOf(store.state).join());
      next(action);
    };
    const store = tableStore(seated, watching);

    store.dispatch(orderedTo(1, 2));

    expect(seen).toEqual(['window,trades,buys']);
    expect(orderOf(store.state)).toEqual(['window', 'buys', 'trades']);
  });

  test('keys that arrive later take the seats after the ones still seated, and the rule ranks them all', () => {
    const ruled = tableReducer(seated, ruledBy('trades', 'descending'));
    const arrival = [...rows, window('session', 5)];

    const arrived = tableReducer(ruled, seating(arrival.map(({key}) => key)));

    expect(standingOf(arrived)).toEqual(['this minute', 'this hour', 'session']);
    expect(selectStanding(arrived, arrival)).toEqual(['this hour', 'session', 'this minute']);
  });
  test('the store is frozen: nothing can swap its dispatch or its state from outside', () => {
    const store = tableStore(seated);

    expect(Object.isFrozen(store)).toBe(true);
    expect(() => {
      (store as {dispatch: unknown}).dispatch = () => undefined;
    }).toThrow(TypeError);
    expect(() => {
      (store as {state: unknown}).state = seated;
    }).toThrow(TypeError);
  });
  test('a middleware has two dispatches: next goes down the chain, the api goes back to the top', () => {
    const passed: string[] = [];
    const outer: TableMiddleware<Labelled> = () => next => action => {
      passed.push('outer');
      next(action);
    };
    const inner: TableMiddleware<Labelled> = api => next => action => {
      passed.push('inner');
      next(action);
      if (passed.length === 2) {
        api.dispatch(orderedTo(1, 2));
      }
    };
    const store = tableStore(seated, outer, inner);

    store.dispatch(orderedTo(1, 2));

    expect(passed).toEqual(['outer', 'inner', 'outer', 'inner']);
    expect(orderOf(store.state)).toEqual(['window', 'trades', 'buys']);
  });
  test('a listener hears the state before, a way to read the state now, and the dispatch', () => {
    const store = tableStore(seated);
    const heard: [readonly string[], readonly string[]][] = [];
    store.subscribe((previous, current, dispatch) => {
      heard.push([orderOf(previous), orderOf(current())]);
      if (heard.length === 1) {
        dispatch(orderedTo(1, 2));
      }
    });

    store.dispatch(orderedTo(1, 2));

    expect(heard).toEqual([
      [['window', 'trades', 'buys'], ['window', 'buys', 'trades']],
      [['window', 'buys', 'trades'], ['window', 'trades', 'buys']]
    ]);
  });
  test('the pattern holds its order: middleware, then the reducer, then the listeners', () => {
    const order: string[] = [];
    const layer: TableMiddleware<Labelled> = () => next => action => {
      order.push('middleware');
      next(action);
      order.push('middleware after');
    };
    const store = tableStore(seated, layer);
    store.subscribe(previous => order.push(`listener saw ${orderOf(previous).join()} become ${orderOf(store.state).join()}`));

    store.dispatch(orderedTo(1, 2));

    expect(order).toEqual(['middleware', 'listener saw window,trades,buys become window,buys,trades', 'middleware after']);
  });
});
