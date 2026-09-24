import {TestApp} from '@__test_support/TestApp';
import {chartPageAt, demosAt} from '@pages/Demos/__test_support';
import {render, screen, waitFor, within} from '@testing-library/react';
import {broadcast, listeningFeed, nonTradeFrame, tradeFrame, tradeFrameWith} from '@pages/Demos/__test_support/feed';
import {feedIsSubscribed} from '@pages/Demos/__test_support';
import userEvent from '@testing-library/user-event';
import {chartsDesk} from '@pages/Demos/Charts/__test_support';
import {recipeFolds} from '@pages/Demos/Recipe/__test_support';
import {format} from 'date-fns';
import {tradeHistoryRefuses} from '@__test_support/server';
import {blurFocusOnMoves} from '@__test_support/focus';

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
    await feedIsSubscribed();

    expect(await screen.findByRole('region', {name: 'live trades'})).toBeVisible();
    expect(screen.queryByRole('region', {name: 'candles'})).not.toBeInTheDocument();
  });

  test('the trader can add a chart, and it lands under the hand', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);
    await feedIsSubscribed();
    await screen.findByRole('region', {name: 'live trades'});

    await chartsDesk.addChart('Candles');

    const candles = await screen.findByRole('region', {name: 'candles'});
    const price = screen.getByRole('region', {name: 'live trades'});
    expect(candles.compareDocumentPosition(price)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  test('each chart card names itself in the heading outline', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles,pressure,pie')} feed={feed}/>);
    await feedIsSubscribed();

    const candles = await screen.findByRole('region', {name: 'candles'});
    const price = screen.getByRole('region', {name: 'live trades'});
    expect(within(candles).getByRole('heading', {name: 'candles'})).toBeInTheDocument();
    expect(within(price).getByRole('heading', {name: 'live trades'})).toBeInTheDocument();
    expect(within(screen.getByRole('region', {name: 'pressure'})).getByRole('heading', {name: 'pressure'})).toBeInTheDocument();
    expect(within(screen.getByRole('region', {name: 'pie'})).getByRole('heading', {name: 'pie'})).toBeInTheDocument();
  });

  test('the trader can remove a chart', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed();
    await screen.findByRole('region', {name: 'live trades'});

    await userEvent.click(screen.getAllByRole('button', {name: 'remove chart'})[0]);

    expect(screen.queryByRole('region', {name: 'live trades'})).not.toBeInTheDocument();
    expect(await screen.findByRole('region', {name: 'candles'})).toBeVisible();
    expect(screen.getByRole('status', {name: 'desk report'})).toHaveTextContent('Price line removed');
  });

  test('the last chart can be neither removed nor moved', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);
    await feedIsSubscribed();
    await screen.findByRole('region', {name: 'live trades'});

    expect(screen.queryByRole('button', {name: 'remove chart'})).not.toBeInTheDocument();
    expect(screen.queryByRole('button', {name: 'move chart', hidden: true})).not.toBeInTheDocument();
  });

  test('a chart walked by keyboard takes the focus with it', async () => {
    blurFocusOnMoves();
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed();
    await screen.findByRole('region', {name: 'live trades'});

    await chartsDesk.keys('Price line', 'ArrowDown');

    const candles = screen.getByRole('region', {name: 'candles'});
    expect(candles.compareDocumentPosition(screen.getByRole('region', {name: 'live trades'})))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(chartsDesk.doorway('Price line')).toHaveFocus();
  });

  test('a chart keeps the period chosen for it when the charts are reordered', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed();
    await screen.findByRole('region', {name: 'live trades'});
    await userEvent.click(within(screen.getByLabelText('price period by')).getByRole('button', {name: 'day', hidden: true}));
    await screen.findByRole('button', {name: 'price period day'});

    await chartsDesk.keys('Price line', 'ArrowDown');

    expect(await screen.findByRole('button', {name: 'price period day'})).toBeInTheDocument();
    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('charts=candles%2Cprice%3Aday');
  });

  test('a chart walked by keyboard says where it landed', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed();
    await screen.findByRole('region', {name: 'live trades'});

    await chartsDesk.keys('Price line', 'ArrowDown');

    expect(screen.getByRole('status', {name: 'desk report'})).toHaveTextContent('Price line moved to 2 of 2');
  });

  test('the delete key removes a chart', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed();
    await screen.findByRole('region', {name: 'live trades'});

    await chartsDesk.keys('Price line', 'Delete');

    expect(screen.queryByRole('region', {name: 'live trades'})).not.toBeInTheDocument();
    expect(screen.getByRole('status', {name: 'desk report'})).toHaveTextContent('Price line removed');
  });

  test("the chart that takes the removed one's seat takes the focus", async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed();
    await screen.findByRole('region', {name: 'live trades'});

    await chartsDesk.keys('Price line', 'Delete');

    await waitFor(() => expect(chartsDesk.doorway('Candles')).toHaveFocus());
  });

  test('the chart that is now last takes the focus when the last chart is deleted', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed();
    await screen.findByRole('region', {name: 'candles'});

    await chartsDesk.keys('Candles', 'Delete');

    await waitFor(() => expect(chartsDesk.doorway('Price line')).toHaveFocus());
  });

  test('the delete key leaves the last chart standing', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=candles')} feed={feed}/>);
    await feedIsSubscribed();
    await screen.findByRole('region', {name: 'candles'});

    await chartsDesk.keys('Candles', 'Delete');

    expect(screen.getByRole('region', {name: 'candles'})).toBeVisible();
  });

  test('the trader can drag a chart to a new seat', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed();
    await screen.findByRole('region', {name: 'live trades'});
    chartsDesk.dragChart('Price line', 'Candles', 100);

    expect(within(chartsDesk.seat(1)).getByRole('region', {name: 'candles'})).toBeVisible();

    chartsDesk.releaseDrag('Price line');

    expect(within(chartsDesk.seat(1)).getByRole('region', {name: 'candles'})).toBeVisible();
    expect(within(chartsDesk.seat(2)).getByRole('region', {name: 'live trades'})).toBeVisible();
  });

  test('the workspace tells its story', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&graph=workspace')} feed={feed}/>);
    await feedIsSubscribed();
    await screen.findByRole('region', {name: 'live trades'});

    expect(await screen.findByRole('heading', {name: 'let’s build this feature'})).toBeVisible();
    expect(screen.getByText(/the shape of the session/)).toBeVisible();
    const recipe = screen.getByRole('region', {name: 'build the charts yourself'});
    expect(recipeFolds.story(recipe, 'The trader can lay out the workspace')).toHaveAttribute('open');
    expect(recipe).toHaveTextContent(/strays a third of the seat’s height/);
    expect(recipe).toHaveTextContent(/export const strayed/);
  });

  test('a chart is a doorway to its own tutorial', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&graph=workspace')} feed={feed}/>);
    await feedIsSubscribed();
    await screen.findByRole('region', {name: 'live trades'});

    await userEvent.click(chartsDesk.doorway('Price line'));

    expect(await screen.findByRole('region', {name: 'build the price line yourself'})).toBeVisible();
  });

  test('enter on a chart opens its tutorial', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=candles')} feed={feed}/>);
    await feedIsSubscribed();
    await screen.findByRole('region', {name: 'candles'});

    chartsDesk.doorway('Candles').focus();
    await userEvent.keyboard('{Enter}');

    expect(await screen.findByRole('region', {name: 'build the candles yourself'})).toBeVisible();
    expect(screen.getByRole('region', {name: 'candles'})).toBeVisible();
    expect(await screen.findByText(/read the same trades as candles/)).toBeVisible();
  });

  test('the candles story shows the markup and the dress, not just the arithmetic', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=candles')} feed={feed}/>);
    await feedIsSubscribed();
    await screen.findByRole('region', {name: 'candles'});
    const recipe = await chartsDesk.walkThrough('Candles', 'build the candles yourself');
    const story = await recipeFolds.press(recipe, 'The trader can read the same trades as candles');
    expect(story).toHaveAttribute('open');
    expect(recipe).toHaveTextContent('className="candlesticks"');
    expect(recipe).toHaveTextContent('.up .body');
    expect(recipe).toHaveTextContent('className="volumes"');
    expect(recipe).toHaveTextContent('.volume');
  });

  test('a story the trader opened folds shut when they press its summary again', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=candles')} feed={feed}/>);
    await feedIsSubscribed();
    await screen.findByRole('region', {name: 'candles'});
    const recipe = await chartsDesk.walkThrough('Candles', 'build the candles yourself');
    expect(await recipeFolds.press(recipe, 'The trader can read the same trades as candles')).toHaveAttribute('open');

    const story = await recipeFolds.press(recipe, 'The trader can read the same trades as candles');

    expect(story).not.toHaveAttribute('open');
    expect(screen.getByRole('status', {name: 'url search'})).not.toHaveTextContent('graph=candles');
  });

  test('the trader can add the pressure chart', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);
    await feedIsSubscribed();
    await screen.findByRole('region', {name: 'live trades'});

    await chartsDesk.addChart('Pressure');

    expect(await screen.findByRole('region', {name: 'pressure'})).toBeVisible();
  });

  test("a chart tutorial's outline steps down from its own heading to its first step", async () => {
    const feed = await listeningFeed();

    render(<TestApp at={chartPageAt('price', '?graph=price')} feed={feed}/>);

    expect(await screen.findByRole('heading', {name: 'price line tutorial', level: 2})).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: 'let’s build this feature', level: 3})).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: 'The trader can watch the price move, live', level: 4})).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: 'Open the stream', level: 5})).toBeInTheDocument();
  });

  test('the workspace tutorial names its story and steps in the heading outline', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&graph=workspace')} feed={feed}/>);
    await feedIsSubscribed();

    expect(await screen.findByRole('heading', {name: 'The trader can lay out the workspace', level: 3})).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: 'Deal the workspace from the address', level: 4})).toBeInTheDocument();
  });

  test('the pressure chart is a doorway to its tutorial', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=pressure')} feed={feed}/>);
    await feedIsSubscribed();
    await screen.findByRole('region', {name: 'pressure'});

    await userEvent.click(chartsDesk.doorway('Pressure'));

    expect(await screen.findByRole('region', {name: 'build the pressure yourself'})).toBeVisible();
    expect(await screen.findByText(/who is driving/)).toBeVisible();
  });

  test('a chart’s tutorial opens like a feature', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={chartPageAt('price')} feed={feed}/>);
    await feedIsSubscribed();
    await screen.findByRole('region', {name: 'live trades'});

    const page = screen.getByRole('article', {name: 'price line tutorial'});
    expect(within(page).getByRole('heading', {name: 'let’s build this feature', level: 3})).toBeVisible();
    expect(screen.getByText(/without reading a single digit/)).toBeVisible();
    expect(screen.getByText('a trader')).toBeVisible();
    expect(screen.getByText(/build the story yourself first/)).toBeVisible();
    const recipe = screen.getByRole('region', {name: 'build the price line yourself'});
    expect(recipeFolds.story(recipe, 'The trader can watch the price move, live')).toBeInTheDocument();
  });

  test('the price story teaches the whole journey, data to drawn chart', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={chartPageAt('price', '?graph=price')} feed={feed}/>);
    await feedIsSubscribed();
    await screen.findByRole('region', {name: 'live trades'});

    const recipe = screen.getByRole('region', {name: 'build the price line yourself'});
    expect(recipeFolds.story(recipe, 'The trader can watch the price move, live')).toHaveAttribute('open');
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
    await feedIsSubscribed();
    await screen.findByRole('region', {name: 'candles'});
    const recipe = await chartsDesk.walkThrough('Candles', 'build the candles yourself');
    const story = await recipeFolds.press(recipe, 'The trader can read the same trades as candles');
    expect(story).toHaveAttribute('open');
    expect(recipe).toHaveTextContent('export const bucketTrades');
    expect(recipe).toHaveTextContent('export const mergeLive');
    expect(recipe).toHaveTextContent('<Axes');
  });

  test('the pressure story proves the side is a fact, not a guess', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=pressure')} feed={feed}/>);
    await feedIsSubscribed();
    await screen.findByRole('region', {name: 'pressure'});
    const recipe = await chartsDesk.walkThrough('Pressure', 'build the pressure yourself');
    const story = await recipeFolds.press(recipe, 'The trader can see who is driving the move');
    expect(story).toHaveAttribute('open');
    expect(recipe).toHaveTextContent("side: schema.literalUnion('buy', 'sell')");
  });

  test('the charts travel in the url, one of each kind', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=candles,price,price')} feed={feed}/>);
    await feedIsSubscribed();

    expect(await screen.findByRole('region', {name: 'candles'})).toBeVisible();
    expect(screen.getAllByRole('region', {name: 'live trades'})).toHaveLength(1);
  });

  test('the add menu offers only what the desk lacks', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles,pressure')} feed={feed}/>);
    await feedIsSubscribed();
    await screen.findByRole('region', {name: 'live trades'});

    const menu = chartsDesk.addMenu();
    if (!menu) throw new Error('no add-a-chart menu on the desk');
    expect(within(menu).queryByRole('button', {name: 'Price line', hidden: true})).not.toBeInTheDocument();
    expect(within(menu).queryByRole('button', {name: 'Candles', hidden: true})).not.toBeInTheDocument();
    expect(within(menu).queryByRole('button', {name: 'Pressure', hidden: true})).not.toBeInTheDocument();
  });

  test('a full desk offers no add menu', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles,pressure')} feed={feed}/>);
    await feedIsSubscribed();
    await screen.findByRole('region', {name: 'live trades'});

    await chartsDesk.addChart('Pie');

    await screen.findByRole('region', {name: 'pie'});
    expect(chartsDesk.addMenu()).not.toBeInTheDocument();
  });

  test('an added chart says so', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);
    await feedIsSubscribed();
    await screen.findByRole('region', {name: 'live trades'});

    await chartsDesk.addChart('Pie');

    await screen.findByRole('region', {name: 'pie'});
    expect(screen.getByRole('status', {name: 'desk report'})).toHaveTextContent('Pie added');
  });

  test('a doorway that leads nowhere returns the trader to the workspace', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={chartPageAt('bogus')} feed={feed}/>);
    await feedIsSubscribed();

    expect(await screen.findByRole('heading', {name: /BTC-USD/})).toBeVisible();
    expect(screen.queryByRole('article', {name: /tutorial/})).not.toBeInTheDocument();
  });

  test('the pie is a doorway to who owns the session', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=pie,price')} feed={feed}/>);
    await feedIsSubscribed();
    await screen.findByRole('region', {name: 'pie'});
    const recipe = await chartsDesk.walkThrough('Pie', 'build the pie yourself');
    const story = await recipeFolds.press(recipe, 'The trader can see who owns the session');
    expect(story).toHaveAttribute('open');
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

    test('the user reaches the charts from the tab strip', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt()} feed={feed}/>);
      await feedIsSubscribed();

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

    test('a connected feed tells the user the stream is live', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);
      await feedIsSubscribed();

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

    test('a trade history that cannot be loaded tells the user', async () => {
      tradeHistoryRefuses();
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);

      expect(await within(screen.getByRole('alert', {hidden: true}))
        .findByText('the trade history is having trouble')).toBeInTheDocument();
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
      await feedIsSubscribed();

      expect(await screen.findByRole('heading', {name: /BTC-USD/})).toBeVisible();
    });

    test('the charts explain what they show', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
      await feedIsSubscribed();

      const explainers = await screen.findAllByText('what am I looking at?');
      expect(explainers).toHaveLength(2);
      await userEvent.click(explainers[0]);
      expect(screen.getByText(/price of one bitcoin in US dollars/)).toBeVisible();
      await userEvent.click(explainers[1]);
      expect(screen.getByText(/how much bitcoin changed hands/)).toBeVisible();
    });

    test('the trades in a minute become one candle', async () => {
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
      expect(within(priceCard()).getByText('+$0.00')).toBeVisible();
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
