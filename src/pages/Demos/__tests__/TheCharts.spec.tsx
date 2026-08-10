import {cleanup, createEvent, fireEvent, screen, waitFor, within} from '@testing-library/react';
import {
  broadcast,
  interceptedNetwork,
  listeningFeed,
  nonTradeFrame,
  realSockets,
  subscribed,
  tradeFrame,
  tradeFrameWith,
  urlOf
} from '@test-support/feed';
import {WebSocketServer} from 'ws';
import userEvent from '@testing-library/user-event';
import {renderWithMemoryRouter} from '@test-support';
import {EnvProvider} from '@components/Env';
import {DemosPage} from '@pages/Demos/component';
import {Paths} from '@pages/Paths';
import {ChartPage} from '@pages/Demos/Charts/ChartPage';
import {format} from 'date-fns';

beforeAll(realSockets);
afterAll(interceptedNetwork);

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

const renderCharts = (feedUrl: string, search = '?tab=charts') =>
  renderWithMemoryRouter({children: [
    chartsRoute(feedUrl),
    {path: `${Paths.demos}charts/:kind/`,
      element: <EnvProvider env={{tradeFeed: feedUrl, tradeHistory: 'http://127.0.0.1:9'}}><ChartPage/></EnvProvider>}
  ]}, {path: `${Paths.demos}${search}`});

describe('a list of charts', () => {
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

  test('the trader starts with one chart', async () => {
    const feed = await streamingFeed();

    renderCharts(urlOf(feed));

    expect(await screen.findByRole('region', {name: 'live trades'})).toBeVisible();
    expect(screen.queryByRole('region', {name: 'candles'})).toBeNull();
  });

  test('the trader can add a chart', async () => {
    const feed = await streamingFeed();

    renderCharts(urlOf(feed));
    await screen.findByRole('region', {name: 'live trades'});

    const toggle = screen.getByRole('button', {name: 'Add a chart'});
    const menu = document.getElementById(toggle.getAttribute('popovertarget') ?? '');
    if (menu === null) throw new Error('no add-a-chart menu');
    await userEvent.click(within(menu).getByText('Candles'));

    const candles = await screen.findByRole('region', {name: 'candles'});
    const price = screen.getByRole('region', {name: 'live trades'});
    expect(candles.compareDocumentPosition(price)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  test('the trader can remove a chart', async () => {
    const feed = await streamingFeed();

    renderCharts(urlOf(feed), '?tab=charts&charts=price,candles');
    await screen.findByRole('region', {name: 'live trades'});

    await userEvent.click(screen.getAllByRole('button', {name: 'remove chart'})[0]);

    expect(screen.queryByRole('region', {name: 'live trades'})).toBeNull();
    expect(await screen.findByRole('region', {name: 'candles'})).toBeVisible();
  });

  test('the last chart cannot be removed', async () => {
    const feed = await streamingFeed();

    renderCharts(urlOf(feed));
    await screen.findByRole('region', {name: 'live trades'});

    expect(screen.queryByRole('button', {name: 'remove chart'})).toBeNull();
    expect(screen.queryByRole('button', {name: 'move chart', hidden: true})).toBeNull();
  });

  test('the trader can sort the charts by keyboard', async () => {
    const feed = await streamingFeed();

    renderCharts(urlOf(feed), '?tab=charts&charts=price,candles');
    await screen.findByRole('region', {name: 'live trades'});

    fireEvent.keyDown(screen.getByRole('article', {name: 'chart 1'}), {key: 'ArrowDown'});

    const candles = screen.getByRole('region', {name: 'candles'});
    expect(candles.compareDocumentPosition(screen.getByRole('region', {name: 'live trades'})))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(screen.getByRole('article', {name: 'chart 2'})).toHaveFocus();
  });

  test('the delete key removes a chart, never the last', async () => {
    const feed = await streamingFeed();

    renderCharts(urlOf(feed), '?tab=charts&charts=price,candles');
    await screen.findByRole('region', {name: 'live trades'});

    fireEvent.keyDown(screen.getByRole('article', {name: 'chart 1'}), {key: 'Delete'});
    expect(screen.queryByRole('region', {name: 'live trades'})).toBeNull();

    fireEvent.keyDown(screen.getByRole('article', {name: 'chart 1'}), {key: 'Delete'});
    expect(screen.getByRole('region', {name: 'candles'})).toBeVisible();
  });

  test('the trader can drag a chart to a new seat', async () => {
    const feed = await streamingFeed();

    renderCharts(urlOf(feed), '?tab=charts&charts=price,candles');
    await screen.findByRole('region', {name: 'live trades'});
    const slot = (name: string) => screen.getByRole('article', {name});

    fireEvent.mouseDown(within(slot('chart 1')).getByRole('button', {name: 'move chart', hidden: true}));
    const start = createEvent.dragStart(slot('chart 1'));
    Object.defineProperty(start, 'clientY', {value: 0});
    Object.defineProperty(start, 'dataTransfer', {value: {effectAllowed: '', dropEffect: ''}});
    fireEvent(slot('chart 1'), start);
    const over = createEvent.dragOver(slot('chart 2'));
    Object.defineProperty(over, 'clientY', {value: 100});
    Object.defineProperty(over, 'dataTransfer', {value: {dropEffect: ''}});
    fireEvent(slot('chart 2'), over);

    expect(within(slot('chart 1')).getByRole('region', {name: 'candles'})).toBeVisible();
    expect(slot('chart 1').classList).toContain('chart-pushed');

    fireEvent.drop(slot('chart 2'));
    fireEvent.dragEnd(slot('chart 2'));

    expect(within(slot('chart 1')).getByRole('region', {name: 'candles'})).toBeVisible();
    expect(within(slot('chart 2')).getByRole('region', {name: 'live trades'})).toBeVisible();
  });

  test('the workspace tells its story and each chart is a doorway', async () => {
    const feed = await streamingFeed();

    renderCharts(urlOf(feed), '?tab=charts&graph=workspace');
    await screen.findByRole('region', {name: 'live trades'});

    expect(screen.getByRole('heading', {name: 'let’s build this feature'})).toBeVisible();
    expect(screen.getByText(/the shape of the session/)).toBeVisible();
    const recipe = screen.getByRole('region', {name: 'build the charts yourself'});
    expect(recipe.querySelectorAll('.story')).toHaveLength(1);
    expect(recipe.querySelectorAll('details.arc[open]')).toHaveLength(1);
    expect(recipe).toHaveTextContent(/strays a third of the seat’s height/);
    expect(recipe).toHaveTextContent(/export const strayed/);
    expect(recipe.querySelectorAll('.snippet.foil')).toHaveLength(1);

    await userEvent.click(screen.getByRole('region', {name: 'live trades'}));
    expect(await screen.findByRole('region', {name: 'build the price line yourself'})).toBeVisible();
  });

  test('enter on a chart opens its tutorial', async () => {
    const feed = await streamingFeed();

    renderCharts(urlOf(feed), '?tab=charts&charts=candles');
    await screen.findByRole('region', {name: 'candles'});

    fireEvent.keyDown(screen.getByRole('article', {name: 'chart 1'}), {key: 'Enter'});

    expect(await screen.findByRole('region', {name: 'build the candles yourself'})).toBeVisible();
    expect(screen.getByRole('region', {name: 'candles'})).toBeVisible();
    expect(screen.getByText(/read the same trades as candles/)).toBeVisible();
  });

  test('the candles story shows the markup and the dress, not just the arithmetic', async () => {
    const feed = await streamingFeed();

    renderCharts(urlOf(feed), '?tab=charts&charts=candles');
    await screen.findByRole('region', {name: 'candles'});
    fireEvent.keyDown(screen.getByRole('article', {name: 'chart 1'}), {key: 'Enter'});

    const recipe = await screen.findByRole('region', {name: 'build the candles yourself'});
    expect(recipe).toHaveTextContent('className="candlesticks"');
    expect(recipe).toHaveTextContent('.up .body');
    expect(recipe).toHaveTextContent('className="volumes"');
    expect(recipe).toHaveTextContent('.volume');
  });

  test('the trader can add the pressure chart and walk through its doorway', async () => {
    const feed = await streamingFeed();

    renderCharts(urlOf(feed));
    await screen.findByRole('region', {name: 'live trades'});

    const toggle = screen.getByRole('button', {name: 'Add a chart'});
    const menu = document.getElementById(toggle.getAttribute('popovertarget') ?? '');
    if (menu === null) throw new Error('no add-a-chart menu');
    await userEvent.click(within(menu).getByText('Pressure'));
    const pressure = await screen.findByRole('region', {name: 'pressure'});
    expect(pressure).toBeVisible();

    fireEvent.keyDown(screen.getByRole('article', {name: 'chart 1'}), {key: 'Enter'});
    expect(await screen.findByRole('region', {name: 'build the pressure yourself'})).toBeVisible();
    expect(screen.getByText(/who is driving/)).toBeVisible();
  });

  test('a chart’s tutorial opens like a feature', async () => {
    const feed = await streamingFeed();

    renderWithMemoryRouter({children: [
      chartsRoute(urlOf(feed)),
      {path: `${Paths.demos}charts/:kind/`,
        element: <EnvProvider env={{tradeFeed: urlOf(feed), tradeHistory: 'http://127.0.0.1:9'}}><ChartPage/></EnvProvider>}
    ]}, {path: `${Paths.demos}charts/price/`});
    await screen.findByRole('region', {name: 'live trades'});

    expect(screen.getByRole('heading', {name: 'let’s build this feature'})).toBeVisible();
    expect(screen.getByText(/without reading a single digit/)).toBeVisible();
    expect(screen.getByText('a trader')).toBeVisible();
    expect(screen.getByText(/build the story yourself first/)).toBeVisible();
    const recipe = screen.getByRole('region', {name: 'build the price line yourself'});
    expect(recipe.querySelectorAll('.story')).toHaveLength(1);
  });

  test('the charts travel in the url', async () => {
    const feed = await streamingFeed();

    renderCharts(urlOf(feed), '?tab=charts&charts=candles,price,price');

    expect(await screen.findByRole('region', {name: 'candles'})).toBeVisible();
    expect(screen.getAllByRole('region', {name: 'live trades'})).toHaveLength(2);
  });
});

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

    test('the accordion labels survive a visit to the streaming charts', async () => {
      const feed = await streamingFeed();

      renderWithMemoryRouter(chartsRoute(urlOf(feed)), {path: Paths.demos});

      const foldLabels = () => screen.getAllByRole<HTMLInputElement>('checkbox')
        .map(toggle => toggle.labels?.[0]?.textContent);
      const before = foldLabels();
      const demoTabs = await screen.findByRole('navigation', {name: 'demos'});
      await userEvent.click(within(demoTabs).getByText('Charts'));
      await feedIsLive();
      broadcast(feed, [tradeFrame(50001)]);
      expect(await within(priceCard()).findByText('$50,001.00')).toBeVisible();
      await userEvent.click(within(demoTabs).getByText('Accordions'));
      expect(foldLabels()).toEqual(before);
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

    test('the charts name what they measure', async () => {
      const feed = await streamingFeed();

      renderCharts(urlOf(feed));

      expect(await screen.findByRole('heading', {name: /BTC-USD/})).toBeVisible();
    });

    test('the charts explain what they show', async () => {
      const feed = await streamingFeed();

      renderCharts(urlOf(feed), '?tab=charts&charts=price,candles');

      const explainers = await screen.findAllByText('what am I looking at?');
      expect(explainers).toHaveLength(2);
      await userEvent.click(explainers[0]);
      expect(screen.getByText(/price of one bitcoin in US dollars/)).toBeVisible();
      await userEvent.click(explainers[1]);
      expect(screen.getByText(/how much bitcoin changed hands/)).toBeVisible();
    });

    test('the user reads the window as candles with their traded volume', async () => {
      const feed = await streamingFeed();
      const bucketStart = 1700000000000;

      renderCharts(urlOf(feed), '?tab=charts&charts=candles');

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
