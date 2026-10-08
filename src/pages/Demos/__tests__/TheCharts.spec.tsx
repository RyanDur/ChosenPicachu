import {TestApp} from '@__test_support/TestApp';
import {chartPageAt, demosAt, demoTabs, Feed} from '@pages/Demos/__test_support';
import {fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import {broadcast, listeningFeed, nonTradeFrame, tradeFrame, tradeFrameWith} from '@pages/Demos/__test_support/feed';
import {feedIsSubscribed, outOfReadingOrder} from '@pages/Demos/__test_support';
import userEvent from '@testing-library/user-event';
import {chartsDesk} from '@pages/Demos/Charts/__test_support';
import {recipeFolds} from '@pages/Demos/Recipe/__test_support';
import {format} from 'date-fns';
import {tradeHistoryRefuses} from '@__test_support/server';
import {blurFocusOnMoves} from '@__test_support/focus';

const feedIsLive = async (feed: Feed): Promise<void> => {
  await waitFor(() => expect(screen.getByRole('status', {name: 'feed'})).toHaveTextContent(/^live$/));
  await feedIsSubscribed(feed);
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
    await feedIsSubscribed(feed);

    expect(await screen.findByRole('region', {name: 'live trades'})).toBeVisible();
    expect(screen.queryByRole('region', {name: 'candles'})).not.toBeInTheDocument();
  });

  test('the trader can add a chart, and it lands under the hand', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await screen.findByRole('region', {name: 'live trades'});

    await chartsDesk.addChart('Candles');

    const candles = await screen.findByRole('region', {name: 'candles'});
    const price = screen.getByRole('region', {name: 'live trades'});
    expect(candles.compareDocumentPosition(price)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  test('each chart card names itself in the heading outline', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles,pressure,pie')} feed={feed}/>);
    await feedIsSubscribed(feed);

    const candles = await screen.findByRole('region', {name: 'candles'});
    const price = screen.getByRole('region', {name: 'live trades'});
    expect(within(candles).getByRole('heading', {name: 'candles'})).toBeInTheDocument();
    expect(within(price).getByRole('heading', {name: 'live trades'})).toBeInTheDocument();
    expect(within(screen.getByRole('region', {name: 'pressure'})).getByRole('heading', {name: 'pressure'})).toBeInTheDocument();
    expect(within(screen.getByRole('region', {name: 'pie'})).getByRole('heading', {name: 'pie'})).toBeInTheDocument();
  });

  test('the pie’s legend lists each side’s share as an item of its own', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=pie')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const pie = await screen.findByRole('region', {name: 'pie'});
    broadcast(feed, [tradeFrame(50001, Date.now(), '0.30', 'bought'), tradeFrame(50002, Date.now(), '0.10', 'sold')]);

    await waitFor(() => expect(within(within(pie).getByRole('list')).getAllByRole('listitem').map(({textContent}) => textContent)).toEqual(['75% bought', '25% sold']));
  });

  test('the trader can remove a chart', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await screen.findByRole('region', {name: 'live trades'});

    await userEvent.click(screen.getAllByRole('button', {name: 'remove chart'})[0]);

    expect(screen.queryByRole('region', {name: 'live trades'})).not.toBeInTheDocument();
    expect(await screen.findByRole('region', {name: 'candles'})).toBeVisible();
    expect(screen.getByRole('status', {name: 'desk report'})).toHaveTextContent('Price line removed');
  });

  test('the last chart can be neither removed nor moved', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await screen.findByRole('region', {name: 'live trades'});

    expect(screen.queryByRole('button', {name: 'remove chart'})).not.toBeInTheDocument();
    expect(screen.queryByRole('button', {name: 'move chart', hidden: true})).not.toBeInTheDocument();
  });

  test('a chart walked by keyboard takes the focus with it', async () => {
    blurFocusOnMoves();
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
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
    await feedIsSubscribed(feed);
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
    await feedIsSubscribed(feed);
    await screen.findByRole('region', {name: 'live trades'});

    await chartsDesk.keys('Price line', 'ArrowDown');

    expect(screen.getByRole('status', {name: 'desk report'})).toHaveTextContent('Price line moved to 2 of 2');
  });

  test('the delete key removes a chart', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await screen.findByRole('region', {name: 'live trades'});

    await chartsDesk.keys('Price line', 'Delete');

    expect(screen.queryByRole('region', {name: 'live trades'})).not.toBeInTheDocument();
    expect(screen.getByRole('status', {name: 'desk report'})).toHaveTextContent('Price line removed');
  });

  test("the chart that takes the removed one's seat takes the focus", async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await screen.findByRole('region', {name: 'live trades'});

    await chartsDesk.keys('Price line', 'Delete');

    await waitFor(() => expect(chartsDesk.doorway('Candles')).toHaveFocus());
  });

  test('the chart that is now last takes the focus when the last chart is deleted', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await screen.findByRole('region', {name: 'candles'});

    await chartsDesk.keys('Candles', 'Delete');

    await waitFor(() => expect(chartsDesk.doorway('Price line')).toHaveFocus());
  });

  test('the delete key leaves the last chart standing', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await screen.findByRole('region', {name: 'candles'});

    await chartsDesk.keys('Candles', 'Delete');

    expect(screen.getByRole('region', {name: 'candles'})).toBeVisible();
  });

  test("a finger pressed on a chart's grip readies the chart to be moved, and lifted leaves it at rest", async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await screen.findByRole('region', {name: 'live trades'});
    const finger = userEvent.setup();
    const grip = within(chartsDesk.slot('Price line')).getByRole('button', {name: 'move chart', hidden: true});

    await finger.pointer({keys: '[TouchA>]', target: grip});
    expect(chartsDesk.slot('Price line')).toHaveAttribute('draggable', 'true');

    await finger.pointer({keys: '[/TouchA]', target: grip});
    expect(chartsDesk.slot('Price line')).not.toHaveAttribute('draggable', 'true');
  });

  test("a finger pressed on a chart's grip and taken over by the browser leaves the chart at rest", async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await screen.findByRole('region', {name: 'live trades'});
    const grip = within(chartsDesk.slot('Price line')).getByRole('button', {name: 'move chart', hidden: true});

    await userEvent.pointer({keys: '[TouchA>]', target: grip});
    fireEvent.pointerCancel(grip, {pointerType: 'touch'});

    expect(chartsDesk.slot('Price line')).not.toHaveAttribute('draggable', 'true');
  });

  test('the trader can drag a chart to a new seat', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await screen.findByRole('region', {name: 'live trades'});
    await chartsDesk.dragChart('Price line', 'Candles', 100);

    expect(within(chartsDesk.seat(1)).getByRole('region', {name: 'candles'})).toBeVisible();

    chartsDesk.releaseDrag('Price line');

    expect(within(chartsDesk.seat(1)).getByRole('region', {name: 'candles'})).toBeVisible();
    expect(within(chartsDesk.seat(2)).getByRole('region', {name: 'live trades'})).toBeVisible();
  });

  test('the workspace tells its story', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&graph=workspace')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await screen.findByRole('region', {name: 'live trades'});

    expect(await screen.findByRole('heading', {name: 'let’s build this feature'})).toBeVisible();
    expect(screen.getByText(/the shape of the session/)).toBeVisible();
    const recipe = screen.getByRole('region', {name: 'build the charts yourself'});
    expect(recipeFolds.story(recipe, 'The trader can lay out the workspace')).toHaveAttribute('open');
    expect(recipe).toHaveTextContent(/A third of the held chart’s height below the mark, the chart swaps with the one under it/);
    expect(recipe).toHaveTextContent(/export const strayed/);
  });

  test('a chart is a doorway to its own tutorial', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&graph=workspace')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await screen.findByRole('region', {name: 'live trades'});

    await userEvent.click(chartsDesk.doorway('Price line'));

    expect(await screen.findByRole('region', {name: 'build the price line yourself'})).toBeVisible();
  });

  test('enter on a chart opens its tutorial', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await screen.findByRole('region', {name: 'candles'});

    chartsDesk.doorway('Candles').focus();
    await userEvent.keyboard('{Enter}');

    expect(await screen.findByRole('region', {name: 'build the candles yourself'})).toBeVisible();
    expect(screen.getByRole('region', {name: 'candles'})).toBeVisible();
    expect(await screen.findByText(/read the same trades as candles/)).toBeVisible();
  });

  test.each([
    ['shows the markup and the dress, not just the arithmetic', ['className="candlesticks"', '.wick {', '.drawn {', '.buy-side {', '.sell-side {', '.side-face {', '.side-wall {', 'className="volumes volume-side"', '.volume-side {']],
    ['stands on its own feet', ['export const bucketTrades', 'export const mergeLive', '<Axes']]
  ])('the candles story %s', async (_claim, shown) => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await screen.findByRole('region', {name: 'candles'});
    const recipe = await chartsDesk.walkThrough('Candles', 'build the candles yourself');
    const story = await recipeFolds.press(recipe, 'The trader can read the same trades as candles');

    expect(story).toHaveAttribute('open');
    for (const text of shown) expect(recipe).toHaveTextContent(text);
  });

  test('a story the trader opened folds shut when they press its summary again', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
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
    await feedIsSubscribed(feed);
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
    expect(screen.getByRole('heading', {name: 'Open a socket, and keep only what decodes', level: 5})).toBeInTheDocument();
  });

  describe('the price line’s story', () => {
    const priceStory = async (): Promise<HTMLElement> => {
      const feed = await listeningFeed();
      render(<TestApp at={chartPageAt('price', '?graph=price')} feed={feed}/>);
      await screen.findByRole('heading', {name: 'price line tutorial', level: 2});
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

    test.each([
      ['the popover is taught on the z-index tab', 'It is a popover, the kind of menu the z-index tab explains.'],
      ['the three periods', 'The hour has candles of a minute, 60 of them, marked every ten minutes. The day has candles of an hour, 24 of them, marked every hour. The week has candles of six hours, 28 of them, marked every day.'],
      ['only the dot moves', 'Nothing on the page is measured, and the line is never animated: it is drawn again. Only the dot on the newest point moves, sliding to its new place over 300 milliseconds.'],
      ['the three price labels', 'At the side it labels the highest price, the lowest, and the one midway between them.'],
      ['what is stored', 'The page stores the trades and the fetched candles. The candles made from live trades, the joined series and the points are not stored: every time React redraws the chart, they are worked out again.']
    ])('should say what the code does: %s', async (_claim, sentence) => {
      expect(await priceStory()).toHaveTextContent(sentence);
    });
  });

  describe('the candles’ story', () => {
    const candlesStory = async (): Promise<HTMLElement> => {
      const feed = await listeningFeed();
      render(<TestApp at={chartPageAt('candles', '?graph=candles')} feed={feed}/>);
      await screen.findByRole('heading', {name: 'candles tutorial', level: 2});
      return recipeFolds.story(document.body, 'The trader can read the same trades as candles');
    };

    test('should head each step with what happens', async () => {
      expect(recipeFolds.stepTitles(await candlesStory())).toEqual([
        'Make the candles the way the price line does',
        'Draw each candle as a body and a wick',
        'Draw the volume under each candle',
        'Use the same axes'
      ]);
    });

    test.each([
      ['charts on the same period agree', 'So two charts set to the same period are drawn from the same candles and cannot disagree.'],
      ['the volume is a second SVG', 'The bars are a second SVG under the candles, in the same slots, so each bar sits under its candle.'],
      ['what each span shows', 'each span of time shows its open, its close, its high and low, and its volume'],
      ['a candle is three shapes', 'candleShapes turns each candle into three shapes. The body runs from the open to the close, and a second rectangle, the wall, sits just behind it and gives it an edge. The wick, a thin line through the body, runs from the high to the low.'],
      ['the classes up and down', 'A candle that closed at or above its open gets the class up, and one that closed lower gets down.'],
      ['what a shared class is', 'Some of what a candle looks like is shared with the rest of the site. A shared class is a look that lives in the site’s shared sheet and that an element wears by name; the chart’s own sheet keeps the structure.'],
      ['each candle wears its side, and the wick drawn', 'Each candle wears a side with its state, buy-side or sell-side, a shared class that sets a side’s colours. The body wears side-face and the wall side-wall, so the shared sheet paints them, and the wick wears drawn, which gives it its charcoal stroke; the chart’s sheet gives the wick its hairline width.'],
      ['the volume bars read volume-side’s custom properties', 'The volume bars wear volume-side with side-face and side-wall. A side’s colours travel as custom properties, values a stylesheet names once and other rules read, and a side class sets them: volume-side sets leather for the bar and drab for its edge, and the bars read them through side-face and side-wall.']
    ])('should say what the code does: %s', async (_claim, sentence) => {
      expect(await candlesStory()).toHaveTextContent(sentence);
    });

    test('should not claim one history for every chart', async () => {
      expect(await candlesStory()).not.toHaveTextContent(/one stream and one history/);
    });
  });

  describe('the pressure chart’s story', () => {
    const pressureStory = async (): Promise<HTMLElement> => {
      const feed = await listeningFeed();
      render(<TestApp at={chartPageAt('pressure', '?graph=pressure')} feed={feed}/>);
      await screen.findByRole('heading', {name: 'pressure tutorial', level: 2});
      return recipeFolds.story(document.body, 'The trader can see who is driving the move');
    };

    test('should head each step with what happens', async () => {
      expect(recipeFolds.stepTitles(await pressureStory())).toEqual([
        'Sum each minute by who took the trade',
        'Scale both sides by the larger one',
        'Draw the bars, and label them in bitcoin'
      ]);
    });

    test.each([
      ['what Coinbase’s mark means', 'Coinbase marks the waiting order’s side, so a buyer took the trade when the mark is sell.'],
      ['the bars grow', 'When a minute’s sums change, its bars grow to their new size over 300 milliseconds.'],
      ['the bars wear their sides and the middle line drawn', 'The bought bars wear buy-side and the sold bars sell-side, shared classes, looks that live in the site’s shared sheet and that an element wears by name, which set a side’s colours; side-face on the bar and side-wall on the second rectangle set just behind it, which gives it an edge, read them. The middle line wears drawn, which gives it its charcoal stroke.']
    ])('should say what the code does: %s', async (_claim, sentence) => {
      expect(await pressureStory()).toHaveTextContent(sentence);
    });

    test('should not say a match names its taker’s side', async () => {
      expect(await pressureStory()).not.toHaveTextContent(/names its taker’s side/);
    });
  });

  describe('the pie’s story', () => {
    const pieStory = async (): Promise<HTMLElement> => {
      const feed = await listeningFeed();
      render(<TestApp at={chartPageAt('pie', '?graph=pie')} feed={feed}/>);
      await screen.findByRole('heading', {name: 'pie tutorial', level: 2});
      return recipeFolds.story(document.body, 'The trader can see who owns the session');
    };

    test('should head each step with what happens', async () => {
      expect(recipeFolds.stepTitles(await pieStory())).toEqual([
        'Add up each side',
        'Cut the circle with rotations only',
        'Print each share'
      ]);
    });

    test.each([
      ['the whole pie stays put', 'Each slice is also pushed a little way out from the centre, along its own middle, unless it is the whole pie.'],
      ['what a rotation is', 'A rotation asks for less: the shape stays the same, and only where it is drawn changes.']
    ])('should say what the code does: %s', async (_claim, sentence) => {
      expect(await pieStory()).toHaveTextContent(sentence);
    });

    test('should not promise the compositor or that no special case survives', async () => {
      expect(await pieStory()).not.toHaveTextContent(/compositor|no special case survives/);
    });

    test('should declare the four numbers the slice reads above it, and say what @property is', async () => {
      const cut = recipeFolds.steps(await pieStory())[1];

      expect(cut).toHaveTextContent(/@property --explode-x \{[^]*@property --explode-y \{[^]*@property --turn \{[^]*@property --swing \{[^]*initial-value: -180deg;[^]*\.slice \{/);
      expect(cut).toHaveTextContent('The sheet declares each one with @property, a rule that gives a custom property a type and a starting value. The turn and the swing are angles, and the push out from the centre is two lengths. Before the markup sets them, a slice sits unturned at the centre.');
    });

    test('should say what a custom property is where the pie first names it', async () => {
      expect(recipeFolds.steps(await pieStory())[1]).toHaveTextContent('The markup hands each number to the stylesheet as a custom property: a value set by name on the element, such as --turn, and read back in the sheet with var().');
    });
  });

  test('the workspace tutorial names its story and steps in the heading outline', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&graph=workspace')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await screen.findByRole('heading', {name: 'The trader can lay out the workspace', level: 3})).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: 'Read the charts from the address', level: 4})).toBeInTheDocument();
  });

  test('the pressure chart is a doorway to its tutorial', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=pressure')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await screen.findByRole('region', {name: 'pressure'});

    await userEvent.click(chartsDesk.doorway('Pressure'));

    expect(await screen.findByRole('region', {name: 'build the pressure yourself'})).toBeVisible();
    expect(await screen.findByText(/who is driving/)).toBeVisible();
  });

  test('a chart’s tutorial opens like a feature', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={chartPageAt('price')} feed={feed}/>);
    await feedIsSubscribed(feed);
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
    await feedIsSubscribed(feed);
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

  test('the pressure story proves the side is a fact, not a guess', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=pressure')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await screen.findByRole('region', {name: 'pressure'});
    const recipe = await chartsDesk.walkThrough('Pressure', 'build the pressure yourself');
    const story = await recipeFolds.press(recipe, 'The trader can see who is driving the move');
    expect(story).toHaveAttribute('open');
    expect(recipe).toHaveTextContent("side: schema.literalUnion('buy', 'sell')");
  });

  test('the charts travel in the url, one of each kind', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=candles,price,price')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await screen.findByRole('region', {name: 'candles'})).toBeVisible();
    expect(screen.getAllByRole('region', {name: 'live trades'})).toHaveLength(1);
  });

  test('the add menu offers only what the desk lacks', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles,pressure')} feed={feed}/>);
    await feedIsSubscribed(feed);
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
    await feedIsSubscribed(feed);
    await screen.findByRole('region', {name: 'live trades'});

    await chartsDesk.addChart('Pie');

    await screen.findByRole('region', {name: 'pie'});
    expect(chartsDesk.addMenu()).not.toBeInTheDocument();
  });

  test('an added chart says so', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await screen.findByRole('region', {name: 'live trades'});

    await chartsDesk.addChart('Pie');

    await screen.findByRole('region', {name: 'pie'});
    expect(screen.getByRole('status', {name: 'desk report'})).toHaveTextContent('Pie added');
  });

  test('a doorway that leads nowhere returns the trader to the workspace', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={chartPageAt('bogus')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await screen.findByRole('heading', {name: /BTC-USD/})).toBeVisible();
    expect(screen.queryByRole('article', {name: /tutorial/})).not.toBeInTheDocument();
  });

  test('the pie is a doorway to who owns the session', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=pie,price')} feed={feed}/>);
    await feedIsSubscribed(feed);
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

      await feedIsLive(feed);
      broadcast(feed, [50001, 50002, 50003, 50004, 50005].map(price => tradeFrame(price)));
      expect(await within(priceCard()).findByText('$50,005.00')).toBeVisible();
      expect(within(priceCard()).getByText('+$4.00')).toBeVisible();
    });

    test('the user reaches the charts from the tab strip', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt()} feed={feed}/>);
      await feedIsSubscribed(feed);

      await demoTabs.open('Charts');

      expect(await screen.findByRole('region', {name: 'live trades'})).toBeVisible();
    });

    test('trades gathered before the user opens the charts are already waiting', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt()} feed={feed}/>);

      await feedIsSubscribed(feed);
      broadcast(feed, [tradeFrame(50001)]);
      await demoTabs.open('Charts');
      expect(await within(priceCard()).findByText('$50,001.00')).toBeVisible();
    });

    test('leaving the charts tab and returning keeps the stream alive', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);

      await feedIsLive(feed);
      broadcast(feed, [tradeFrame(50001)]);
      expect(await within(priceCard()).findByText('$50,001.00')).toBeVisible();
      const opened = feed.connections();
      await demoTabs.open('Accordions');
      await demoTabs.open('Charts');
      expect(await within(priceCard()).findByText('$50,001.00')).toBeVisible();
      expect(feed.connections()).toBe(opened);
    });

    test('a connected feed tells the user the stream is live', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);
      await feedIsSubscribed(feed);

      await waitFor(() => expect(screen.getByRole('status', {name: 'feed'})).toHaveTextContent(/^live$/));
    });

    test('frames that are not trades never reach the user', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);

      await feedIsLive(feed);
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

      await feedIsLive(feed);
      broadcast(feed, [50001, 50002, 50003, 50004, 50005]
        .map((price, minute) => tradeFrame(price, 1700000000000 + minute * 60000)));
      await waitFor(() => expect(drawnPoints()).toBe(5));
    });

    test('the charts name what they measure', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);
      await feedIsSubscribed(feed);

      expect(await screen.findByRole('heading', {name: /BTC-USD/})).toBeVisible();
    });

    test('the charts explain what they show', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
      await feedIsSubscribed(feed);

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

      await feedIsLive(feed);
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

      await feedIsLive(feed);
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

      await feedIsLive(feed);
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

      await feedIsLive(feed);
      broadcast(feed, [tradeFrameWith({price: 'not a number', id: 900042}), tradeFrame(50001)]);
      expect(await within(priceCard()).findByText('$50,001.00')).toBeVisible();
      expect(within(priceCard()).getByText('+$0.00')).toBeVisible();
    });

    test('leaving the page closes the socket', async () => {
      const feed = await listeningFeed();

      const {unmount} = render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);

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
    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await screen.findByRole('heading', {level: 4, name: 'live trades'})).toBeInTheDocument();
    expect(screen.getByRole('heading', {level: 4, name: 'candles'})).toBeInTheDocument();
  });

  test('should sit the chart under its tutorial’s title on its own page', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={chartPageAt('price')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await screen.findByRole('heading', {level: 3, name: 'live trades'})).toBeInTheDocument();
  });
});

describe('the charts tab’s introduction', () => {
  const paragraphs = [
    'A live chart draws numbers that are still arriving. The charts on this page follow every trade of bitcoin for US dollars on Coinbase, an exchange where it is bought and sold, as the trades happen.',
    'Drawing is the easy part. The hard parts are in the data. Trades arrive faster than anyone can read them. The past has to be fetched and joined to what is arriving now. And two charts of the same trades must not disagree.',
    'This page’s view is that a chart is arithmetic over data the page already holds, so there is no chart library here. The page holds one live feed, a connection that delivers each trade as it happens, and the past, fetched for each period a chart shows. Each chart is worked out from those every time the page redraws. The layout is kept in the page’s address, so a reload or a shared link brings back the same charts in the same order.',
    'By the end you can draw a live line chart, candles, which show how the price opened, closed and reached in each span of time, and two charts of who is buying and who is selling, all from one feed. You can also let a reader add, sort and remove charts. The exhibit below starts with one chart, the price line. Press + to add another, and press a chart to open the steps that build it. The last part of this page builds the workspace the charts sit in.'
  ];

  test('should name the tab Charts, put the live headline under it, and tell the problem, the page’s view and what a reader can do after, before the workspace', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);
    await feedIsSubscribed(feed);

    const tab = await screen.findByRole('region', {name: 'Charts'});
    const headline = within(tab).getByRole('heading', {level: 3, name: /^Bitcoin, live/});

    expect(within(tab).getAllByRole('heading', {level: 2})[0]).toHaveTextContent(/^Charts$/);
    expect(outOfReadingOrder([...paragraphs.map(paragraph => within(tab).getByText(paragraph)), headline])).toEqual([]);
  });
});

describe('the workspace story', () => {
  const workspaceStory = async (): Promise<HTMLElement> => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=charts&graph=workspace')} feed={feed}/>);
    await feedIsSubscribed(feed);
    return recipeFolds.story(await screen.findByRole('region', {name: 'let’s build this feature'}), 'The trader can lay out the workspace');
  };

  test('should head each step with what happens', async () => {
    expect(recipeFolds.stepTitles(await workspaceStory())).toEqual([
      'Read the charts from the address',
      'A chart swaps once the hand has moved a third of its height',
      'The arrow keys move a chart, and Delete removes it',
      'The last chart can’t be removed'
    ]);
  });

  test.each([
    ['the address', 'Adding a chart, sorting, removing one and choosing a period are each written into the page’s address. That is all a reload or a shared link needs to bring the layout back.'],
    ['draggable', 'Sorting uses the browser’s own drag and drop, which HTML turns on with the draggable attribute, a setting written on the element.'],
    ['focus', 'With a chart in focus, meaning it is the one the keyboard is on, the up and down arrows move it one place and focus stays on it.'],
    ['the query string', 'The address’s query string, the part after the question mark, carries a value named charts: a list of chart names with commas between them.'],
    ['dragstart and dragover', 'On dragstart, the event the browser sends when a drag begins, the code marks where the hand is on the page. On every dragover, the event it sends as the hand moves over a chart, the code compares the hand with that mark.'],
    ['a keyframe animation', 'The neighbour’s slide is a keyframe animation, one whose start is written in an @keyframes rule.'],
    ['which chart cannot be swapped with', 'A chart cannot be swapped with one that is still sliding.'],
    ['the last chart', 'With one chart left there is no grip and no remove button, and Delete does nothing. The + is still there.']
  ])('should say %s in plain words', async (_term, sentence) => {
    expect(await workspaceStory()).toHaveTextContent(sentence);
  });

  test('should draw the mark moving to the hand in step 2', async () => {
    const swap = recipeFolds.steps(await workspaceStory())[1];

    expect(within(swap).getByRole('figure', {name: /^A third from the hand\./})).toHaveTextContent(/the mark moves to where the hand is/);
  });

  test('should say a held chart fades where it sits while the browser draws a copy of it under the hand', async () => {
    expect(await workspaceStory()).toHaveTextContent('While a chart is held it fades almost to nothing where it sits, and the browser draws a copy of it under the hand. It swaps with its neighbour');
  });

  test('should drop the figures of speech from its words', async () => {
    const words = within(await workspaceStory()).getAllByRole('paragraph').map(paragraph => paragraph.textContent).join(' ');

    expect(words).not.toMatch(/dealt|whispers|slides home|strays|rides|walks|the address is the state|holds its post/);
  });

  test('should say each chart opens its own tutorial, and name MDN as Mozilla’s web reference', async () => {
    await workspaceStory();

    expect(screen.getByText(/Each chart above opens its own tutorial: click it, or press Enter on it\. The links go to MDN, Mozilla’s web reference, if you want more\./)).toBeInTheDocument();
  });
});
