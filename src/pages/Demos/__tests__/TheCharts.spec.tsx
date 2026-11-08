import {TestApp} from '@__test_support/TestApp';
import {Paths} from '@navigation';
import {chartPageAt, demoPage, demosAt, demoTabs, feedIsLive, feedIsSubscribed} from '@pages/Demos/__test_support';
import {render, waitFor} from '@testing-library/react';
import {
  broadcast,
  hangUp,
  listeningFeed,
  nonTradeFrame,
  tradeFrame,
  tradeFrameWith
} from '@pages/Demos/__test_support/feed';
import {chartsDesk} from '@pages/Demos/Charts/__test_support';
import {recipeFolds} from '@pages/Demos/Recipe/__test_support';
import {format} from 'date-fns';
import {tradeHistoryRefuses} from '@__test_support/server';
import {blurFocusOnMoves} from '@__test_support/focus';

describe('a list of charts', () => {
  test('the trader starts with one chart', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await chartsDesk.findChart('live trades')).toBeVisible();
    expect(chartsDesk.missingChart('candles')).not.toBeInTheDocument();
  });

  test('the trader can add a chart, and it goes to the front of the list', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    await chartsDesk.addChart('Candles');

    const candles = await chartsDesk.findChart('candles');
    const price = chartsDesk.chart('live trades');
    expect(candles.compareDocumentPosition(price)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  test('each chart card names itself in the heading outline', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts', '?charts=price,candles,pressure,pie')} feed={feed}/>);
    await feedIsSubscribed(feed);

    const candles = await chartsDesk.findChart('candles');
    const price = chartsDesk.chart('live trades');
    expect(chartsDesk.titleIn(candles, 'candles')).toBeInTheDocument();
    expect(chartsDesk.titleIn(price, 'live trades')).toBeInTheDocument();
    expect(chartsDesk.titleIn(chartsDesk.chart('pressure'), 'pressure')).toBeInTheDocument();
    expect(chartsDesk.titleIn(chartsDesk.chart('pie'), 'pie')).toBeInTheDocument();
  });

  test('the trader can remove a chart', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts', '?charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    await chartsDesk.removeFirst();

    expect(chartsDesk.missingChart('live trades')).not.toBeInTheDocument();
    expect(await chartsDesk.findChart('candles')).toBeVisible();
    expect(chartsDesk.deskReport()).toHaveTextContent('Price line removed');
  });

  test('the last chart can be neither removed nor moved', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    expect(chartsDesk.removeOnOffer()).not.toBeInTheDocument();
    expect(chartsDesk.gripOnOffer()).not.toBeInTheDocument();
  });

  test('a chart walked by keyboard takes the focus with it', async () => {
    blurFocusOnMoves();
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts', '?charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    await chartsDesk.keys('Price line', 'ArrowDown');

    const candles = chartsDesk.chart('candles');
    expect(candles.compareDocumentPosition(chartsDesk.chart('live trades')))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(chartsDesk.doorway('Price line')).toHaveFocus();
  });

  test('a chart keeps the period chosen for it when the charts are reordered', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts', '?charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');
    await chartsDesk.choosePeriod('price', 'day');
    await chartsDesk.findPeriodShown('price', 'day');

    await chartsDesk.keys('Price line', 'ArrowDown');

    expect(await chartsDesk.findPeriodShown('price', 'day')).toBeInTheDocument();
    expect(demoPage.urlSearch()).toHaveTextContent('charts=candles%2Cprice%3Aday');
  });

  test('a chart walked by keyboard says where it landed', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts', '?charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    await chartsDesk.keys('Price line', 'ArrowDown');

    expect(chartsDesk.deskReport()).toHaveTextContent('Price line moved to 2 of 2');
  });

  test('the delete key removes a chart', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts', '?charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    await chartsDesk.keys('Price line', 'Delete');

    expect(chartsDesk.missingChart('live trades')).not.toBeInTheDocument();
    expect(chartsDesk.deskReport()).toHaveTextContent('Price line removed');
  });

  test('the backspace key removes a chart', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts', '?charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    await chartsDesk.keys('Price line', 'Backspace');

    expect(chartsDesk.missingChart('live trades')).not.toBeInTheDocument();
    expect(chartsDesk.deskReport()).toHaveTextContent('Price line removed');
  });

  test('the chart that takes the seat of a chart deleted by its key takes the focus', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts', '?charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    await chartsDesk.keys('Price line', 'Delete');

    expect(chartsDesk.doorway('Candles')).toHaveFocus();
  });

  test('the chart that takes the seat of a chart removed by its button takes the focus', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts', '?charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    await chartsDesk.removeFirst();

    expect(chartsDesk.doorway('Candles')).toHaveFocus();
  });

  test('the chart after a deleted middle chart takes the focus', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts', '?charts=price,candles,pie')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('candles');

    await chartsDesk.keys('Candles', 'Delete');

    expect(chartsDesk.doorway('Pie')).toHaveFocus();
  });

  test('the chart that is now last takes the focus when the last chart is deleted', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts', '?charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('candles');

    await chartsDesk.keys('Candles', 'Delete');

    expect(chartsDesk.doorway('Price line')).toHaveFocus();
  });

  test('the delete key leaves the last chart standing', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts', '?charts=candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('candles');

    await chartsDesk.keys('Candles', 'Delete');

    expect(chartsDesk.chart('candles')).toBeVisible();
  });

  test("a finger pressed on a chart's grip readies the chart to be moved, and lifted leaves it at rest", async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('charts', '?charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');
    const finger = chartsDesk.fingerOn('Price line');

    await finger.press();
    expect(chartsDesk.slot('Price line')).toHaveAttribute('draggable', 'true');

    await finger.lift();
    expect(chartsDesk.slot('Price line')).not.toHaveAttribute('draggable', 'true');
  });

  test('should open the workspace story under let’s build this feature', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts', '?graph=workspace')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    expect(await chartsDesk.findTitle('let’s build this feature')).toBeVisible();
    expect(recipeFolds.story(chartsDesk.recipe('charts'), 'The trader can lay out the workspace')).toHaveAttribute('open');
  });

  test('a chart is a doorway to its own tutorial', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts', '?graph=workspace')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    await chartsDesk.open('Price line');

    expect(await chartsDesk.findRecipe('price line')).toBeVisible();
  });

  test('enter on a chart opens its tutorial', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts', '?charts=candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('candles');

    await chartsDesk.keys('Candles', 'Enter');

    expect(await chartsDesk.findRecipe('candles')).toBeVisible();
    expect(chartsDesk.chart('candles')).toBeVisible();
  });

  test('should open the candles story from the candles walkthrough', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts', '?charts=candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('candles');
    const recipe = await chartsDesk.walkThrough('Candles', 'build the candles yourself');

    expect(await recipeFolds.press(recipe, 'The trader can read the same trades as candles')).toHaveAttribute('open');
  });

  test('a story the trader opened folds shut when they press its summary again', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts', '?charts=candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('candles');
    const recipe = await chartsDesk.walkThrough('Candles', 'build the candles yourself');
    expect(await recipeFolds.press(recipe, 'The trader can read the same trades as candles')).toHaveAttribute('open');

    const story = await recipeFolds.press(recipe, 'The trader can read the same trades as candles');

    expect(story).not.toHaveAttribute('open');
    expect(demoPage.urlSearch()).not.toHaveTextContent('graph=candles');
  });

  test('the trader can add the pressure chart', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    await chartsDesk.addChart('Pressure');

    expect(await chartsDesk.findChart('pressure')).toBeVisible();
  });

  test("a chart tutorial's outline steps down from its own heading to its first step", async () => {
    const feed = await listeningFeed();

    render(<TestApp at={chartPageAt('price', '?graph=price')} feed={feed}/>);

    expect(await chartsDesk.findTitle('price line tutorial', 2)).toBeInTheDocument();
    expect(chartsDesk.title('let’s build this feature', 3)).toBeInTheDocument();
    expect(chartsDesk.title('The trader can watch the price move, live', 4)).toBeInTheDocument();
    expect(chartsDesk.title('Open a socket, and keep only what decodes', 5)).toBeInTheDocument();
  });

  describe('the price line’s story', () => {
    const priceStory = async (): Promise<HTMLElement> => {
      const feed = await listeningFeed();
      render(<TestApp at={chartPageAt('price', '?graph=price')} feed={feed}/>);
      await chartsDesk.findTitle('price line tutorial', 2);
      return recipeFolds.story(document.body, 'The trader can watch the price move, live');
    };

    test('should head each step with what happens', async () => {
      expect(recipeFolds.stepTitles(await priceStory())).toEqual([
        'Open a socket, and keep only what decodes',
        'Fetch the recent past, and join it to the live trades',
        'Group the live trades into candles',
        'Let the trader choose the period',
        'Turn each candle into a point on the line',
        'Label the prices and the time'
      ]);
    });
  });

  describe('the candles’ story', () => {
    const candlesStory = async (): Promise<HTMLElement> => {
      const feed = await listeningFeed();
      render(<TestApp at={chartPageAt('candles', '?graph=candles')} feed={feed}/>);
      await chartsDesk.findTitle('candles tutorial', 2);
      return recipeFolds.story(document.body, 'The trader can read the same trades as candles');
    };

    test('should head each step with what happens', async () => {
      expect(recipeFolds.stepTitles(await candlesStory())).toEqual([
        'Make the candles the way the price line does',
        'Draw each candle as a body, a wall and a wick',
        'Draw the volume under each candle',
        'Use the same axes'
      ]);
    });
  });

  describe('the pressure chart’s story', () => {
    const pressureStory = async (): Promise<HTMLElement> => {
      const feed = await listeningFeed();
      render(<TestApp at={chartPageAt('pressure', '?graph=pressure')} feed={feed}/>);
      await chartsDesk.findTitle('pressure tutorial', 2);
      return recipeFolds.story(document.body, 'The trader can see who is driving the move');
    };

    test('should head each step with what happens', async () => {
      expect(recipeFolds.stepTitles(await pressureStory())).toEqual([
        'Sum each minute by who took the trade',
        'Scale both sides by the larger one',
        'Draw the bars, and label them in bitcoin'
      ]);
    });
  });

  describe('the pie’s story', () => {
    const pieStory = async (): Promise<HTMLElement> => {
      const feed = await listeningFeed();
      render(<TestApp at={chartPageAt('pie', '?graph=pie')} feed={feed}/>);
      await chartsDesk.findTitle('pie tutorial', 2);
      return recipeFolds.story(document.body, 'The trader can see who owns the session');
    };

    test('should head each step with what happens', async () => {
      expect(recipeFolds.stepTitles(await pieStory())).toEqual([
        'Add up each side',
        'Cut the circle with rotations only',
        'Print each share'
      ]);
    });
  });

  test('the workspace tutorial names its story and steps in the heading outline', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts', '?graph=workspace')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await chartsDesk.findTitle('The trader can lay out the workspace', 3)).toBeInTheDocument();
    expect(chartsDesk.title('Read the charts from the address', 4)).toBeInTheDocument();
  });

  test('the pressure chart is a doorway to its tutorial', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts', '?charts=pressure')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('pressure');

    await chartsDesk.open('Pressure');

    expect(await chartsDesk.findRecipe('pressure')).toBeVisible();
  });

  test('should open a chart’s tutorial on let’s build this feature and its story', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={chartPageAt('price')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    expect(chartsDesk.titleIn(chartsDesk.tutorial('price line'), 'let’s build this feature', 3)).toBeVisible();
    expect(recipeFolds.story(chartsDesk.recipe('price line'), 'The trader can watch the price move, live')).toBeInTheDocument();
  });

  test('should open the price story on the price line’s page', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={chartPageAt('price', '?graph=price')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    expect(recipeFolds.story(chartsDesk.recipe('price line'), 'The trader can watch the price move, live')).toHaveAttribute('open');
  });

  test('should open the pressure story from the pressure walkthrough', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts', '?charts=pressure')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('pressure');
    const recipe = await chartsDesk.walkThrough('Pressure', 'build the pressure yourself');

    expect(await recipeFolds.press(recipe, 'The trader can see who is driving the move')).toHaveAttribute('open');
  });

  test('the charts travel in the url, one of each kind', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts', '?charts=candles,price,price')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await chartsDesk.findChart('candles')).toBeVisible();
    expect(chartsDesk.chartsNamed('live trades')).toHaveLength(1);
  });

  test('the add menu offers only what the desk lacks', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts', '?charts=price,candles,pressure')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    expect(chartsDesk.offered('Price line')).not.toBeInTheDocument();
    expect(chartsDesk.offered('Candles')).not.toBeInTheDocument();
    expect(chartsDesk.offered('Pressure')).not.toBeInTheDocument();
  });

  test('a full desk offers no add menu', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts', '?charts=price,candles,pressure')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    await chartsDesk.addChart('Pie');

    await chartsDesk.findChart('pie');
    expect(chartsDesk.addMenu()).not.toBeInTheDocument();
  });

  test('a pie added after trades arrive starts with their shares', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts')} feed={feed}/>);
    await feedIsLive(feed);
    broadcast(feed, [tradeFrame(50000, 1700000000000, '0.01', 'bought'), tradeFrame(50001, 1700000000500, '0.03', 'sold')]);
    await chartsDesk.findOnPriceCard('$50,001.00');

    await chartsDesk.addChart('Pie');

    const legend = await chartsDesk.findPieLegend();
    expect(legend).toHaveTextContent('25% bought');
    expect(legend).toHaveTextContent('75% sold');
  });

  test('an added chart says so', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    await chartsDesk.addChart('Pie');

    await chartsDesk.findChart('pie');
    expect(chartsDesk.deskReport()).toHaveTextContent('Pie added');
  });

  test('a doorway that leads nowhere returns the trader to the workspace', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={chartPageAt('bogus')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await chartsDesk.findTitle(/BTC-USD/)).toBeVisible();
    expect(chartsDesk.anyTutorial()).not.toBeInTheDocument();
  });

  test('should open the pie story from the pie walkthrough', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('charts', '?charts=pie,price')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('pie');
    const recipe = await chartsDesk.walkThrough('Pie', 'build the pie yourself');

    expect(await recipeFolds.press(recipe, 'The trader can see who owns the session')).toHaveAttribute('open');
  });
});

describe('the demos page', () => {
  describe('live trades', () => {
    test('the user watches the latest trades stream in, newest last, measured from the first minute’s close', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('charts')} feed={feed}/>);

      await feedIsLive(feed);
      broadcast(feed, [
        tradeFrame(50000),
        tradeFrame(50001, 1700000000500),
        ...[50002, 50003, 50004, 50005].map(price => tradeFrame(price, 1700000060000))
      ]);
      expect(await chartsDesk.findOnPriceCard('$50,005.00')).toBeVisible();
      expect(chartsDesk.onPriceCard('+$4.00')).toBeVisible();
    });

    test('the user reaches the charts from the tab strip', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('accordions')} feed={feed}/>);
      await feedIsSubscribed(feed);

      await demoTabs.open('Charts');

      expect(await chartsDesk.findChart('live trades')).toBeVisible();
    });

    test('trades gathered before the user opens the charts are already waiting', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('accordions')} feed={feed}/>);

      await feedIsSubscribed(feed);
      broadcast(feed, [tradeFrame(50001)]);
      await demoTabs.open('Charts');
      expect(await chartsDesk.findOnPriceCard('$50,001.00')).toBeVisible();
    });

    test('leaving the charts tab and returning keeps the stream alive', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('charts')} feed={feed}/>);

      await feedIsLive(feed);
      broadcast(feed, [tradeFrame(50001)]);
      expect(await chartsDesk.findOnPriceCard('$50,001.00')).toBeVisible();
      const opened = feed.connections();
      await demoTabs.open('Accordions');
      await demoTabs.open('Charts');
      expect(await chartsDesk.findOnPriceCard('$50,001.00')).toBeVisible();
      expect(feed.connections()).toBe(opened);
    });

    test('a connected feed tells the user the stream is live', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('charts')} feed={feed}/>);
      await feedIsSubscribed(feed);

      await waitFor(() => expect(chartsDesk.feedStatus()).toHaveTextContent(/^live$/));
    });

    test('frames that are not trades never reach the user', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('charts')} feed={feed}/>);

      await feedIsLive(feed);
      broadcast(feed, ['not even json', nonTradeFrame(99999), tradeFrame(50001)]);
      expect(await chartsDesk.findOnPriceCard('$50,001.00')).toBeVisible();
      expect(chartsDesk.onPriceCard('+$0.00')).toBeVisible();
    });

    test('a refused feed tells the user the stream is unavailable', async () => {
      const feed = await listeningFeed(true);

      render(<TestApp at={demosAt('charts')} feed={feed}/>);

      await waitFor(() =>
        expect(chartsDesk.feedStatus()).toHaveTextContent('live feed unavailable'));
      expect(chartsDesk.trouble('the live feed refused the handshake')).toBeInTheDocument();
    });

    test('a trade history that cannot be loaded tells the user', async () => {
      tradeHistoryRefuses();
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('charts')} feed={feed}/>);

      expect(await chartsDesk.findTrouble('the trade history is having trouble')).toBeInTheDocument();
    });

    test('the user sees the price trend drawn from every recent minute', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('charts')} feed={feed}/>);

      await feedIsLive(feed);
      broadcast(feed, [50001, 50002, 50003, 50004, 50005]
        .map((price, minute) => tradeFrame(price, 1700000000000 + minute * 60000)));
      await waitFor(() => expect(chartsDesk.drawnPoints()).toBe(5));
    });

    test('the charts name what they measure', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('charts')} feed={feed}/>);
      await feedIsSubscribed(feed);

      expect(await chartsDesk.findTitle(/BTC-USD/)).toBeVisible();
    });

    test('the charts explain what they show', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('charts', '?charts=price,candles')} feed={feed}/>);
      await feedIsSubscribed(feed);

      await chartsDesk.findChart('candles');
      const price = chartsDesk.explanationOf('live trades');
      const candles = chartsDesk.explanationOf('candles');
      expect(price).not.toBeVisible();
      expect(candles).not.toBeVisible();

      await chartsDesk.explain('live trades');
      await chartsDesk.explain('candles');

      expect(price).toBeVisible();
      expect(candles).toBeVisible();
    });

    test('the trades in a minute become one candle', async () => {
      const feed = await listeningFeed();
      const bucketStart = 1700000000000;

      render(<TestApp at={demosAt('charts', '?charts=candles')} feed={feed}/>);

      await feedIsLive(feed);
      broadcast(feed, [
        tradeFrame(50001, bucketStart, '0.01'),
        tradeFrame(50003, bucketStart + 1000, '0.02'),
        tradeFrame(50002, bucketStart + 2000, '0.01'),
        tradeFrame(50004, bucketStart + 60000, '0.03'),
        tradeFrame(50000, bucketStart + 61000, '0.01')
      ]);
      await waitFor(() => expect(chartsDesk.drawnCandles()).toBe(2));
    });

    test('the chart tells the user its price and time range', async () => {
      const feed = await listeningFeed();
      const tenMinutes = 600000;
      const firstTradedAt = Math.ceil(1700000000000 / tenMinutes) * tenMinutes;

      render(<TestApp at={demosAt('charts')} feed={feed}/>);

      await feedIsLive(feed);
      broadcast(feed, [50001, 50002, 50003, 50004, 50005]
        .map((price, index) => tradeFrame(price, firstTradedAt + index * tenMinutes)));
      expect(await chartsDesk.findOnPriceCard('$50,005')).toBeVisible();
      expect(chartsDesk.onPriceCard('$50,003')).toBeVisible();
      expect(chartsDesk.onPriceCard('$50,001')).toBeVisible();
      expect(chartsDesk.onPriceCard('5 candles · 1m each')).toBeVisible();
      const ticks = chartsDesk.priceTicks();
      expect(ticks.map(tick => tick.textContent))
        .toEqual([0, 1, 2, 3, 4].map(step => format(firstTradedAt + step * tenMinutes, 'HH:mm')));
    });

    test('a feed that dies mid-stream tells the user, keeping the last trades', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('charts')} feed={feed}/>);

      await feedIsLive(feed);
      broadcast(feed, [tradeFrame(50001)]);
      expect(await chartsDesk.findOnPriceCard('$50,001.00')).toBeVisible();
      hangUp(feed);
      await waitFor(() =>
        expect(chartsDesk.feedStatus()).toHaveTextContent('live feed unavailable'));
      expect(chartsDesk.onPriceCard('$50,001.00')).toBeVisible();
      expect(chartsDesk.trouble('the live feed hung up mid-stream')).toBeInTheDocument();
    });

    test('a trade whose price is not a number never reaches the user', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('charts')} feed={feed}/>);

      await feedIsLive(feed);
      broadcast(feed, [tradeFrameWith({price: 'not a number', id: 900042}), tradeFrame(50001)]);
      expect(await chartsDesk.findOnPriceCard('$50,001.00')).toBeVisible();
      expect(chartsDesk.onPriceCard('+$0.00')).toBeVisible();
    });

    test('leaving the page closes the socket', async () => {
      const feed = await listeningFeed();

      const {unmount} = render(<TestApp at={demosAt('charts')} feed={feed}/>);

      await feedIsLive(feed);
      await waitFor(() => expect(feed.clients.size).toBe(1));
      unmount();
      await waitFor(() => expect(feed.clients.size).toBe(0));
    });
  });
});

describe('the charts’ headings', () => {
  test('should sit each chart under the live headline on the tab', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('charts', '?charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await chartsDesk.findTitle('live trades', 3)).toBeInTheDocument();
    expect(chartsDesk.title('candles', 3)).toBeInTheDocument();
  });

  test('should sit the chart under its tutorial’s title on its own page', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={chartPageAt('price')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await chartsDesk.findTitle('live trades', 3)).toBeInTheDocument();
  });
  test('should head the live charts Bitcoin, live: every BTC-USD trade on Coinbase', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('charts', '?charts=price')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(chartsDesk.titleIn(await chartsDesk.findChartsTab(), 'Bitcoin, live: every BTC-USD trade on Coinbase', 2)).toBeInTheDocument();
  });
});

describe('the charts tab’s introduction', () => {
  test('should say what it assumes from earlier tabs, linking each tab it names', async () => {
    render(<TestApp at={demosAt('charts')}/>);

    expect(await demoTabs.assumedLinks('Charts')).toEqual([
      ['accordions tab', `${Paths.demos}accordions/`],
      ['z-index tab', `${Paths.demos}z-index/`],
      ['drag sort tab', `${Paths.demos}drag-and-drop/`]
    ]);
  });
});

describe('the workspace story', () => {
  const workspaceStory = async (): Promise<HTMLElement> => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('charts', '?graph=workspace')} feed={feed}/>);
    await feedIsSubscribed(feed);
    return recipeFolds.story(await chartsDesk.findFeatureStories(), 'The trader can lay out the workspace');
  };

  test('should head each step with what happens', async () => {
    expect(recipeFolds.stepTitles(await workspaceStory())).toEqual([
      'Read the charts from the address',
      'A chart swaps once the pointer has moved a third of its height',
      'The arrow keys move a chart, and Delete or Backspace removes it',
      'The last chart can’t be removed'
    ]);
  });
});

describe('the links to other tabs', () => {
  test('should link each term it glosses, and each tab it names, to that tab', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('charts')} feed={feed}/>);
    await feedIsSubscribed(feed);

    const tab = await demoTabs.arrivedOn('Charts');

    expect(demoPage.linksToTabsIn(tab)).toEqual([
      ['accordions tab', `${Paths.demos}accordions/`],
      ['z-index tab', `${Paths.demos}z-index/`],
      ['drag sort tab', `${Paths.demos}drag-and-drop/`],
      ['z-index tab', `${Paths.demos}z-index/`],
      ['accordions tab', `${Paths.demos}accordions/`],
      ['event', `${Paths.demos}z-index/`],
      ['drag sort tab', `${Paths.demos}drag-and-drop/`]
    ]);
  });

  test('should link each term it glosses, and each tab it names, to that tab, on the price chart’s page', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={chartPageAt('price')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(demoPage.linksToTabsIn(demoPage.wholePage())).toEqual([
      ['z-index tab', `${Paths.demos}z-index/`],
      ['z-index tab', `${Paths.demos}z-index/`],
      ['z-index tab', `${Paths.demos}z-index/`],
      ['z-index tab', `${Paths.demos}z-index/`],
      ['z-index tab', `${Paths.demos}z-index/`],
      ['accordions tab', `${Paths.demos}accordions/`]
    ]);
  });

  test('should link each term it glosses, and each tab it names, to that tab, on the candles chart’s page', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={chartPageAt('candles')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(demoPage.linksToTabsIn(demoPage.wholePage())).toEqual([
      ['z-index tab', `${Paths.demos}z-index/`],
      ['z-index tab', `${Paths.demos}z-index/`],
      ['accordions tab', `${Paths.demos}accordions/`],
      ['accordions tab', `${Paths.demos}accordions/`]
    ]);
  });

  test('should link each term it glosses, and each tab it names, to that tab, on the pressure chart’s page', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={chartPageAt('pressure')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(demoPage.linksToTabsIn(demoPage.wholePage())).toEqual([
      ['z-index tab', `${Paths.demos}z-index/`],
      ['accordions tab', `${Paths.demos}accordions/`],
      ['accordions tab', `${Paths.demos}accordions/`]
    ]);
  });

  test('should link each term it glosses, and each tab it names, to that tab, on the pie chart’s page', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={chartPageAt('pie')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(demoPage.linksToTabsIn(demoPage.wholePage())).toEqual([
      ['z-index tab', `${Paths.demos}z-index/`],
      ['accordions tab', `${Paths.demos}accordions/`]
    ]);
  });
});
