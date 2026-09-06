import {dealtTableState, dealtIn, orderedTo, ruledBy, standingOf, tableStore} from '../table-state';

describe('the table store', () => {
  const dealt = dealtTableState(['window', 'trades', 'buys'], 2);

  test('a dispatch applies the transition and every subscriber hears it once', () => {
    const store = tableStore(dealt);
    const heard: string[][] = [];
    store.subscribe(() => heard.push([...store.state().order]));

    store.dispatch(orderedTo(1, 2));

    expect(store.state().order).toEqual(['window', 'buys', 'trades']);
    expect(heard).toEqual([['window', 'buys', 'trades']]);
  });

  test('an unsubscribed listener hears nothing more', () => {
    const store = tableStore(dealt);
    let heard = 0;
    const leave = store.subscribe(() => heard++);

    store.dispatch(orderedTo(1, 2));
    leave();
    store.dispatch(orderedTo(1, 2));

    expect(heard).toBe(1);
  });

  test('the state read between dispatches is the same value', () => {
    const store = tableStore(dealt);

    expect(store.state()).toBe(store.state());
    store.dispatch(orderedTo(1, 2));
    expect(store.state()).toBe(store.state());
  });

  test('the standing ranks the seats by the rule, and the store never stores it', () => {
    const rows = [{trades: 3}, {trades: 9}];
    const store = tableStore(dealt);

    store.dispatch(ruledBy({column: 'trades', direction: 'descending'}));

    expect(store.state().seats).toEqual([0, 1]);
    expect(standingOf(rows, store.state())).toEqual([1, 0]);
    expect('seated' in store.state()).toBe(false);
  });

  test('rows that arrive after the deal take the seats that were missing', () => {
    expect(dealtIn(4)(dealt).seats).toEqual([0, 1, 2, 3]);
    expect(dealtIn(2)(dealt)).toBe(dealt);
  });
});
