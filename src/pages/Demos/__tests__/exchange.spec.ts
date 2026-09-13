import {describe, expect, it, vi} from 'vitest';
import {http, HttpResponse, ws} from 'msw';
import {WebSocketClientConnectionProtocol as Client} from '@mswjs/interceptors/WebSocket';
import {HISTORY, server} from '@test-support/server';
import {tradeFrame} from '@test-support/feed';
import {HTTPError} from '@transport/types';
import {exchange, FeedTrouble} from '../exchange';
import {demosStore, feedReleased, feedRequested, selectFeedStatus, selectLiveTrades} from '../store';

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
    const store = demosStore(exchange({tradeFeed: 'ws://exchange.test', tradeHistory: '', tradeProduct: 'BTC-USD'}, () => undefined));
    expect(selectFeedStatus(store.state)).toBe('connecting');

    store.dispatch(feedRequested());

    await vi.waitFor(() => expect(selectFeedStatus(store.state)).toBe('streaming'));
    await vi.waitFor(() => expect(selectLiveTrades(store.state)).toHaveLength(1));
  });

  it('hangs up when the feed is released', async () => {
    const hungUp: Client[] = [];
    coinbaseAnswering(hungUp);
    const store = demosStore(exchange({tradeFeed: 'ws://exchange.test', tradeHistory: '', tradeProduct: 'BTC-USD'}, () => undefined));
    store.dispatch(feedRequested());
    await vi.waitFor(() => expect(selectFeedStatus(store.state)).toBe('streaming'));

    store.dispatch(feedReleased());

    await vi.waitFor(() => expect(hungUp).toHaveLength(1));
  });

  it('says when the trade history cannot be loaded', async () => {
    server.use(http.get(`${HISTORY}/products/BTC-USD/trades`, () => HttpResponse.json([], {status: 500})));
    const troubles: FeedTrouble[] = [];
    const store = demosStore(exchange({tradeFeed: '', tradeHistory: HISTORY, tradeProduct: 'BTC-USD'}, trouble => troubles.push(trouble)));

    store.dispatch(feedRequested());

    await vi.waitFor(() => expect(troubles).toEqual([{history: HTTPError.SERVER_ERROR}]));
  });

  it('an action that is not a feed request reaches the store untouched', () => {
    const store = demosStore(exchange({tradeFeed: 'ws://exchange.test', tradeHistory: '', tradeProduct: 'BTC-USD'}, () => undefined));

    store.dispatch({type: 'feedOpened'});

    expect(selectFeedStatus(store.state)).toBe('streaming');
  });
});
