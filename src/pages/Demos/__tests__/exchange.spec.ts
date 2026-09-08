import {describe, expect, it, vi} from 'vitest';
import {ws} from 'msw';
import {WebSocketClientConnectionProtocol as Client} from '@mswjs/interceptors/WebSocket';
import {server} from '@test-support/server';
import {tradeFrame} from '@test-support/feed';
import {exchange} from '../exchange';
import {demosStore, feedReleased, feedRequested, selectFeedStatus, selectLiveTrades} from '../store';

describe('the exchange as middleware', () => {
  const coinbase = ws.link('ws://exchange.test');

  it('opens the feed when the feed is requested, dispatches what arrives, and hangs up when the feed is released', async () => {
    const hungUp: Client[] = [];
    server.use(coinbase.addEventListener('connection', ({client}) => {
      client.addEventListener('message', event => {
        if (typeof event.data === 'string' && event.data.includes('subscribe')) {
          client.send(tradeFrame(100));
        }
      });
      client.addEventListener('close', () => hungUp.push(client));
    }));
    const store = demosStore(exchange({tradeFeed: 'ws://exchange.test', tradeHistory: '', tradeProduct: 'BTC-USD'}, () => undefined));
    expect(selectFeedStatus(store.state)).toBe('connecting');

    store.dispatch(feedRequested());
    await vi.waitFor(() => expect(selectFeedStatus(store.state)).toBe('streaming'));
    await vi.waitFor(() => expect(selectLiveTrades(store.state)).toHaveLength(1));

    store.dispatch(feedReleased());
    await vi.waitFor(() => expect(hungUp).toHaveLength(1));
  });

  it('lets every other action through untouched, and asks nothing of the network', () => {
    const store = demosStore(exchange({tradeFeed: 'ws://exchange.test', tradeHistory: '', tradeProduct: 'BTC-USD'}, () => undefined));

    store.dispatch({type: 'feedOpened'});

    expect(selectFeedStatus(store.state)).toBe('streaming');
  });
});
