import {cleanup, render, screen, waitFor, within} from '@testing-library/react';
import {WebSocket as RealWebSocket, WebSocketServer} from 'ws';
import {server as mswServer} from '@test-support/server';
import {EnvProvider} from '@components/Env';
import {HomePage} from '@pages/Home/component';

const realSockets = () => {
  mswServer.close();
  vi.stubGlobal('WebSocket', RealWebSocket);
};

const interceptedNetwork = () => {
  vi.unstubAllGlobals();
  mswServer.listen({onUnhandledRequest: 'error'});
};

beforeAll(realSockets);
afterAll(interceptedNetwork);

const tradeFrameWith = (p: string, id: number): string => JSON.stringify({
  e: 'trade',
  E: 1700000000001,
  s: 'BTCUSDT',
  t: id,
  p,
  q: '0.10',
  T: 1700000000000,
  m: false
});

const tradeFrame = (price: number): string => tradeFrameWith(String(price), 900000 + price);

const nonTradeFrame = (price: number): string => JSON.stringify({
  e: 'aggTrade',
  E: 1700000000001,
  s: 'BTCUSDT',
  t: 900000 + price,
  p: String(price),
  q: '0.10',
  T: 1700000000000,
  m: false
});

const listeningFeed = async (refusing = false): Promise<WebSocketServer> => {
  const feed = new WebSocketServer({
    host: '127.0.0.1',
    port: 0,
    verifyClient: () => !refusing
  });
  await new Promise(resolve => feed.once('listening', resolve));
  return feed;
};

const urlOf = (feed: WebSocketServer): string => {
  const address = feed.address();
  if (typeof address === 'string' || address === null) {
    throw new Error('the feed never bound a port');
  }
  return `ws://127.0.0.1:${address.port}`;
};

const broadcast = (feed: WebSocketServer, frames: string[]): void =>
  feed.clients.forEach(socket => frames.forEach(frame => socket.send(frame)));

const feedIsLive = async (): Promise<void> => {
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/^live$/));
};

const shownPrices = (): (string | null)[] =>
  within(screen.getByRole('list')).getAllByRole('listitem').map(item => item.textContent);

const renderHome = (feedUrl: string) =>
  render(<EnvProvider env={{tradeFeed: feedUrl}}><HomePage/></EnvProvider>);

describe('the home page', () => {
  describe('live trades', () => {
    const feeds: WebSocketServer[] = [];

    const streamingFeed = async (): Promise<WebSocketServer> => {
      const feed = await listeningFeed();
      feeds.push(feed);
      return feed;
    };

    afterEach(async () => {
      cleanup();
      await Promise.all(feeds.map(feed => new Promise(resolve => feed.close(resolve))));
      feeds.length = 0;
    });

    test('the user watches the latest trades stream in, newest last', async () => {
      const feed = await streamingFeed();

      renderHome(urlOf(feed));

      expect(screen.getByRole('status')).toHaveTextContent('connecting to the live feed…');
      await feedIsLive();
      broadcast(feed, [50001, 50002, 50003, 50004, 50005].map(tradeFrame));
      await waitFor(() => expect(shownPrices()).toEqual(['50003', '50004', '50005']));
      expect(screen.getByTestId('table')).toBeVisible();
    });

    test('a connected feed tells the user the stream is live', async () => {
      const feed = await streamingFeed();

      renderHome(urlOf(feed));

      await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/^live$/));
    });

    test('frames that are not trades never reach the user', async () => {
      const feed = await streamingFeed();

      renderHome(urlOf(feed));

      await feedIsLive();
      broadcast(feed, ['not even json', nonTradeFrame(99999), tradeFrame(50001)]);
      await waitFor(() => expect(shownPrices()).toEqual(['50001']));
    });

    test('a refused feed tells the user the stream is unavailable', async () => {
      const feed = await listeningFeed(true);
      feeds.push(feed);

      renderHome(urlOf(feed));

      await waitFor(() =>
        expect(screen.getByRole('status')).toHaveTextContent('live feed unavailable'));
    });

    test('a feed that dies mid-stream tells the user, keeping the last trades', async () => {
      const feed = await streamingFeed();

      renderHome(urlOf(feed));

      await feedIsLive();
      broadcast(feed, [tradeFrame(50001)]);
      await waitFor(() => expect(shownPrices()).toEqual(['50001']));
      feed.clients.forEach(socket => socket.close());
      await waitFor(() =>
        expect(screen.getByRole('status')).toHaveTextContent('live feed unavailable'));
      expect(shownPrices()).toEqual(['50001']);
    });

    test('a trade whose price is not a number never reaches the user', async () => {
      const feed = await streamingFeed();

      renderHome(urlOf(feed));

      await feedIsLive();
      broadcast(feed, [tradeFrameWith('not a number', 900042), tradeFrame(50001)]);
      await waitFor(() => expect(shownPrices()).toEqual(['50001']));
    });

    test('leaving the page closes the socket', async () => {
      const feed = await streamingFeed();
      const disconnected = new Promise(resolve =>
        feed.on('connection', socket => socket.on('close', () => resolve('closed'))));

      const {unmount} = renderHome(urlOf(feed));

      await feedIsLive();
      unmount();
      await expect(disconnected).resolves.toBe('closed');
    });
  });
});
