import {cleanup, screen, waitFor, within} from '@testing-library/react';
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
import {addChart, addMenu, dragChart, keys, releaseDrag, renderChartPage, renderWorkspace, slot} from './workspace';
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

    renderWorkspace(urlOf(feed));

    expect(await screen.findByRole('region', {name: 'live trades'})).toBeVisible();
    expect(screen.queryByRole('region', {name: 'candles'})).not.toBeInTheDocument();
  });

  test('the trader can add a chart', async () => {
    const feed = await streamingFeed();

    renderWorkspace(urlOf(feed));
    await screen.findByRole('region', {name: 'live trades'});

    await addChart('Candles');

    const candles = await screen.findByRole('region', {name: 'candles'});
    const price = screen.getByRole('region', {name: 'live trades'});
    expect(candles.compareDocumentPosition(price)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  test('the trader can remove a chart', async () => {
    const feed = await streamingFeed();

    renderWorkspace(urlOf(feed), '?tab=charts&charts=price,candles');
    await screen.findByRole('region', {name: 'live trades'});

    await userEvent.click(screen.getAllByRole('button', {name: 'remove chart'})[0]);

    expect(screen.queryByRole('region', {name: 'live trades'})).not.toBeInTheDocument();
    expect(await screen.findByRole('region', {name: 'candles'})).toBeVisible();
  });

  test('the last chart cannot be removed', async () => {
    const feed = await streamingFeed();

    renderWorkspace(urlOf(feed));
    await screen.findByRole('region', {name: 'live trades'});

    expect(screen.queryByRole('button', {name: 'remove chart'})).not.toBeInTheDocument();
    expect(screen.queryByRole('button', {name: 'move chart', hidden: true})).not.toBeInTheDocument();
  });

  test('the trader can sort the charts by keyboard', async () => {
    const feed = await streamingFeed();

    renderWorkspace(urlOf(feed), '?tab=charts&charts=price,candles');
    await screen.findByRole('region', {name: 'live trades'});

    keys('chart 1', 'ArrowDown');

    const candles = screen.getByRole('region', {name: 'candles'});
    expect(candles.compareDocumentPosition(screen.getByRole('region', {name: 'live trades'})))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(screen.getByRole('listitem', {name: 'chart 2'})).toHaveFocus();
  });

  test('the delete key removes a chart, never the last', async () => {
    const feed = await streamingFeed();

    renderWorkspace(urlOf(feed), '?tab=charts&charts=price,candles');
    await screen.findByRole('region', {name: 'live trades'});

    keys('chart 1', 'Delete');
    expect(screen.queryByRole('region', {name: 'live trades'})).not.toBeInTheDocument();

    keys('chart 1', 'Delete');
    expect(screen.getByRole('region', {name: 'candles'})).toBeVisible();
  });

  test('the trader can drag a chart to a new seat', async () => {
    const feed = await streamingFeed();

    renderWorkspace(urlOf(feed), '?tab=charts&charts=price,candles');
    await screen.findByRole('region', {name: 'live trades'});
    dragChart('chart 1', 'chart 2', 100);

    expect(within(slot('chart 1')).getByRole('region', {name: 'candles'})).toBeVisible();
    expect(slot('chart 1').classList).toContain('chart-pushed');

    releaseDrag('chart 2');

    expect(within(slot('chart 1')).getByRole('region', {name: 'candles'})).toBeVisible();
    expect(within(slot('chart 2')).getByRole('region', {name: 'live trades'})).toBeVisible();
  });

  test('the workspace tells its story and each chart is a doorway', async () => {
    const feed = await streamingFeed();

    renderWorkspace(urlOf(feed), '?tab=charts&graph=workspace');
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

    renderWorkspace(urlOf(feed), '?tab=charts&charts=candles');
    await screen.findByRole('region', {name: 'candles'});

    keys('chart 1', 'Enter');

    expect(await screen.findByRole('region', {name: 'build the candles yourself'})).toBeVisible();
    expect(screen.getByRole('region', {name: 'candles'})).toBeVisible();
    expect(screen.getByText(/read the same trades as candles/)).toBeVisible();
  });

  test('the candles story shows the markup and the dress, not just the arithmetic', async () => {
    const feed = await streamingFeed();

    renderWorkspace(urlOf(feed), '?tab=charts&charts=candles');
    await screen.findByRole('region', {name: 'candles'});
    keys('chart 1', 'Enter');

    const recipe = await screen.findByRole('region', {name: 'build the candles yourself'});
    expect(recipe).toHaveTextContent('className="candlesticks"');
    expect(recipe).toHaveTextContent('.up .body');
    expect(recipe).toHaveTextContent('className="volumes"');
    expect(recipe).toHaveTextContent('.volume');
  });

  test('the trader can add the pressure chart and walk through its doorway', async () => {
    const feed = await streamingFeed();

    renderWorkspace(urlOf(feed));
    await screen.findByRole('region', {name: 'live trades'});

    await addChart('Pressure');
    const pressure = await screen.findByRole('region', {name: 'pressure'});
    expect(pressure).toBeVisible();

    keys('chart 1', 'Enter');
    expect(await screen.findByRole('region', {name: 'build the pressure yourself'})).toBeVisible();
    expect(screen.getByText(/who is driving/)).toBeVisible();
  });

  test('a chart’s tutorial opens like a feature', async () => {
    const feed = await streamingFeed();

    renderChartPage(urlOf(feed), 'price');
    await screen.findByRole('region', {name: 'live trades'});

    const page = screen.getByRole('article', {name: 'price line tutorial'});
    expect(within(page).getByRole('heading', {name: 'let’s build this feature'})).toBeVisible();
    expect(screen.getByText(/without reading a single digit/)).toBeVisible();
    expect(screen.getByText('a trader')).toBeVisible();
    expect(screen.getByText(/build the story yourself first/)).toBeVisible();
    const recipe = screen.getByRole('region', {name: 'build the price line yourself'});
    expect(recipe.querySelectorAll('.story')).toHaveLength(1);
  });

  test('the price story teaches the whole journey, data to drawn chart', async () => {
    const feed = await streamingFeed();

    renderChartPage(urlOf(feed), 'price');
    await screen.findByRole('region', {name: 'live trades'});

    const recipe = screen.getByRole('region', {name: 'build the price line yourself'});
    expect(recipe).toHaveTextContent('export const subscribeTo');
    expect(recipe).toHaveTextContent('export const decodeTrade');
    expect(recipe).toHaveTextContent('.mBind(toTrade);');
    expect(recipe).toHaveTextContent('.map(toCandles);');
    expect(recipe).toHaveTextContent('export const periodCandles');
    expect(recipe).toHaveTextContent('export const mergeLive');
    expect(recipe).toHaveTextContent('export const sparklinePoints');
    expect(recipe).toHaveTextContent('export const Axes');
  });

  test('the candles story stands on its own feet', async () => {
    const feed = await streamingFeed();

    renderWorkspace(urlOf(feed), '?tab=charts&charts=candles');
    await screen.findByRole('region', {name: 'candles'});
    keys('chart 1', 'Enter');

    const recipe = await screen.findByRole('region', {name: 'build the candles yourself'});
    expect(recipe).toHaveTextContent('export const bucketTrades');
    expect(recipe).toHaveTextContent('export const mergeLive');
    expect(recipe).toHaveTextContent('<Axes');
    expect(recipe.querySelectorAll('.snippet.foil').length).toBeGreaterThan(0);
  });

  test('the pressure story proves the side is a fact, not a guess', async () => {
    const feed = await streamingFeed();

    renderWorkspace(urlOf(feed), '?tab=charts&charts=pressure');
    await screen.findByRole('region', {name: 'pressure'});
    keys('chart 1', 'Enter');

    const recipe = await screen.findByRole('region', {name: 'build the pressure yourself'});
    expect(recipe).toHaveTextContent("side: D.literalUnion('buy', 'sell')");
  });

  test('the charts travel in the url, one of each kind', async () => {
    const feed = await streamingFeed();

    renderWorkspace(urlOf(feed), '?tab=charts&charts=candles,price,price');

    expect(await screen.findByRole('region', {name: 'candles'})).toBeVisible();
    expect(screen.getAllByRole('region', {name: 'live trades'})).toHaveLength(1);
  });

  test('the add menu offers only what the desk lacks, and a full desk offers nothing', async () => {
    const feed = await streamingFeed();

    renderWorkspace(urlOf(feed), '?tab=charts&charts=price,candles');
    await screen.findByRole('region', {name: 'live trades'});

    const menu = addMenu();
    if (menu === null) throw new Error('no add-a-chart menu on the desk');
    expect(within(menu).queryByRole('button', {name: 'Price line', hidden: true})).not.toBeInTheDocument();
    expect(within(menu).queryByRole('button', {name: 'Candles', hidden: true})).not.toBeInTheDocument();

    await addChart('Pressure');
    await screen.findByRole('region', {name: 'pressure'});
    expect(addMenu()).toBeNull();
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

      renderWorkspace(urlOf(feed));

      expect(screen.getByRole('status')).toHaveTextContent('connecting to the live feed…');
      await feedIsLive();
      broadcast(feed, [50001, 50002, 50003, 50004, 50005].map(price => tradeFrame(price)));
      expect(await within(priceCard()).findByText('$50,005.00')).toBeVisible();
      expect(within(priceCard()).getByText('+$4.00')).toBeVisible();
    });

    test('the accordion labels survive a visit to the streaming charts', async () => {
      const feed = await streamingFeed();

      renderWorkspace(urlOf(feed), '');

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

      renderWorkspace(urlOf(feed), '');

      const demoTabs = await screen.findByRole('navigation', {name: 'demos'});
      await userEvent.click(within(demoTabs).getByText('Charts'));

      expect(await screen.findByRole('region', {name: 'live trades'})).toBeVisible();
    });

    test('trades gathered before the user opens the charts are already waiting', async () => {
      const feed = await streamingFeed();

      renderWorkspace(urlOf(feed), '');

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

      renderWorkspace(urlOf(feed));

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

      renderWorkspace(urlOf(feed));

      await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/^live$/));
    });

    test('frames that are not trades never reach the user', async () => {
      const feed = await streamingFeed();

      renderWorkspace(urlOf(feed));

      await feedIsLive();
      broadcast(feed, ['not even json', nonTradeFrame(99999), tradeFrame(50001)]);
      expect(await within(priceCard()).findByText('$50,001.00')).toBeVisible();
      expect(within(priceCard()).getByText('+$0.00')).toBeVisible();
    });

    test('a refused feed tells the user the stream is unavailable', async () => {
      const feed = await listeningFeed(true);
      feeds.push(feed);

      renderWorkspace(urlOf(feed));

      await waitFor(() =>
        expect(screen.getByRole('status')).toHaveTextContent('live feed unavailable'));
    });

    test('the user sees the price trend drawn from every recent minute', async () => {
      const feed = await streamingFeed();

      renderWorkspace(urlOf(feed));

      await feedIsLive();
      broadcast(feed, [50001, 50002, 50003, 50004, 50005]
        .map((price, minute) => tradeFrame(price, 1700000000000 + minute * 60000)));
      await waitFor(() => expect(drawnPoints()).toHaveLength(5));
    });

    test('the charts name what they measure', async () => {
      const feed = await streamingFeed();

      renderWorkspace(urlOf(feed));

      expect(await screen.findByRole('heading', {name: /BTC-USD/})).toBeVisible();
    });

    test('the charts explain what they show', async () => {
      const feed = await streamingFeed();

      renderWorkspace(urlOf(feed), '?tab=charts&charts=price,candles');

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

      renderWorkspace(urlOf(feed), '?tab=charts&charts=candles');

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

      renderWorkspace(urlOf(feed));

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

      renderWorkspace(urlOf(feed));

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

      renderWorkspace(urlOf(feed));

      await feedIsLive();
      broadcast(feed, [tradeFrameWith({price: 'not a number', id: 900042}), tradeFrame(50001)]);
      expect(await within(priceCard()).findByText('$50,001.00')).toBeVisible();
    });

    test('leaving the page closes the socket', async () => {
      const feed = await streamingFeed();
      const disconnected = new Promise(resolve =>
        feed.on('connection', socket => socket.on('close', () => resolve('closed'))));

      const {unmount} = renderWorkspace(urlOf(feed));

      await feedIsLive();
      unmount();
      await expect(disconnected).resolves.toBe('closed');
    });
  });
});
