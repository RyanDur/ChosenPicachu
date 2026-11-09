import {describe, expect, it, onTestFinished, vi} from 'vitest';
import {http, HttpResponse, ws} from 'msw';
import {WebSocketClientConnectionProtocol as Client} from '@mswjs/interceptors/WebSocket';
import {HISTORY, server} from '@__test_support/server';
import {tradeFrame} from '@pages/Demos/__test_support/feed';
import {Period} from '../Period';
import {periodHistory} from '../period-history';
import {FeedTrouble} from '../exchange';
import {exchange, marketActions, marketReads, marketStore} from '..';

const candles = `${HISTORY}/products/BTC-USD/candles`;
const gate = (): {opened: Promise<void>; open: () => void} => {
  let open = (): void => undefined;
  const opened = new Promise<void>(resolve => {
    open = resolve;
  });
  return {opened, open};
};

describe('the exchange as middleware', () => {
  const coinbase = ws.link('ws://exchange.test');

  const coinbaseAnswering = (hungUp: Client[]) =>
    server.use(coinbase.addEventListener('connection', ({client}) => {
      client.addEventListener('message', event => {
        if (typeof event.data === 'string' && event.data.includes('subscribe')) {
          client.send(tradeFrame(100));
        }
      });
      client.addEventListener('close', () => hungUp.push(client));
    }));

  it('opens the feed and dispatches what arrives when the feed is requested', async () => {
    coinbaseAnswering([]);
    const store = marketStore(exchange({
      tradeFeed: 'ws://exchange.test',
      tradeHistory: '',
      tradeProduct: 'BTC-USD'
    }, () => undefined));
    expect(marketReads.feedStatus(store.state)).toBe('connecting');

    store.dispatch(marketActions.feedRequested());

    await vi.waitFor(() => expect(marketReads.feedStatus(store.state)).toBe('streaming'));
    await vi.waitFor(() => expect(marketReads.liveTrades(store.state)).toHaveLength(1));
  });

  it('hangs up when the feed is released', async () => {
    const hungUp: Client[] = [];
    coinbaseAnswering(hungUp);
    const store = marketStore(exchange({
      tradeFeed: 'ws://exchange.test',
      tradeHistory: '',
      tradeProduct: 'BTC-USD'
    }, () => undefined));
    store.dispatch(marketActions.feedRequested());
    await vi.waitFor(() => expect(marketReads.feedStatus(store.state)).toBe('streaming'));

    store.dispatch(marketActions.feedReleased());

    await vi.waitFor(() => expect(hungUp).toHaveLength(1));
  });

  it('an action that is not a feed request reaches the store untouched', () => {
    const store = marketStore(exchange({
      tradeFeed: 'ws://exchange.test',
      tradeHistory: '',
      tradeProduct: 'BTC-USD'
    }, () => undefined));

    store.dispatch({type: 'feedOpened'});

    expect(marketReads.feedStatus(store.state)).toBe('streaming');
  });

  it('asking for a period fetches its candles into the store', async () => {
    server.use(http.get(`${HISTORY}/products/BTC-USD/candles`, () => HttpResponse.json([[1700000000, 1, 3, 2, 2.5, 1]])));
    const store = marketStore(exchange({tradeFeed: '', tradeHistory: HISTORY, tradeProduct: 'BTC-USD'}, () => undefined));
    expect(marketReads.periodHistoryOf(Period.hour)(store.state)).toEqual({state: 'unasked'});

    store.dispatch(marketActions.candlesAsked(Period.hour));

    await vi.waitFor(() => expect(marketReads.periodHistoryOf(Period.hour)(store.state)).toEqual({
      state: 'arrived',
      candles: [{openedAt: 1700000000000, low: 1, high: 3, open: 2, close: 2.5, volume: 1}]
    }));
  });

  it('asking for a period asks for the span that ends now', async () => {
    vi.setSystemTime(new Date('2026-11-08T12:00:00.000Z'));
    onTestFinished(() => {
      vi.useRealTimers();
    });
    const asked: string[] = [];
    server.use(http.get(candles, ({request}) => {
      asked.push(new URL(request.url).search);
      return HttpResponse.json([]);
    }));
    const store = marketStore(exchange({tradeFeed: '', tradeHistory: HISTORY, tradeProduct: 'BTC-USD'}, () => undefined));

    store.dispatch(marketActions.candlesAsked(Period.hour));

    await vi.waitFor(() => expect(asked).toEqual([
      '?granularity=60&start=2026-11-08T11%3A00%3A00.000Z&end=2026-11-08T12%3A00%3A00.000Z'
    ]));
  });

  it('a period whose history is refused is unavailable, and the trouble is told', async () => {
    server.use(http.get(`${HISTORY}/products/BTC-USD/candles`, () => HttpResponse.json([], {status: 500})));
    const told: FeedTrouble[] = [];
    const store = marketStore(exchange({tradeFeed: '', tradeHistory: HISTORY, tradeProduct: 'BTC-USD'}, trouble => told.push(trouble)));

    store.dispatch(marketActions.candlesAsked(Period.day));

    await vi.waitFor(() => expect(marketReads.periodHistoryOf(Period.day)(store.state)).toEqual({state: 'unavailable'}));
    expect(told.map(({type}) => type)).toEqual(['candlesRefused']);
  });

  it('a row short of six numbers is left out and the rest draw', async () => {
    server.use(http.get(candles, () => HttpResponse.json([[1700000060, 1, 3, 2, 2.5, 1], [1700000000, 1, 3, 2, 2.5]])));
    const told: FeedTrouble[] = [];
    const store = marketStore(exchange({tradeFeed: '', tradeHistory: HISTORY, tradeProduct: 'BTC-USD'}, trouble => told.push(trouble)));

    store.dispatch(marketActions.candlesAsked(Period.hour));

    await vi.waitFor(() => expect(marketReads.periodHistoryOf(Period.hour)(store.state)).toEqual({
      state: 'arrived',
      candles: [{openedAt: 1700000060000, low: 1, high: 3, open: 2, close: 2.5, volume: 1}]
    }));
    expect(told).toEqual([]);
  });

  it('a row of more than six numbers is left out and the rest draw', async () => {
    server.use(http.get(candles, () =>
      HttpResponse.json([[1700000060, 1, 3, 2, 2.5, 1], [1700000000, 1, 3, 2, 2.5, 1, 7]])));
    const told: FeedTrouble[] = [];
    const store = marketStore(exchange({tradeFeed: '', tradeHistory: HISTORY, tradeProduct: 'BTC-USD'}, trouble => told.push(trouble)));

    store.dispatch(marketActions.candlesAsked(Period.hour));

    await vi.waitFor(() => expect(marketReads.periodHistoryOf(Period.hour)(store.state)).toEqual({
      state: 'arrived',
      candles: [{openedAt: 1700000060000, low: 1, high: 3, open: 2, close: 2.5, volume: 1}]
    }));
    expect(told).toEqual([]);
  });

  it('a history whose every row is unreadable is unavailable, and the trouble is told', async () => {
    server.use(http.get(candles, () => HttpResponse.json([['1700000000', '1', '3', '2', '2.5', '1'], [1700000000, 1, 3]])));
    const told: FeedTrouble[] = [];
    const store = marketStore(exchange({tradeFeed: '', tradeHistory: HISTORY, tradeProduct: 'BTC-USD'}, trouble => told.push(trouble)));

    store.dispatch(marketActions.candlesAsked(Period.hour));

    await vi.waitFor(() => expect(marketReads.periodHistoryOf(Period.hour)(store.state)).toEqual({state: 'unavailable'}));
    expect(told.map(({type}) => type)).toEqual(['candlesRefused']);
  });

  it('a period whose history is empty has arrived with no candles, and no trouble is told', async () => {
    server.use(http.get(candles, () => HttpResponse.json([])));
    const told: FeedTrouble[] = [];
    const store = marketStore(exchange({tradeFeed: '', tradeHistory: HISTORY, tradeProduct: 'BTC-USD'}, trouble => told.push(trouble)));

    store.dispatch(marketActions.candlesAsked(Period.hour));

    await vi.waitFor(() => expect(marketReads.periodHistoryOf(Period.hour)(store.state)).toEqual({state: 'arrived', candles: []}));
    expect(told).toEqual([]);
  });

  it('a period with no history to ask is unavailable, and no trouble is told', () => {
    const told: FeedTrouble[] = [];
    const store = marketStore(exchange({tradeFeed: '', tradeHistory: '', tradeProduct: 'BTC-USD'}, trouble => told.push(trouble)));

    store.dispatch(marketActions.candlesAsked(Period.hour));

    expect(marketReads.periodHistoryOf(Period.hour)(store.state)).toEqual({state: 'unavailable'});
    expect(told).toEqual([]);
  });

  it('a candle ask in flight is dropped when the feed is released, and no trouble is told', async () => {
    const answer = gate();
    const aborted = gate();
    let answered = false;
    server.use(http.get(candles, async ({request}) => {
      if (request.signal.aborted) {
        aborted.open();
      } else {
        request.signal.addEventListener('abort', aborted.open);
      }
      await answer.opened;
      answered = true;
      return HttpResponse.json([], {status: 500});
    }));
    const told: FeedTrouble[] = [];
    const store = marketStore(exchange({tradeFeed: '', tradeHistory: HISTORY, tradeProduct: 'BTC-USD'}, trouble => told.push(trouble)));
    store.dispatch(marketActions.candlesAsked(Period.hour));

    store.dispatch(marketActions.feedReleased());
    await aborted.opened;
    answer.open();
    await vi.waitFor(() => expect(answered).toBe(true));

    expect(marketReads.periodHistoryOf(Period.hour)(store.state)).toEqual({state: 'loading'});
    expect(told).toEqual([]);
  });

  it('asking the same period twice keeps only the later answer', async () => {
    const answers = [gate(), gate()];
    const answered: number[] = [];
    let asks = 0;
    server.use(http.get(candles, async () => {
      asks += 1;
      const ask = asks;
      await answers[ask - 1].opened;
      answered.push(ask);
      return HttpResponse.json([[1700000000 + ask, 1, 3, 2, 2.5, 1]]);
    }));
    const store = marketStore(exchange({tradeFeed: '', tradeHistory: HISTORY, tradeProduct: 'BTC-USD'}, () => undefined));

    store.dispatch(marketActions.candlesAsked(Period.hour));
    store.dispatch(marketActions.candlesAsked(Period.hour));
    answers[1].open();
    await vi.waitFor(() => expect(answered).toEqual([2]));
    answers[0].open();
    await vi.waitFor(() => expect(answered).toEqual([2, 1]));

    const shown = periodHistory.candlesOf(marketReads.periodHistoryOf(Period.hour)(store.state));
    expect(shown.map(({openedAt}) => openedAt)).toEqual([1700000002000]);
  });
});
