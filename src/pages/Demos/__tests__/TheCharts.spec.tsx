import {cleanup, screen, waitFor, within} from '@testing-library/react';
import {WebSocket as RealWebSocket, WebSocketServer} from 'ws';
import userEvent from '@testing-library/user-event';
import {server as mswServer} from '@test-support/server';
import {renderWithMemoryRouter} from '@test-support';
import {EnvProvider} from '@components/Env';
import {DemosPage} from '@pages/Demos/component';
import {Paths} from '@pages/Paths';

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

const tradeFrameWith = (p: string, id: number, at = 1700000000000): string => JSON.stringify({
  e: 'trade',
  E: 1700000000001,
  s: 'BTCUSDT',
  t: id,
  p,
  q: '0.10',
  T: at,
  m: false
});

const tradeFrame = (price: number, at = 1700000000000): string =>
  tradeFrameWith(String(price), 900000 + price, at);

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

const drawnPoints = (): string[] => {
  const region = screen.getByRole('region', {name: 'live trades'});
  return region.querySelector('polyline')?.getAttribute('points')?.split(' ') ?? [];
};

const chartsRoute = (feedUrl: string) => ({
  path: Paths.demos,
  element: <EnvProvider env={{tradeFeed: feedUrl}}><DemosPage/></EnvProvider>
});

const renderCharts = (feedUrl: string) =>
  renderWithMemoryRouter(chartsRoute(feedUrl), {path: `${Paths.demos}?tab=charts`});

describe('the demos page', () => {
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

      renderCharts(urlOf(feed));

      expect(screen.getByRole('status')).toHaveTextContent('connecting to the live feed…');
      await feedIsLive();
      broadcast(feed, [50001, 50002, 50003, 50004, 50005].map(tradeFrame));
      await waitFor(() => expect(shownPrices()).toEqual(['50003', '50004', '50005']));
    });

    test('the user reaches the charts from the tab strip', async () => {
      const feed = await streamingFeed();

      renderWithMemoryRouter(chartsRoute(urlOf(feed)), {path: Paths.demos});

      const demoTabs = await screen.findByRole('navigation', {name: 'demos'});
      await userEvent.click(within(demoTabs).getByText('Charts'));

      expect(await screen.findByRole('region', {name: 'live trades'})).toBeVisible();
    });

    test('a connected feed tells the user the stream is live', async () => {
      const feed = await streamingFeed();

      renderCharts(urlOf(feed));

      await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/^live$/));
    });

    test('frames that are not trades never reach the user', async () => {
      const feed = await streamingFeed();

      renderCharts(urlOf(feed));

      await feedIsLive();
      broadcast(feed, ['not even json', nonTradeFrame(99999), tradeFrame(50001)]);
      await waitFor(() => expect(shownPrices()).toEqual(['50001']));
    });

    test('a refused feed tells the user the stream is unavailable', async () => {
      const feed = await listeningFeed(true);
      feeds.push(feed);

      renderCharts(urlOf(feed));

      await waitFor(() =>
        expect(screen.getByRole('status')).toHaveTextContent('live feed unavailable'));
    });

    test('the user sees the price trend drawn from every recent trade', async () => {
      const feed = await streamingFeed();

      renderCharts(urlOf(feed));

      await feedIsLive();
      broadcast(feed, [50001, 50002, 50003, 50004, 50005].map(tradeFrame));
      await waitFor(() => expect(drawnPoints()).toHaveLength(5));
    });

    test('the chart tells the user its price and time range', async () => {
      const feed = await streamingFeed();
      const firstTradedAt = 1700000000000;

      renderCharts(urlOf(feed));

      await feedIsLive();
      broadcast(feed, [50001, 50002, 50003, 50004, 50005]
        .map((price, index) => tradeFrame(price, firstTradedAt + index * 10000)));
      await waitFor(() => expect(screen.getByText('high $50,005')).toBeVisible());
      expect(screen.getByText('low $50,001')).toBeVisible();
      expect(screen.getByText('5 trades · 40s')).toBeVisible();
    });

    test('a feed that dies mid-stream tells the user, keeping the last trades', async () => {
      const feed = await streamingFeed();

      renderCharts(urlOf(feed));

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

      renderCharts(urlOf(feed));

      await feedIsLive();
      broadcast(feed, [tradeFrameWith('not a number', 900042), tradeFrame(50001)]);
      await waitFor(() => expect(shownPrices()).toEqual(['50001']));
    });

    test('leaving the page closes the socket', async () => {
      const feed = await streamingFeed();
      const disconnected = new Promise(resolve =>
        feed.on('connection', socket => socket.on('close', () => resolve('closed'))));

      const {unmount} = renderCharts(urlOf(feed));

      await feedIsLive();
      unmount();
      await expect(disconnected).resolves.toBe('closed');
    });
  });
});
