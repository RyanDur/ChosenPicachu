import {describe, expect, it, vi} from 'vitest';
import {delay, http, HttpResponse, ws} from 'msw';
import {WebSocketClientConnectionProtocol as Client} from '@mswjs/interceptors/WebSocket';
import {HISTORY, server} from '@__test_support/server';
import {tradeFrame} from '@pages/Demos/__test_support/feed';
import {exchange, FeedTrouble} from '../exchange';
import {Period} from '../Charts/period';
import {candlesOf} from '../Charts/period-history';
import {candlesAsked, demosStore, feedReleased, feedRequested, periodHistoryOf, selectFeedStatus, selectLiveTrades} from '../store';

const candles = `${HISTORY}/products/BTC-USD/candles`;
const settled = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

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
    const store = demosStore(exchange({
      tradeFeed: 'ws://exchange.test',
      tradeHistory: '',
      tradeProduct: 'BTC-USD'
    }, () => undefined));
    expect(selectFeedStatus(store.state)).toBe('connecting');

    store.dispatch(feedRequested());

    await vi.waitFor(() => expect(selectFeedStatus(store.state)).toBe('streaming'));
    await vi.waitFor(() => expect(selectLiveTrades(store.state)).toHaveLength(1));
  });

  it('hangs up when the feed is released', async () => {
    const hungUp: Client[] = [];
    coinbaseAnswering(hungUp);
    const store = demosStore(exchange({
      tradeFeed: 'ws://exchange.test',
      tradeHistory: '',
      tradeProduct: 'BTC-USD'
    }, () => undefined));
    store.dispatch(feedRequested());
    await vi.waitFor(() => expect(selectFeedStatus(store.state)).toBe('streaming'));

    store.dispatch(feedReleased());

    await vi.waitFor(() => expect(hungUp).toHaveLength(1));
  });

  it('an action that is not a feed request reaches the store untouched', () => {
    const store = demosStore(exchange({
      tradeFeed: 'ws://exchange.test',
      tradeHistory: '',
      tradeProduct: 'BTC-USD'
    }, () => undefined));

    store.dispatch({type: 'feedOpened'});

    expect(selectFeedStatus(store.state)).toBe('streaming');
  });

  it('asking for a period fetches its candles into the store', async () => {
    server.use(http.get(`${HISTORY}/products/BTC-USD/candles`, () => HttpResponse.json([[1700000000, 1, 3, 2, 2.5, 1]])));
    const store = demosStore(exchange({tradeFeed: '', tradeHistory: HISTORY, tradeProduct: 'BTC-USD'}, () => undefined));
    expect(periodHistoryOf(Period.hour)(store.state)).toEqual({state: 'loading'});

    store.dispatch(candlesAsked(Period.hour));

    await vi.waitFor(() => expect(periodHistoryOf(Period.hour)(store.state)).toEqual({
      state: 'arrived',
      candles: [{openedAt: 1700000000000, low: 1, high: 3, open: 2, close: 2.5, volume: 1}]
    }));
  });

  it('a period whose history is refused is unavailable, and the trouble is told', async () => {
    server.use(http.get(`${HISTORY}/products/BTC-USD/candles`, () => HttpResponse.json([], {status: 500})));
    const told: FeedTrouble[] = [];
    const store = demosStore(exchange({tradeFeed: '', tradeHistory: HISTORY, tradeProduct: 'BTC-USD'}, trouble => told.push(trouble)));

    store.dispatch(candlesAsked(Period.day));

    await vi.waitFor(() => expect(periodHistoryOf(Period.day)(store.state)).toEqual({state: 'unavailable'}));
    expect(told.map(({type}) => type)).toEqual(['candlesRefused']);
  });

  it('a period with no history to ask is unavailable, and no trouble is told', () => {
    const told: FeedTrouble[] = [];
    const store = demosStore(exchange({tradeFeed: '', tradeHistory: '', tradeProduct: 'BTC-USD'}, trouble => told.push(trouble)));

    store.dispatch(candlesAsked(Period.hour));

    expect(periodHistoryOf(Period.hour)(store.state)).toEqual({state: 'unavailable'});
    expect(told).toEqual([]);
  });

  it('a candle ask in flight is dropped when the feed is released, and no trouble is told', async () => {
    server.use(http.get(candles, async () => {
      await delay(50);
      return HttpResponse.json([], {status: 500});
    }));
    const told: FeedTrouble[] = [];
    const store = demosStore(exchange({tradeFeed: '', tradeHistory: HISTORY, tradeProduct: 'BTC-USD'}, trouble => told.push(trouble)));
    store.dispatch(candlesAsked(Period.hour));

    store.dispatch(feedReleased());
    await settled(150);

    expect(periodHistoryOf(Period.hour)(store.state)).toEqual({state: 'loading'});
    expect(told).toEqual([]);
  });

  it('asking the same period twice keeps only the later answer', async () => {
    let asks = 0;
    server.use(http.get(candles, async () => {
      asks += 1;
      const ask = asks;
      await delay(ask === 1 ? 100 : 10);
      return HttpResponse.json([[1700000000 + ask, 1, 3, 2, 2.5, 1]]);
    }));
    const store = demosStore(exchange({tradeFeed: '', tradeHistory: HISTORY, tradeProduct: 'BTC-USD'}, () => undefined));

    store.dispatch(candlesAsked(Period.hour));
    store.dispatch(candlesAsked(Period.hour));
    await settled(200);

    expect(candlesOf(periodHistoryOf(Period.hour)(store.state)).map(({openedAt}) => openedAt)).toEqual([1700000002000]);
  });
});
