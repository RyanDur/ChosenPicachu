import {TestApp} from '@test-support/TestApp';
import {chartPageAt, demosAt} from '@pages/Demos/__test_support';
import {render, screen, waitFor, within} from '@testing-library/react';
import {broadcast, listeningFeed, nonTradeFrame, tradeFrame, tradeFrameWith} from '@test-support/feed';
import {feedIsSubscribed} from '@test-support';
import userEvent from '@testing-library/user-event';
import {addChart, addMenu, doorway, dragChart, keys, releaseDrag, slot} from '@pages/Demos/Charts/__test_support';
import {story} from '@pages/Demos/Recipe/__test_support';
import {format} from 'date-fns';

const feedIsLive = async (): Promise<void> => {
  await waitFor(() => expect(screen.getByRole('status', {name: 'feed'})).toHaveTextContent(/^live$/));
  await feedIsSubscribed();
};

const priceCard = (): HTMLElement => screen.getByRole('region', {name: 'live trades'});

const captionOf = (chart: string): string =>
  within(screen.getByRole('region', {name: chart})).getByText(/candles ·/).textContent ?? '';

const drawnCandles = (): number => parseInt(captionOf('candles'), 10);

const drawnPoints = (): number => parseInt(captionOf('live trades'), 10);

describe('a list of charts', () => {
  test('the trader starts with one chart', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);

    expect(await screen.findByRole('region', {name: 'live trades'})).toBeVisible();
    expect(screen.queryByRole('region', {name: 'candles'})).not.toBeInTheDocument();
  });

  test('the trader can add a chart', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);
    await screen.findByRole('region', {name: 'live trades'});

    await addChart('Candles');

    const candles = await screen.findByRole('region', {name: 'candles'});
    const price = screen.getByRole('region', {name: 'live trades'});
    expect(candles.compareDocumentPosition(price)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  test('the trader can remove a chart', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
    await screen.findByRole('region', {name: 'live trades'});

    await userEvent.click(screen.getAllByRole('button', {name: 'remove chart'})[0]);

    expect(screen.queryByRole('region', {name: 'live trades'})).not.toBeInTheDocument();
    expect(await screen.findByRole('region', {name: 'candles'})).toBeVisible();
  });

  test('the last chart cannot be removed', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);
    await screen.findByRole('region', {name: 'live trades'});

    expect(screen.queryByRole('button', {name: 'remove chart'})).not.toBeInTheDocument();
    expect(screen.queryByRole('button', {name: 'move chart', hidden: true})).not.toBeInTheDocument();
  });

  test('the trader can sort the charts by keyboard', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
    await screen.findByRole('region', {name: 'live trades'});

    await keys('chart 1', 'ArrowDown');

    const candles = screen.getByRole('region', {name: 'candles'});
    expect(candles.compareDocumentPosition(screen.getByRole('region', {name: 'live trades'})))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(doorway('chart 2')).toHaveFocus();
  });

  test('the delete key removes a chart, never the last', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
    await screen.findByRole('region', {name: 'live trades'});

    await keys('chart 1', 'Delete');
    expect(screen.queryByRole('region', {name: 'live trades'})).not.toBeInTheDocument();

    await keys('chart 1', 'Delete');
    expect(screen.getByRole('region', {name: 'candles'})).toBeVisible();
  });

  test('the trader can drag a chart to a new seat', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
    await screen.findByRole('region', {name: 'live trades'});
    dragChart('chart 1', 'chart 2', 100);

    expect(within(slot('chart 1')).getByRole('region', {name: 'candles'})).toBeVisible();
    expect(slot('chart 1').classList).toContain('chart-pushed');

    releaseDrag('chart 2');

    expect(within(slot('chart 1')).getByRole('region', {name: 'candles'})).toBeVisible();
    expect(within(slot('chart 2')).getByRole('region', {name: 'live trades'})).toBeVisible();
  });

  test('the workspace tells its story and each chart is a doorway', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&graph=workspace')} feed={feed}/>);
    await screen.findByRole('region', {name: 'live trades'});

    expect(await screen.findByRole('heading', {name: 'let’s build this feature'})).toBeVisible();
    expect(screen.getByText(/the shape of the session/)).toBeVisible();
    const recipe = screen.getByRole('region', {name: 'build the charts yourself'});
    expect(story(recipe, 'The trader can lay out the workspace')).toHaveAttribute('open');
    expect(recipe).toHaveTextContent(/strays a third of the seat’s height/);
    expect(recipe).toHaveTextContent(/export const strayed/);

    await userEvent.click(doorway('chart 1'));
    expect(await screen.findByRole('region', {name: 'build the price line yourself'})).toBeVisible();
  });

  test('enter on a chart opens its tutorial', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=candles')} feed={feed}/>);
    await screen.findByRole('region', {name: 'candles'});

    await userEvent.click(doorway('chart 1'));

    expect(await screen.findByRole('region', {name: 'build the candles yourself'})).toBeVisible();
    expect(screen.getByRole('region', {name: 'candles'})).toBeVisible();
    expect(await screen.findByText(/read the same trades as candles/)).toBeVisible();
  });

  test('the candles story shows the markup and the dress, not just the arithmetic', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=candles')} feed={feed}/>);
    await screen.findByRole('region', {name: 'candles'});
    await userEvent.click(doorway('chart 1'));

    const recipe = await screen.findByRole('region', {name: 'build the candles yourself'});
    await within(recipe).findByText(/read the same trades as candles/);
    expect(recipe).toHaveTextContent('className="candlesticks"');
    expect(recipe).toHaveTextContent('.up .body');
    expect(recipe).toHaveTextContent('className="volumes"');
    expect(recipe).toHaveTextContent('.volume');
  });

  test('the trader can add the pressure chart and walk through its doorway', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);
    await screen.findByRole('region', {name: 'live trades'});

    await addChart('Pressure');
    const pressure = await screen.findByRole('region', {name: 'pressure'});
    expect(pressure).toBeVisible();

    await userEvent.click(doorway('chart 1'));
    expect(await screen.findByRole('region', {name: 'build the pressure yourself'})).toBeVisible();
    expect(await screen.findByText(/who is driving/)).toBeVisible();
  });

  test('a chart’s tutorial opens like a feature', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={chartPageAt('price')} feed={feed}/>);
    await screen.findByRole('region', {name: 'live trades'});

    const page = screen.getByRole('article', {name: 'price line tutorial'});
    expect(within(page).getByRole('heading', {name: 'let’s build this feature'})).toBeVisible();
    expect(screen.getByText(/without reading a single digit/)).toBeVisible();
    expect(screen.getByText('a trader')).toBeVisible();
    expect(screen.getByText(/build the story yourself first/)).toBeVisible();
    const recipe = screen.getByRole('region', {name: 'build the price line yourself'});
    await within(recipe).findByText(/watch the price move, live/);
    expect(story(recipe, 'The trader can watch the price move, live')).toBeInTheDocument();
  });

  test('the price story teaches the whole journey, data to drawn chart', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={chartPageAt('price')} feed={feed}/>);
    await screen.findByRole('region', {name: 'live trades'});

    const recipe = screen.getByRole('region', {name: 'build the price line yourself'});
    await within(recipe).findByText(/watch the price move, live/);
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
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=candles')} feed={feed}/>);
    await screen.findByRole('region', {name: 'candles'});
    await userEvent.click(doorway('chart 1'));

    const recipe = await screen.findByRole('region', {name: 'build the candles yourself'});
    await within(recipe).findByText(/read the same trades as candles/);
    expect(recipe).toHaveTextContent('export const bucketTrades');
    expect(recipe).toHaveTextContent('export const mergeLive');
    expect(recipe).toHaveTextContent('<Axes');
  });

  test('the pressure story proves the side is a fact, not a guess', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=pressure')} feed={feed}/>);
    await screen.findByRole('region', {name: 'pressure'});
    await userEvent.click(doorway('chart 1'));

    const recipe = await screen.findByRole('region', {name: 'build the pressure yourself'});
    expect(recipe).toHaveTextContent("side: schema.literalUnion('buy', 'sell')");
  });

  test('the charts travel in the url, one of each kind', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=candles,price,price')} feed={feed}/>);

    expect(await screen.findByRole('region', {name: 'candles'})).toBeVisible();
    expect(screen.getAllByRole('region', {name: 'live trades'})).toHaveLength(1);
  });

  test('the add menu offers only what the desk lacks, and a full desk offers nothing', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles,pressure')} feed={feed}/>);
    await screen.findByRole('region', {name: 'live trades'});

    const menu = addMenu();
    if (!menu) throw new Error('no add-a-chart menu on the desk');
    expect(within(menu).queryByRole('button', {name: 'Price line', hidden: true})).not.toBeInTheDocument();
    expect(within(menu).queryByRole('button', {name: 'Candles', hidden: true})).not.toBeInTheDocument();
    expect(within(menu).queryByRole('button', {name: 'Pressure', hidden: true})).not.toBeInTheDocument();

    await addChart('Pie');
    await screen.findByRole('region', {name: 'pie'});
    expect(addMenu()).toBeNull();
  });

  test('a doorway that leads nowhere returns the trader to the workspace', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={chartPageAt('bogus')} feed={feed}/>);

    expect(await screen.findByRole('heading', {name: /BTC-USD/})).toBeVisible();
    expect(screen.queryByRole('article', {name: /tutorial/})).not.toBeInTheDocument();
  });

  test('the pie is a doorway to who owns the session', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=pie,price')} feed={feed}/>);
    await screen.findByRole('region', {name: 'pie'});
    await userEvent.click(doorway('chart 1'));

    const recipe = await screen.findByRole('region', {name: 'build the pie yourself'});
    expect(recipe).toHaveTextContent('export const sideTotals');
    expect(recipe).toHaveTextContent('export const slices');
    expect(recipe).toHaveTextContent('export const sweepGates');
    expect(screen.getByText(/who owns the session/)).toBeVisible();
  });
});

describe('the demos page', () => {
  describe('live trades', () => {
    test('the user watches the latest trades stream in, newest last', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);

      await feedIsLive();
      broadcast(feed, [50001, 50002, 50003, 50004, 50005].map(price => tradeFrame(price)));
      expect(await within(priceCard()).findByText('$50,005.00')).toBeVisible();
      expect(within(priceCard()).getByText('+$4.00')).toBeVisible();
    });

    test('the accordion labels survive a visit to the streaming charts', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt()} feed={feed}/>);

      const foldLabels = async () => (await screen.findAllByRole<HTMLInputElement>('checkbox'))
        .map(toggle => toggle.labels?.[0]?.textContent);
      const before = await foldLabels();
      const demoTabs = await screen.findByRole('navigation', {name: 'demos'});
      await userEvent.click(within(demoTabs).getByText('Charts'));
      await feedIsLive();
      broadcast(feed, [tradeFrame(50001)]);
      expect(await within(priceCard()).findByText('$50,001.00')).toBeVisible();
      await userEvent.click(within(demoTabs).getByText('Accordions'));
      expect(await foldLabels()).toEqual(before);
    });

    test('the user reaches the charts from the tab strip', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt()} feed={feed}/>);

      const demoTabs = await screen.findByRole('navigation', {name: 'demos'});
      await userEvent.click(within(demoTabs).getByText('Charts'));

      expect(await screen.findByRole('region', {name: 'live trades'})).toBeVisible();
    });

    test('trades gathered before the user opens the charts are already waiting', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt()} feed={feed}/>);

      await feedIsSubscribed();
      broadcast(feed, [tradeFrame(50001)]);
      const demoTabs = await screen.findByRole('navigation', {name: 'demos'});
      await userEvent.click(within(demoTabs).getByText('Charts'));
      expect(await within(priceCard()).findByText('$50,001.00')).toBeVisible();
    });

    test('leaving the charts tab and returning keeps the stream alive', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);

      await feedIsLive();
      broadcast(feed, [tradeFrame(50001)]);
      expect(await within(priceCard()).findByText('$50,001.00')).toBeVisible();
      const opened = feed.connections();
      const demoTabs = await screen.findByRole('navigation', {name: 'demos'});
      await userEvent.click(within(demoTabs).getByText('Accordions'));
      await userEvent.click(within(demoTabs).getByText('Charts'));
      expect(await within(priceCard()).findByText('$50,001.00')).toBeVisible();
      expect(feed.connections()).toBe(opened);
    });

    test('a connected feed tells the user the stream is live beside the title', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);

      await waitFor(() => expect(screen.getByRole('status', {name: 'feed'})).toHaveTextContent(/^live$/));
    });

    test('frames that are not trades never reach the user', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);

      await feedIsLive();
      broadcast(feed, ['not even json', nonTradeFrame(99999), tradeFrame(50001)]);
      expect(await within(priceCard()).findByText('$50,001.00')).toBeVisible();
      expect(within(priceCard()).getByText('+$0.00')).toBeVisible();
    });

    test('a refused feed tells the user the stream is unavailable', async () => {
      const feed = await listeningFeed(true);
      
      render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);

      await waitFor(() =>
        expect(screen.getByRole('status', {name: 'feed'})).toHaveTextContent('live feed unavailable'));
      expect(within(screen.getByRole('alert', {hidden: true}))
        .getByText('the live feed refused the handshake')).toBeInTheDocument();
    });

    test('the user sees the price trend drawn from every recent minute', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);

      await feedIsLive();
      broadcast(feed, [50001, 50002, 50003, 50004, 50005]
        .map((price, minute) => tradeFrame(price, 1700000000000 + minute * 60000)));
      await waitFor(() => expect(drawnPoints()).toBe(5));
    });

    test('the charts name what they measure', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);

      expect(await screen.findByRole('heading', {name: /BTC-USD/})).toBeVisible();
    });

    test('the charts explain what they show', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);

      const explainers = await screen.findAllByText('what am I looking at?');
      expect(explainers).toHaveLength(2);
      await userEvent.click(explainers[0]);
      expect(screen.getByText(/price of one bitcoin in US dollars/)).toBeVisible();
      await userEvent.click(explainers[1]);
      expect(screen.getByText(/how much bitcoin changed hands/)).toBeVisible();
    });

    test('the user reads the window as candles with their traded volume', async () => {
      const feed = await listeningFeed();
      const bucketStart = 1700000000000;

      render(<TestApp at={demosAt('?tab=charts&charts=candles')} feed={feed}/>);

      await feedIsLive();
      broadcast(feed, [
        tradeFrame(50001, bucketStart, '0.01'),
        tradeFrame(50003, bucketStart + 1000, '0.02'),
        tradeFrame(50002, bucketStart + 2000, '0.01'),
        tradeFrame(50004, bucketStart + 60000, '0.03'),
        tradeFrame(50000, bucketStart + 61000, '0.01')
      ]);
      await waitFor(() => expect(drawnCandles()).toBe(2));
    });

    test('the chart tells the user its price and time range', async () => {
      const feed = await listeningFeed();
      const tenMinutes = 600000;
      const firstTradedAt = Math.ceil(1700000000000 / tenMinutes) * tenMinutes;

      render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);

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
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);

      await feedIsLive();
      broadcast(feed, [tradeFrame(50001)]);
      expect(await within(priceCard()).findByText('$50,001.00')).toBeVisible();
      feed.clients.forEach(socket => socket.close());
      await waitFor(() =>
        expect(screen.getByRole('status', {name: 'feed'})).toHaveTextContent('live feed unavailable'));
      expect(within(priceCard()).getByText('$50,001.00')).toBeVisible();
      expect(within(screen.getByRole('alert', {hidden: true}))
        .getByText('the live feed hung up mid-stream')).toBeInTheDocument();
    });

    test('a trade whose price is not a number never reaches the user', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);

      await feedIsLive();
      broadcast(feed, [tradeFrameWith({price: 'not a number', id: 900042}), tradeFrame(50001)]);
      expect(await within(priceCard()).findByText('$50,001.00')).toBeVisible();
    });

    test('leaving the page closes the socket', async () => {
      const feed = await listeningFeed();

      const {unmount} = render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);

      await feedIsLive();
      await waitFor(() => expect(feed.clients.size).toBe(1));
      unmount();
      await waitFor(() => expect(feed.clients.size).toBe(0));
    });
  });
});
