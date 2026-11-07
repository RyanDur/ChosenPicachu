import {Trade} from '../../Charts/coinbase';
import {Period} from '../../Charts/period';
import {marketActions, marketSelectors, marketStore} from '..';

const trade = (id: number, price: number): Trade =>
  ({id, price, tradedAt: 1700000000000 + id, size: 1, side: 'buy'});

describe('the market store', () => {
  it('a trade arriving keeps it in the trades and folds it into the measures', () => {
    const store = marketStore();
    const before = marketSelectors.measures(store.state).map(row => row.trades?.display);

    store.dispatch(marketActions.tradeArrived(trade(1, 100)));

    expect(marketSelectors.liveTrades(store.state)).toHaveLength(1);
    expect(marketSelectors.measures(store.state).map(row => row.trades?.display)).not.toEqual(before);
    expect(marketSelectors.measures(store.state)[0]?.trades?.display).toBe('1');
  });

  it('history arriving folds into the measures too', () => {
    const store = marketStore();

    store.dispatch(marketActions.historyArrived([trade(1, 100)]));

    expect(marketSelectors.measures(store.state)[0]?.trades?.display).toBe('1');
  });

  it('past the newest 1500 trades the oldest fall off the front', () => {
    const store = marketStore();

    Array.from({length: 1501}, (_, at) => trade(at + 1, 100))
      .forEach(arrived => store.dispatch(marketActions.tradeArrived(arrived)));

    expect(marketSelectors.liveTrades(store.state)).toHaveLength(1500);
    expect(marketSelectors.liveTrades(store.state)[0].id).toBe(2);
  });

  it('asking again for a period that has arrived keeps its candles while the new ones are on their way', () => {
    const store = marketStore();
    const candle = {openedAt: 1700000000000, low: 1, high: 3, open: 2, close: 2.5, volume: 1};
    store.dispatch(marketActions.candlesArrived(Period.hour, [candle]));

    store.dispatch(marketActions.candlesAsked(Period.hour));

    expect(marketSelectors.periodHistoryOf(Period.hour)(store.state)).toEqual({state: 'arrived', candles: [candle]});
  });
});
