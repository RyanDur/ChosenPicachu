import {Trade} from '../coinbase';
import {Period} from '../Period';
import {marketActions, marketReads, marketStore} from '..';

const trade = (id: number, price: number): Trade =>
  ({id, price, tradedAt: 1700000000000 + id, size: 1, takerSide: 'sell'});

const tradeAfter = (minutes: number, id: number, price = 100): Trade =>
  ({...trade(id, price), tradedAt: 1700000000000 + minutes * 60000});

const rowNamed = (store: ReturnType<typeof marketStore>, name: string) =>
  marketReads.rows(store.state).find(row => row.lookback.display === name);

describe('the market store', () => {
  it('a trade arriving keeps it in the trades and folds it into the measures', () => {
    const store = marketStore();
    const before = marketReads.rows(store.state).map(row => row.trades?.display);

    store.dispatch(marketActions.tradesArrived([trade(1, 100)]));

    expect(marketReads.liveTrades(store.state)).toHaveLength(1);
    expect(marketReads.rows(store.state).map(row => row.trades?.display)).not.toEqual(before);
    expect(marketReads.rows(store.state)[0]?.trades?.display).toBe('1');
  });

  it('history arriving folds into the measures too', () => {
    const store = marketStore();

    store.dispatch(marketActions.historyArrived([trade(1, 100)]));

    expect(marketReads.rows(store.state)[0]?.trades?.display).toBe('1');
  });

  it('history arriving after trades have streamed clears the marks the newest trade left', () => {
    const store = marketStore();
    store.dispatch(marketActions.tradesArrived([trade(2, 100)]));
    store.dispatch(marketActions.tradesArrived([trade(3, 101)]));

    store.dispatch(marketActions.historyArrived([trade(1, 90)]));

    expect(marketReads.rows(store.state)[0]?.trades?.ticked).toBeUndefined();
  });

  it('past the newest 1500 trades the oldest fall off the front', () => {
    const store = marketStore();

    Array.from({length: 1501}, (_, at) => trade(at + 1, 100))
      .forEach(arrived => store.dispatch(marketActions.tradesArrived([arrived])));

    expect(marketReads.liveTrades(store.state)).toHaveLength(1500);
    expect(marketReads.liveTrades(store.state)[0].id).toBe(2);
  });

  it('a trade arriving past the newest 1500 counts and marks the 1501st', () => {
    const store = marketStore();
    store.dispatch(marketActions.tradesArrived(Array.from({length: 1500}, (_, at) => trade(at + 1, 100))));

    store.dispatch(marketActions.tradesArrived([trade(1501, 100)]));

    expect(rowNamed(store, 'this minute')?.trades?.display).toBe('1501');
    expect(rowNamed(store, 'this minute')?.trades?.ticked).toBe('up');
  });

  it('a session keeps counting the trades that aged out of the hour', () => {
    const store = marketStore();
    store.dispatch(marketActions.tradesArrived([tradeAfter(0, 1), tradeAfter(30, 2)]));

    store.dispatch(marketActions.tradesArrived([tradeAfter(61, 3)]));

    expect(rowNamed(store, 'this hour')?.trades?.display).toBe('2');
    expect(rowNamed(store, 'session')?.trades?.display).toBe('3');
  });

  it('a session\'s change runs from its first trade after that trade aged out', () => {
    const store = marketStore();
    store.dispatch(marketActions.tradesArrived([tradeAfter(0, 1, 100)]));

    store.dispatch(marketActions.tradesArrived([tradeAfter(61, 2, 110)]));

    expect(rowNamed(store, 'session')?.change?.display).toBe('+$10.00');
  });

  it('a session\'s vwap weighs the trades that aged out', () => {
    const store = marketStore();
    store.dispatch(marketActions.tradesArrived([tradeAfter(0, 1, 100)]));

    store.dispatch(marketActions.tradesArrived([tradeAfter(61, 2, 110)]));

    expect(rowNamed(store, 'session')?.vwap?.display).toBe('$105.00');
  });

  it('history older than the hour still counts in the session', () => {
    const store = marketStore();
    store.dispatch(marketActions.tradesArrived([tradeAfter(61, 2)]));

    store.dispatch(marketActions.historyArrived([tradeAfter(0, 1)]));

    expect(rowNamed(store, 'this hour')?.trades?.display).toBe('1');
    expect(rowNamed(store, 'session')?.trades?.display).toBe('2');
  });

  it('an hour nothing has asked for is unasked', () => {
    const store = marketStore();

    expect(marketReads.periodHistoryOf(Period.hour)(store.state)).toEqual({state: 'unasked'});
  });

  it('asking for a period loads it until its candles come', () => {
    const store = marketStore();

    store.dispatch(marketActions.candlesAsked(Period.day));

    expect(marketReads.periodHistoryOf(Period.day)(store.state)).toEqual({state: 'loading'});
  });

  it('asking again for a period that has arrived keeps its candles while the new ones are on their way', () => {
    const store = marketStore();
    const candle = {openedAt: 1700000000000, low: 1, high: 3, open: 2, close: 2.5, volume: 1};
    store.dispatch(marketActions.candlesArrived(Period.hour, [candle]));

    store.dispatch(marketActions.candlesAsked(Period.hour));

    expect(marketReads.periodHistoryOf(Period.hour)(store.state)).toEqual({state: 'arrived', candles: [candle]});
  });
});
