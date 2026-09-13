import {Trade} from '../Charts/coinbase';
import {demosStore, historyArrived, selectLiveTrades, selectMeasures, tradeArrived} from '../store';

const trade = (id: number, price: number): Trade =>
  ({id, price, tradedAt: 1700000000000 + id, size: 1, side: 'buy'});

describe('the demos store', () => {
  it('a trade arriving keeps it in the trades and folds it into the measures', () => {
    const store = demosStore();
    const before = selectMeasures(store.state).map(row => row.trades?.display);

    store.dispatch(tradeArrived(trade(1, 100)));

    expect(selectLiveTrades(store.state)).toHaveLength(1);
    expect(selectMeasures(store.state).map(row => row.trades?.display)).not.toEqual(before);
    expect(selectMeasures(store.state)[0]?.trades?.display).toBe('1');
  });

  it('history arriving folds into the measures too', () => {
    const store = demosStore();

    store.dispatch(historyArrived([trade(1, 100)]));

    expect(selectMeasures(store.state)[0]?.trades?.display).toBe('1');
  });

  it('past the newest 1500 trades the oldest fall off the front', () => {
    const store = demosStore();

    Array.from({length: 1501}, (_, at) => trade(at + 1, 100)).forEach(arrived => store.dispatch(tradeArrived(arrived)));

    expect(selectLiveTrades(store.state)).toHaveLength(1500);
    expect(selectLiveTrades(store.state)[0].id).toBe(2);
  });
});
