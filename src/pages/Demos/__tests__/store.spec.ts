import {Trade} from '../Charts/coinbase';
import {demosStore, feedOpened, historyArrived, selectFeedStatus, selectLiveTrades, selectMeasures, tradeArrived} from '../store';

const trade = (id: number, price: number): Trade =>
  ({id, price, tradedAt: 1700000000000 + id, size: 1, side: 'buy'});

describe('the demos store', () => {
  it('a trade arriving is one action: the trades keep it, and the measures fold it in', () => {
    const store = demosStore();
    const before = selectMeasures(store.state).map(row => row.trades?.display);

    store.dispatch(feedOpened());
    store.dispatch(tradeArrived(trade(1, 100)));

    expect(selectFeedStatus(store.state)).toBe('streaming');
    expect(selectLiveTrades(store.state)).toHaveLength(1);
    expect(selectMeasures(store.state).map(row => row.trades?.display)).not.toEqual(before);
    expect(selectMeasures(store.state)[0]?.trades?.display).toBe('1');
  });

  it('history arriving folds into the measures too', () => {
    const store = demosStore();

    store.dispatch(historyArrived([trade(1, 100)]));

    expect(selectMeasures(store.state)[0]?.trades?.display).toBe('1');
  });
});
