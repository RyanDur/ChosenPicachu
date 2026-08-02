import {cleanup, screen, waitFor, within} from '@testing-library/react';
import {WebSocket as RealWebSocket, WebSocketServer} from 'ws';
import userEvent from '@testing-library/user-event';
import {server as mswServer} from '@test-support/server';
import {renderWithMemoryRouter} from '@test-support';
import {EnvProvider} from '@components/Env';
import {DemosPage} from '@pages/Demos/component';
import {Paths} from '@pages/Paths';
import {format} from 'date-fns';

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

type FrameParts = {
  price: string;
  id: number;
  at?: number;
  size?: string;
  side?: string;
};

const tradeFrameWith = ({price, id, at = 1700000000000, size = '0.01', side = 'buy'}: FrameParts): string => JSON.stringify({
  type: 'match',
  trade_id: id,
  maker_order_id: 'maker',
  taker_order_id: 'taker',
  side,
  size,
  price,
  product_id: 'BTC-USD',
  sequence: id,
  time: new Date(at).toISOString()
});

const tradeFrame = (price: number, at = 1700000000000, size = '0.01', side = 'buy'): string =>
  tradeFrameWith({price: String(price), id: 900000 + price, at, size, side});

const nonTradeFrame = (price: number): string => JSON.stringify({
  type: 'ticker',
  trade_id: 900000 + price,
  price: String(price),
  product_id: 'BTC-USD',
  time: new Date(1700000000000).toISOString()
});

const subscribed = new Set<import('ws').WebSocket>();

const subscribesMatches = (raw: unknown): boolean => {
  const frame: unknown = JSON.parse(String(raw));
  return typeof frame === 'object' && frame !== null &&
    Reflect.get(frame, 'type') === 'subscribe' &&
    JSON.stringify(Reflect.get(frame, 'channels')).includes('matches') &&
    JSON.stringify(Reflect.get(frame, 'channels')).includes('BTC-USD');
};

const listeningFeed = async (refusing = false): Promise<WebSocketServer> => {
  const feed = new WebSocketServer({
    host: '127.0.0.1',
    port: 0,
    verifyClient: () => !refusing
  });
  feed.on('connection', socket => {
    socket.on('message', raw => {
      if (subscribesMatches(raw)) {
        subscribed.add(socket);
      }
    });
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
  feed.clients.forEach(socket => {
    if (subscribed.has(socket)) {
      frames.forEach(frame => socket.send(frame));
    }
  });

const feedIsLive = async (): Promise<void> => {
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/^live$/));
  await waitFor(() => expect(subscribed.size).toBeGreaterThan(0));
};



const priceCard = (): HTMLElement => screen.getByRole('region', {name: 'live trades'});

const drawnCandleParts = (selector: string): number => {
  const region = screen.getByRole('region', {name: 'candles'});
  return region.querySelectorAll(selector).length;
};

const drawnPoints = (): string[] => {
  const region = screen.getByRole('region', {name: 'live trades'});
  return region.querySelector('polyline')?.getAttribute('points')?.split(' ') ?? [];
};

const chartsRoute = (feedUrl: string) => ({
  path: Paths.demos,
  element: <EnvProvider env={{tradeFeed: feedUrl, tradeHistory: 'http://127.0.0.1:9'}}><DemosPage/></EnvProvider>
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
      subscribed.clear();
      await Promise.all(feeds.map(feed => new Promise(resolve => feed.close(resolve))));
      feeds.length = 0;
    });

    test('the user watches the latest trades stream in, newest last', async () => {
      const feed = await streamingFeed();

      renderCharts(urlOf(feed));

      expect(screen.getByRole('status')).toHaveTextContent('connecting to the live feed…');
      await feedIsLive();
      broadcast(feed, [50001, 50002, 50003, 50004, 50005].map(price => tradeFrame(price)));
      expect(await within(priceCard()).findByText('$50,005.00')).toBeVisible();
      expect(within(priceCard()).getByText('+$4.00')).toBeVisible();
    });

    test('the user reaches the charts from the tab strip', async () => {
      const feed = await streamingFeed();

      renderWithMemoryRouter(chartsRoute(urlOf(feed)), {path: Paths.demos});

      const demoTabs = await screen.findByRole('navigation', {name: 'demos'});
      await userEvent.click(within(demoTabs).getByText('Charts'));

      expect(await screen.findByRole('region', {name: 'live trades'})).toBeVisible();
    });

    test('trades gathered before the user opens the charts are already waiting', async () => {
      const feed = await streamingFeed();

      renderWithMemoryRouter(chartsRoute(urlOf(feed)), {path: Paths.demos});

      await waitFor(() => expect(subscribed.size).toBeGreaterThan(0));
      broadcast(feed, [tradeFrame(50001)]);
      const demoTabs = await screen.findByRole('navigation', {name: 'demos'});
      await userEvent.click(within(demoTabs).getByText('Charts'));
      expect(await within(priceCard()).findByText('$50,001.00')).toBeVisible();
    });

    test('leaving the charts tab and returning keeps the stream alive', async () => {
      const feed = await streamingFeed();
      let connections = 0;
      feed.on('connection', () => {
        connections += 1;
      });

      renderCharts(urlOf(feed));

      await feedIsLive();
      broadcast(feed, [tradeFrame(50001)]);
      expect(await within(priceCard()).findByText('$50,001.00')).toBeVisible();
      const demoTabs = await screen.findByRole('navigation', {name: 'demos'});
      await userEvent.click(within(demoTabs).getByText('Accordions'));
      await userEvent.click(within(demoTabs).getByText('Charts'));
      expect(await within(priceCard()).findByText('$50,001.00')).toBeVisible();
      expect(connections).toBe(1);
    });

    test('a connected feed tells the user the stream is live beside the title', async () => {
      const feed = await streamingFeed();

      renderCharts(urlOf(feed));

      await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/^live$/));
    });

    test('frames that are not trades never reach the user', async () => {
      const feed = await streamingFeed();

      renderCharts(urlOf(feed));

      await feedIsLive();
      broadcast(feed, ['not even json', nonTradeFrame(99999), tradeFrame(50001)]);
      expect(await within(priceCard()).findByText('$50,001.00')).toBeVisible();
      expect(within(priceCard()).getByText('+$0.00')).toBeVisible();
    });

    test('a refused feed tells the user the stream is unavailable', async () => {
      const feed = await listeningFeed(true);
      feeds.push(feed);

      renderCharts(urlOf(feed));

      await waitFor(() =>
        expect(screen.getByRole('status')).toHaveTextContent('live feed unavailable'));
    });

    test('the user sees the price trend drawn from every recent minute', async () => {
      const feed = await streamingFeed();

      renderCharts(urlOf(feed));

      await feedIsLive();
      broadcast(feed, [50001, 50002, 50003, 50004, 50005]
        .map((price, minute) => tradeFrame(price, 1700000000000 + minute * 60000)));
      await waitFor(() => expect(drawnPoints()).toHaveLength(5));
    });

    test('the table aggregates the stream as it flows', async () => {
      const feed = await streamingFeed();

      renderCharts(urlOf(feed));

      await feedIsLive();
      broadcast(feed, [
        tradeFrame(50001, 1700000000000, '0.01', 'buy'),
        tradeFrame(50002, 1700000060000, '0.25', 'sell'),
        tradeFrame(50003, 1700000120000, '0.10', 'buy')
      ]);
      const statsCard = screen.getByRole('region', {name: 'live aggregations'});
      const rowFor = async (measure: string): Promise<HTMLElement> => {
        const cell = await within(statsCard).findByText(measure);
        const row = cell.closest('tr');
        if (row === null) throw new Error(`no row for ${measure}`);
        return row;
      };
      expect(await within(await rowFor('trades')).findByText('3')).toBeVisible();
      expect(within(await rowFor('buys')).getByText('2')).toBeVisible();
      expect(within(await rowFor('sells')).getByText('1')).toBeVisible();
      expect(within(await rowFor('volume')).getByText('0.36')).toBeVisible();
      expect(within(await rowFor('vwap')).getByText('$50,002.25')).toBeVisible();
      expect(within(await rowFor('change')).getByText('+$2.00')).toBeVisible();
    });

    test('the charts name what they measure', async () => {
      const feed = await streamingFeed();

      renderCharts(urlOf(feed));

      expect(await screen.findByRole('heading', {name: /BTC-USD/})).toBeVisible();
    });

    test('the charts explain what they show', async () => {
      const feed = await streamingFeed();

      renderCharts(urlOf(feed));

      const explainers = await screen.findAllByText('what am I looking at?');
      expect(explainers).toHaveLength(3);
      await userEvent.click(explainers[0]);
      expect(screen.getByText(/price of one bitcoin in US dollars/)).toBeVisible();
      await userEvent.click(explainers[1]);
      expect(screen.getByText(/how much bitcoin changed hands/)).toBeVisible();
      await userEvent.click(explainers[2]);
      expect(screen.getByText(/stream folded into running totals/)).toBeVisible();
    });

    test('the user reads the window as candles with their traded volume', async () => {
      const feed = await streamingFeed();
      const bucketStart = 1700000000000;

      renderCharts(urlOf(feed));

      await feedIsLive();
      broadcast(feed, [
        tradeFrame(50001, bucketStart, '0.01'),
        tradeFrame(50003, bucketStart + 1000, '0.02'),
        tradeFrame(50002, bucketStart + 2000, '0.01'),
        tradeFrame(50004, bucketStart + 60000, '0.03'),
        tradeFrame(50000, bucketStart + 61000, '0.01')
      ]);
      await waitFor(() => expect(drawnCandleParts('rect.body')).toBe(2));
      expect(drawnCandleParts('rect.volume')).toBe(2);
    });

    test('the chart tells the user its price and time range', async () => {
      const feed = await streamingFeed();
      const tenMinutes = 600000;
      const firstTradedAt = Math.ceil(1700000000000 / tenMinutes) * tenMinutes;

      renderCharts(urlOf(feed));

      await feedIsLive();
      broadcast(feed, [50001, 50002, 50003, 50004, 50005]
        .map((price, index) => tradeFrame(price, firstTradedAt + index * tenMinutes)));
      const priceCard = screen.getByRole('region', {name: 'live trades'});
      expect(await within(priceCard).findByText('$50,005')).toBeVisible();
      expect(within(priceCard).getByText('$50,003')).toBeVisible();
      expect(within(priceCard).getByText('$50,001')).toBeVisible();
      expect(within(priceCard).getByText('5 candles · 1m each')).toBeVisible();
      const ticks = within(priceCard).getAllByRole('time');
      expect(ticks.map(tick => tick.textContent))
        .toEqual([0, 1, 2, 3, 4].map(step => format(firstTradedAt + step * tenMinutes, 'HH:mm')));
    });

    test('a feed that dies mid-stream tells the user, keeping the last trades', async () => {
      const feed = await streamingFeed();

      renderCharts(urlOf(feed));

      await feedIsLive();
      broadcast(feed, [tradeFrame(50001)]);
      expect(await within(priceCard()).findByText('$50,001.00')).toBeVisible();
      feed.clients.forEach(socket => socket.close());
      await waitFor(() =>
        expect(screen.getByRole('status')).toHaveTextContent('live feed unavailable'));
      expect(within(priceCard()).getByText('$50,001.00')).toBeVisible();
    });

    test('a trade whose price is not a number never reaches the user', async () => {
      const feed = await streamingFeed();

      renderCharts(urlOf(feed));

      await feedIsLive();
      broadcast(feed, [tradeFrameWith({price: 'not a number', id: 900042}), tradeFrame(50001)]);
      expect(await within(priceCard()).findByText('$50,001.00')).toBeVisible();
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
