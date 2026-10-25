import {TestApp} from '@__test_support/TestApp';
import {chartPageAt, demosAt, demoTabs} from '@pages/Demos/__test_support';
import {render, waitFor} from '@testing-library/react';
import {broadcast, hangUp, listeningFeed, nonTradeFrame, tradeFrame, tradeFrameWith} from '@pages/Demos/__test_support/feed';
import {feedIsLive, feedIsSubscribed} from '@pages/Demos/__test_support';
import {outOfReadingOrder} from '@__test_support/reading-order';
import {chartsDesk} from '@pages/Demos/Charts/__test_support';
import {explanation, recipeFolds} from '@pages/Demos/Recipe/__test_support';
import {format} from 'date-fns';
import {tradeHistoryRefuses} from '@__test_support/server';
import {blurFocusOnMoves} from '@__test_support/focus';

describe('the charts tutorials’ menus', () => {
  test('should say the + menu is built from the site’s menu components, on the charts tab', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const tutorial = await chartsDesk.findFeatureStories();

    expect(chartsDesk.saysIn(tutorial, /^That menu is built from/)).toHaveTextContent('That menu is built from the site’s Menu, Entry and Item components. A component is a function that writes a piece of the page from what it is given; these write a menu, an li, one item of a list, and a button.');
  });

  test('should say what a class is, and that the page passes Menu the menu’s own, on the charts tab', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const tutorial = await chartsDesk.findFeatureStories();

    expect(chartsDesk.saysIn(tutorial, /^A class is a name on an element/)).toHaveTextContent('A class is a name on an element that a stylesheet’s rules pick out. Item gives its button the shared classes that set its look, and the page passes Menu the menu’s own, as the sample shows.');
  });

  test('should show the page passing Menu its classes beside the + menu’s sentence, on the charts tab', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=charts&graph=workspace')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const story = recipeFolds.story(await chartsDesk.findFeatureStories(), 'The trader can lay out the workspace');
    expect(explanation.everyCodeBeside(story, /^A class is a name on an element/).join()).toMatch(/<Menu [^>]*className="/);
  });

  test('should say the period menu is built from the site’s menu components, on the price chart’s page', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={chartPageAt('price')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await chartsDesk.findSays(/^The period menu is built from/)).toHaveTextContent('The period menu is built from the site’s Menu, Entry and Item components. A component is a function that writes a piece of the page from what it is given; these write a menu, an li, which is one item of a list, and a button.');
  });

  test('should say what a class is, and that the page passes Menu the menu’s look, on the price chart’s page', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={chartPageAt('price')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await chartsDesk.findSays(/^A class is a name written on an element that a stylesheet’s rules pick out\. Item/)).toHaveTextContent('A class is a name written on an element that a stylesheet’s rules pick out. Item gives its button the site’s shared classes that set its look; the menu’s look is the page’s to choose, so the page passes Menu those classes, as the sample shows.');
  });

  test('should show the page passing Menu its classes beside the period menu’s sentence, on the price chart’s page', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={chartPageAt('price', '?graph=price')} feed={feed}/>);
    await chartsDesk.findTitle('price line tutorial', 2);
    const story = recipeFolds.story(document.body, 'The trader can watch the price move, live');
    expect(explanation.everyCodeBeside(story, /^A class is a name written on an element that a stylesheet’s rules pick out\. Item/).join()).toMatch(/<Menu [^>]*className="/);
  });
});

describe('a list of charts', () => {
  test('the trader starts with one chart', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await chartsDesk.findChart('live trades')).toBeVisible();
    expect(chartsDesk.missingChart('candles')).not.toBeInTheDocument();
  });

  test('the trader can add a chart, and it goes to the front of the list', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    await chartsDesk.addChart('Candles');

    const candles = await chartsDesk.findChart('candles');
    const price = chartsDesk.chart('live trades');
    expect(candles.compareDocumentPosition(price)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  test('each chart card names itself in the heading outline', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles,pressure,pie')} feed={feed}/>);
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

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    await chartsDesk.removeFirst();

    expect(chartsDesk.missingChart('live trades')).not.toBeInTheDocument();
    expect(await chartsDesk.findChart('candles')).toBeVisible();
    expect(chartsDesk.deskReport()).toHaveTextContent('Price line removed');
  });

  test('the last chart can be neither removed nor moved', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    expect(chartsDesk.removeOnOffer()).not.toBeInTheDocument();
    expect(chartsDesk.gripOnOffer()).not.toBeInTheDocument();
  });

  test('a chart walked by keyboard takes the focus with it', async () => {
    blurFocusOnMoves();
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
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

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');
    await chartsDesk.choosePeriod('price', 'day');
    await chartsDesk.findPeriodShown('price', 'day');

    await chartsDesk.keys('Price line', 'ArrowDown');

    expect(await chartsDesk.findPeriodShown('price', 'day')).toBeInTheDocument();
    expect(chartsDesk.urlSearch()).toHaveTextContent('charts=candles%2Cprice%3Aday');
  });

  test('a chart walked by keyboard says where it landed', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    await chartsDesk.keys('Price line', 'ArrowDown');

    expect(chartsDesk.deskReport()).toHaveTextContent('Price line moved to 2 of 2');
  });

  test('the delete key removes a chart', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    await chartsDesk.keys('Price line', 'Delete');

    expect(chartsDesk.missingChart('live trades')).not.toBeInTheDocument();
    expect(chartsDesk.deskReport()).toHaveTextContent('Price line removed');
  });

  test('the backspace key removes a chart', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    await chartsDesk.keys('Price line', 'Backspace');

    expect(chartsDesk.missingChart('live trades')).not.toBeInTheDocument();
    expect(chartsDesk.deskReport()).toHaveTextContent('Price line removed');
  });

  test("the chart that takes the removed one's seat takes the focus", async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    await chartsDesk.keys('Price line', 'Delete');

    await waitFor(() => expect(chartsDesk.doorway('Candles')).toHaveFocus());
  });

  test('the chart that is now last takes the focus when the last chart is deleted', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('candles');

    await chartsDesk.keys('Candles', 'Delete');

    await waitFor(() => expect(chartsDesk.doorway('Price line')).toHaveFocus());
  });

  test('the delete key leaves the last chart standing', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('candles');

    await chartsDesk.keys('Candles', 'Delete');

    expect(chartsDesk.chart('candles')).toBeVisible();
  });

  test("a finger pressed on a chart's grip readies the chart to be moved, and lifted leaves it at rest", async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');
    const finger = chartsDesk.fingerOn('Price line');

    await finger.press();
    expect(chartsDesk.slot('Price line')).toHaveAttribute('draggable', 'true');

    await finger.lift();
    expect(chartsDesk.slot('Price line')).not.toHaveAttribute('draggable', 'true');
  });

  test('the workspace tells its story', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&graph=workspace')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    expect(await chartsDesk.findTitle('let’s build this feature')).toBeVisible();
    expect(chartsDesk.says(/the shape of the session/)).toBeVisible();
    const recipe = chartsDesk.recipe('charts');
    expect(recipeFolds.story(recipe, 'The trader can lay out the workspace')).toHaveAttribute('open');
    expect(recipe).toHaveTextContent(/A third of the held chart’s height below the mark, the chart swaps with the one under it/);
    expect(recipe).toHaveTextContent(/export const strayed/);
  });

  test('a chart is a doorway to its own tutorial', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&graph=workspace')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    await chartsDesk.open('Price line');

    expect(await chartsDesk.findRecipe('price line')).toBeVisible();
  });

  test('enter on a chart opens its tutorial', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('candles');

    await chartsDesk.keys('Candles', 'Enter');

    expect(await chartsDesk.findRecipe('candles')).toBeVisible();
    expect(chartsDesk.chart('candles')).toBeVisible();
    expect(await chartsDesk.findSays(/read the same trades as candles/)).toBeVisible();
  });

  test.each([
    ['shows the markup and the dress, not just the arithmetic', ['className="candlesticks"', '.wick {', '.drawn {', '.buy-side {', '.sell-side {', '.side-face {', '.side-wall {', 'className="volumes volume-side"', '.volume-side {']],
    ['stands on its own feet', ['export const bucketTrades', 'export const mergeLive', '<Axes']]
  ])('the candles story %s', async (_claim, shown) => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('candles');
    const recipe = await chartsDesk.walkThrough('Candles', 'build the candles yourself');
    const story = await recipeFolds.press(recipe, 'The trader can read the same trades as candles');

    expect(story).toHaveAttribute('open');
    for (const text of shown) expect(recipe).toHaveTextContent(text);
  });

  test('a story the trader opened folds shut when they press its summary again', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=candles')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('candles');
    const recipe = await chartsDesk.walkThrough('Candles', 'build the candles yourself');
    expect(await recipeFolds.press(recipe, 'The trader can read the same trades as candles')).toHaveAttribute('open');

    const story = await recipeFolds.press(recipe, 'The trader can read the same trades as candles');

    expect(story).not.toHaveAttribute('open');
    expect(chartsDesk.urlSearch()).not.toHaveTextContent('graph=candles');
  });

  test('the trader can add the pressure chart', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);
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

    test('should say I draw the line with SVG rather than reach for a chart library', async () => {
      expect(await priceStory()).toHaveTextContent('I could have reached for a chart library, but this chart is one line and two axes. So I draw the line with SVG, the browser’s own format for shapes, and its points are arithmetic over the trades the page already holds.');
    });

    test('should say the 1,500-trade cap bounds how far back the live part of the charts reaches', async () => {
      expect(await priceStory()).toHaveTextContent('The page keeps only the newest 1,500 trades, because the feed never ends and the page must not grow with it, so the live part of the price line and the candles reaches back as far as those trades do.');
    });

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

    test.each([
      ['charts on the same period agree', 'So two charts set to the same period are drawn from the same candles and cannot disagree.'],
      ['the volume is a second SVG', 'The bars are a second SVG under the candles, in the same slots, so each bar sits under its candle.'],
      ['what each span shows', 'each span of time shows its open, its close, its high and low, and its volume'],
      ['a candle is two shapes and the chart’s wall', 'candleShapes turns each candle into two shapes. The body runs from the open to the close, and the wick, a thin line through the body, runs from the high to the low. The chart adds a third, the wall: a copy of the body moved 1 right and 1.5 down, which gives the body an edge.'],
      ['the classes up and down', 'A class is a name written on an element that a stylesheet’s rules pick out. A candle that closed at or above its open gets the class up, and one that closed lower gets down.'],
      ['what a shared class is', 'Some of what a candle looks like is shared with the rest of the site. A shared class is a look that lives in the site’s shared sheet and that an element wears by name; the chart’s own sheet keeps what is not a look: the chart’s size, the wick’s hairline width and how the shapes move.'],
      ['each candle wears its side, and the wick drawn', 'Each candle wears a side beside its class: a candle that went up wears buy-side and one that went down wears sell-side, shared classes that set a side’s colors. The body wears side-face and the wall side-wall, so the shared sheet paints them, and the wick wears drawn, which gives it its charcoal stroke.'],
      ['the volume bars read volume-side’s custom properties', 'The volume bars wear volume-side with side-face and side-wall. A side’s colors are custom properties, values a stylesheet names once and other rules read, and a side class sets them. volume-side sets leather for the bar and drab for its edge, and the bars read both through side-face and side-wall.']
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
      await chartsDesk.findTitle('pressure tutorial', 2);
      return recipeFolds.story(document.body, 'The trader can see who is driving the move');
    };

    test('should say the chart counts what arrives while the page is open, the newest 1,500 kept, and its caption says so', async () => {
      const story = await pressureStory();

      expect(story).toHaveTextContent('So the chart counts only the trades that arrive while the page is open, and the page keeps the newest 1,500 of those.');
      expect(story).toHaveTextContent('The chart shows up to 60 minutes.');
      expect(story).toHaveTextContent('The caption says how many minutes are on show, up to the last 1,500 trades.');
    });

    test('should not say the pressure count began when you arrived', async () => {
      expect(await pressureStory()).not.toHaveTextContent('the count began when you arrived');
    });

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
      ['the bars wear their sides, which are shared classes', 'The bought bars wear buy-side and the sold bars sell-side. Those are shared classes, looks that live in the site’s shared sheet and that an element wears by name.'],
      ['a side class sets custom properties that the bars read, and the middle line wears drawn', 'A side class sets a side’s colors as custom properties, values a stylesheet names once and other rules read. side-face reads the face color for the bar. side-wall reads the wall color for the second rectangle set just behind it, which gives it an edge. The middle line wears drawn, which gives it its charcoal stroke.']
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
      await chartsDesk.findTitle('pie tutorial', 2);
      return recipeFolds.story(document.body, 'The trader can see who owns the session');
    };

    test('should say the pie sums up to the last 1,500 trades, counted since the page opened', async () => {
      const story = await pieStory();

      expect(story).toHaveTextContent('The pressure chart sums each minute on its own. The pie sums up to the last 1,500 trades as a whole: one slice for the size buyers took and one for the size sellers took.');
      expect(story).toHaveTextContent('like the pressure chart it counts only what has arrived since the page opened.');
      expect(story).toHaveTextContent('One number for each side. The pie asks nothing about time.');
      expect(story).toHaveTextContent('the pie is a pair of totals.');
      expect(story).toHaveTextContent('The caption says what the pie is: the size traded on each side, up to the last 1,500 trades.');
    });

    test('should not say the pie counts the whole visit', async () => {
      expect(await pieStory()).not.toHaveTextContent('whole visit');
    });

    test('should head each step with what happens', async () => {
      expect(recipeFolds.stepTitles(await pieStory())).toEqual([
        'Add up each side',
        'Cut the circle with rotations only',
        'Print each share'
      ]);
    });

    test.each([
      ['the whole pie stays put', 'Each slice is also pushed a little way out from the center, along its own middle, unless it is the whole pie.'],
      ['the half-discs', 'So I make each slice from two half-discs that only ever rotate, and a share is how far they have turned into view.'],
      ['the arc paths', 'I tried arc paths next. An SVG arc carries a flag that flips when the arc passes half the circle, and a flag can’t be moved gradually, so a split that crosses half jumps.'],
      ['what a rotation is', 'A rotation is one angle, and a CSS transition, which moves a property from its old value to its new one over a set time, can move it smoothly; the shape is never rebuilt. So I build the cut from rotation alone.'],
      ['what a class is', 'nothing to give a class, which is a name a stylesheet’s rules pick an element out by, nothing to label, and nothing for a test to find.']
    ])('should say what the code does: %s', async (_claim, sentence) => {
      expect(await pieStory()).toHaveTextContent(sentence);
    });

    test('should not promise the compositor or that no special case survives', async () => {
      expect(await pieStory()).not.toHaveTextContent(/compositor|no special case survives/);
    });

    test('should declare the four numbers the slice reads above it, and say what @property is', async () => {
      const cut = recipeFolds.steps(await pieStory())[1];

      expect(cut).toHaveTextContent(/@property --explode-x \{[^]*@property --explode-y \{[^]*@property --turn \{[^]*@property --swing \{[^]*initial-value: -180deg;[^]*\.slice \{/);
      expect(cut).toHaveTextContent('The sheet declares each one with @property, a rule that gives a custom property a type and a starting value. The turn and the swing are angles, and the push out from the center is two lengths. Before the markup sets them, a slice sits unturned at the center.');
    });

    test('should say what a custom property is where the pie first names it', async () => {
      expect(recipeFolds.steps(await pieStory())[1]).toHaveTextContent('The markup passes each number to the stylesheet as a custom property: a value set by name on the element, such as --turn, and read back in the sheet with var().');
    });
  });

  test('the workspace tutorial names its story and steps in the heading outline', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&graph=workspace')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await chartsDesk.findTitle('The trader can lay out the workspace', 3)).toBeInTheDocument();
    expect(chartsDesk.title('Read the charts from the address', 4)).toBeInTheDocument();
  });

  test('the pressure chart is a doorway to its tutorial', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=pressure')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('pressure');

    await chartsDesk.open('Pressure');

    expect(await chartsDesk.findRecipe('pressure')).toBeVisible();
    expect(await chartsDesk.findSays(/who is driving/)).toBeVisible();
  });

  test('a chart’s tutorial opens like a feature', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={chartPageAt('price')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    const page = chartsDesk.tutorial('price line');
    expect(chartsDesk.titleIn(page, 'let’s build this feature', 3)).toBeVisible();
    expect(chartsDesk.says(/without reading a single digit/)).toBeVisible();
    expect(chartsDesk.says('a trader')).toBeVisible();
    expect(chartsDesk.says(/build the story yourself first/)).toBeVisible();
    const recipe = chartsDesk.recipe('price line');
    expect(recipeFolds.story(recipe, 'The trader can watch the price move, live')).toBeInTheDocument();
  });

  test('the price story teaches the whole journey, data to drawn chart', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={chartPageAt('price', '?graph=price')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    const recipe = chartsDesk.recipe('price line');
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
    await chartsDesk.findChart('pressure');
    const recipe = await chartsDesk.walkThrough('Pressure', 'build the pressure yourself');
    const story = await recipeFolds.press(recipe, 'The trader can see who is driving the move');
    expect(story).toHaveAttribute('open');
    expect(recipe).toHaveTextContent("side: schema.literalUnion('buy', 'sell')");
  });

  test('the charts travel in the url, one of each kind', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=candles,price,price')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await chartsDesk.findChart('candles')).toBeVisible();
    expect(chartsDesk.chartsNamed('live trades')).toHaveLength(1);
  });

  test('the add menu offers only what the desk lacks', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles,pressure')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    expect(chartsDesk.offered('Price line')).not.toBeInTheDocument();
    expect(chartsDesk.offered('Candles')).not.toBeInTheDocument();
    expect(chartsDesk.offered('Pressure')).not.toBeInTheDocument();
  });

  test('a full desk offers no add menu', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=price,candles,pressure')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('live trades');

    await chartsDesk.addChart('Pie');

    await chartsDesk.findChart('pie');
    expect(chartsDesk.addMenu()).not.toBeInTheDocument();
  });

  test('a pie added after trades arrive starts with their shares', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);
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

    render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);
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

  test('the pie is a doorway to who owns the session', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('?tab=charts&charts=pie,price')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await chartsDesk.findChart('pie');
    const recipe = await chartsDesk.walkThrough('Pie', 'build the pie yourself');
    const story = await recipeFolds.press(recipe, 'The trader can see who owns the session');
    expect(story).toHaveAttribute('open');
    expect(recipe).toHaveTextContent('export const sideTotals');
    expect(recipe).toHaveTextContent('export const slices');
    expect(recipe).toHaveTextContent('export const sweepGates');
    expect(chartsDesk.says(/who owns the session/)).toBeVisible();
  });
});

describe('the demos page', () => {
  describe('live trades', () => {
    test('the user watches the latest trades stream in, newest last, measured from the first minute’s close', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);

      await feedIsLive(feed);
      broadcast(feed, [tradeFrame(50000), tradeFrame(50001, 1700000000500), ...[50002, 50003, 50004, 50005].map(price => tradeFrame(price, 1700000060000))]);
      expect(await chartsDesk.findOnPriceCard('$50,005.00')).toBeVisible();
      expect(chartsDesk.onPriceCard('+$4.00')).toBeVisible();
    });

    test('the user reaches the charts from the tab strip', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt()} feed={feed}/>);
      await feedIsSubscribed(feed);

      await demoTabs.open('Charts');

      expect(await chartsDesk.findChart('live trades')).toBeVisible();
    });

    test('trades gathered before the user opens the charts are already waiting', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt()} feed={feed}/>);

      await feedIsSubscribed(feed);
      broadcast(feed, [tradeFrame(50001)]);
      await demoTabs.open('Charts');
      expect(await chartsDesk.findOnPriceCard('$50,001.00')).toBeVisible();
    });

    test('leaving the charts tab and returning keeps the stream alive', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);

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

      render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);
      await feedIsSubscribed(feed);

      await waitFor(() => expect(chartsDesk.feedStatus()).toHaveTextContent(/^live$/));
    });

    test('frames that are not trades never reach the user', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);

      await feedIsLive(feed);
      broadcast(feed, ['not even json', nonTradeFrame(99999), tradeFrame(50001)]);
      expect(await chartsDesk.findOnPriceCard('$50,001.00')).toBeVisible();
      expect(chartsDesk.onPriceCard('+$0.00')).toBeVisible();
    });

    test('a refused feed tells the user the stream is unavailable', async () => {
      const feed = await listeningFeed(true);

      render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);

      await waitFor(() =>
        expect(chartsDesk.feedStatus()).toHaveTextContent('live feed unavailable'));
      expect(chartsDesk.trouble('the live feed refused the handshake')).toBeInTheDocument();
    });

    test('a trade history that cannot be loaded tells the user', async () => {
      tradeHistoryRefuses();
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);

      expect(await chartsDesk.findTrouble('the trade history is having trouble')).toBeInTheDocument();
    });

    test('the user sees the price trend drawn from every recent minute', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);

      await feedIsLive(feed);
      broadcast(feed, [50001, 50002, 50003, 50004, 50005]
        .map((price, minute) => tradeFrame(price, 1700000000000 + minute * 60000)));
      await waitFor(() => expect(chartsDesk.drawnPoints()).toBe(5));
    });

    test('the charts name what they measure', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);
      await feedIsSubscribed(feed);

      expect(await chartsDesk.findTitle(/BTC-USD/)).toBeVisible();
    });

    test('the charts explain what they show', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('?tab=charts&charts=price,candles')} feed={feed}/>);
      await feedIsSubscribed(feed);

      const explainers = await chartsDesk.findExplainers();
      expect(explainers).toHaveLength(2);
      await chartsDesk.press(explainers[0]);
      expect(chartsDesk.says(/price of one bitcoin in US dollars/)).toBeVisible();
      await chartsDesk.press(explainers[1]);
      expect(chartsDesk.says(/how much bitcoin changed hands/)).toBeVisible();
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
      await waitFor(() => expect(chartsDesk.drawnCandles()).toBe(2));
    });

    test('the chart tells the user its price and time range', async () => {
      const feed = await listeningFeed();
      const tenMinutes = 600000;
      const firstTradedAt = Math.ceil(1700000000000 / tenMinutes) * tenMinutes;

      render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);

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

      render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);

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

      render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);

      await feedIsLive(feed);
      broadcast(feed, [tradeFrameWith({price: 'not a number', id: 900042}), tradeFrame(50001)]);
      expect(await chartsDesk.findOnPriceCard('$50,001.00')).toBeVisible();
      expect(chartsDesk.onPriceCard('+$0.00')).toBeVisible();
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

    expect(await chartsDesk.findTitle('live trades', 3)).toBeInTheDocument();
    expect(chartsDesk.title('candles', 3)).toBeInTheDocument();
  });

  test('should sit the chart under its tutorial’s title on its own page', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={chartPageAt('price')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await chartsDesk.findTitle('live trades', 3)).toBeInTheDocument();
  });
});

describe('the charts tab’s introduction', () => {
  const paragraphs = [
    'A live chart draws numbers that are still arriving. The charts on this page follow every trade of bitcoin for US dollars on Coinbase, an exchange where it is bought and sold, as the trades happen.',
    'Drawing is the easy part. The hard parts are in the data. Trades arrive faster than anyone can read them. The past has to be fetched and joined to what is arriving now. And two charts of the same trades must not disagree.',
    'I take a chart to be arithmetic over data the page already holds, so there is no chart library here. The page holds one live feed, a connection that delivers each trade as it happens, and the past, fetched for each period, the stretch of time a chart shows. Each chart is worked out from those every time the page redraws.',
    'By the end you can draw four charts from one feed. The first is a live line. The second is candles, which show where the price opened and closed and how far it reached in each span of time. The last two show who is buying and who is selling. You can also let a reader add, sort and remove charts. The exhibit below starts with one chart, the price line. Press + to add another. The last part of this page builds the workspace the charts sit in.'
  ];

  test('should tell the problem, the page’s view and what a reader can do after, then the live headline, before the workspace', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=charts')} feed={feed}/>);
    await feedIsSubscribed(feed);

    const tab = await chartsDesk.findChartsTab();
    const headline = chartsDesk.titleIn(tab, /^Bitcoin, live/, 2);

    expect(outOfReadingOrder([...paragraphs.map(paragraph => chartsDesk.saysIn(tab, paragraph)), headline])).toEqual([]);
  });
});

describe('the workspace story', () => {
  const workspaceStory = async (): Promise<HTMLElement> => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('?tab=charts&graph=workspace')} feed={feed}/>);
    await feedIsSubscribed(feed);
    return recipeFolds.story(await chartsDesk.findFeatureStories(), 'The trader can lay out the workspace');
  };

  test('should say a chart swaps from where the pointer took hold, and that Delete or Backspace removes it', async () => {
    const story = await workspaceStory();

    expect(story).toHaveTextContent('It swaps with its neighbor once the pointer has moved a third of the chart’s height from where it took hold, up or down, and the neighbor slides into the place it left.');
    expect(story).toHaveTextContent('Delete or Backspace removes it.');
    expect(story).toHaveTextContent('grip and no remove button, and the key does nothing, so the workspace always has a chart.');
  });

  test('should say, in a run of its own, that a name may carry its period after a colon', async () => {
    expect(await workspaceStory()).toHaveTextContent('A name may carry its period after a colon, candles:day; the hour is the default and is left off.');
  });

  test('should head each step with what happens', async () => {
    expect(recipeFolds.stepTitles(await workspaceStory())).toEqual([
      'Read the charts from the address',
      'A chart swaps once the pointer has moved a third of its height',
      'The arrow keys move a chart, and Delete or Backspace removes it',
      'The last chart can’t be removed'
    ]);
  });

  test.each([
    ['the address', 'The page writes every change to the layout into its address: adding a chart, sorting, removing one, and choosing a period. A reload or a shared link needs nothing else to bring the layout back.'],
    ['draggable', 'Sorting uses the browser’s own drag and drop, which HTML turns on with the draggable attribute, a setting written on the element.'],
    ['focus', 'With a chart in focus, meaning it is the one the keyboard is on, the up and down arrows move it one place and focus stays on it.'],
    ['the query string', 'The address’s query string, the part after the question mark, carries a value named charts: a list of chart names with commas between them.'],
    ['dragstart and dragover', 'On dragstart, the event the browser sends when a drag begins, the code marks where the pointer is on the page. On every dragover, the event it sends as the pointer moves over a chart, the code compares the pointer with that mark.'],
    ['where the drag starts', 'A chart is large and the drag starts at its grip. So the swap is measured from the pointer, not from the chart’s far edge.'],
    ['a keyframe animation', 'The neighbor’s slide is a keyframe animation, one whose start is written in an @keyframes rule.'],
    ['which chart cannot be swapped with', 'A chart cannot be swapped with one that is still sliding.'],
    ['the last chart', 'With one chart left there is no grip and no remove button, and Delete or Backspace does nothing. The + is still there.']
  ])('should say %s in plain words', async (_term, sentence) => {
    expect(await workspaceStory()).toHaveTextContent(sentence);
  });

  test('should draw, in step 2, the short chart dropping a tall chart’s height while the pointer stands still', async () => {
    const swap = recipeFolds.steps(await workspaceStory())[1];

    expect(chartsDesk.drawingIn(swap, /^A third from the pointer\./)).toHaveTextContent('The short chart dropped a tall chart’s height while the pointer stood still.');
  });

  test('should say a held chart fades where it sits while the browser draws a copy of it under the pointer', async () => {
    expect(await workspaceStory()).toHaveTextContent('While a chart is held it fades almost to nothing where it sits, and the browser draws a copy of it under the pointer. It swaps with its neighbor once the pointer has moved');
  });

  test('should drop the figures of speech from its words', async () => {
    const words = chartsDesk.toldIn(await workspaceStory());

    expect(words).not.toMatch(/dealt|whispers|slides home|strays|rides|walks|the address is the state|holds its post/);
  });

  test('should say the pointer, never a hand, wherever the drag is told or drawn', async () => {
    expect(await workspaceStory()).not.toHaveTextContent(/\bhand\b/);
  });

  test('should say the card below is the workspace, each chart above opens its own, and name MDN as Mozilla’s web reference', async () => {
    await workspaceStory();

    expect(chartsDesk.says(/^We are going to build this site’s live charts/)).toHaveTextContent('Here is how to use this page: the card below is the workspace, told as a user story. Each chart above opens its own story: click it, or press Enter on it. Open one and you get the plan for that feature and the steps that build it, with the real code from this site, so what you read is what runs. The links go to MDN, Mozilla’s web reference, if you want more.');
    expect(chartsDesk.says(/^If you want the exercise/)).toHaveTextContent('The charts are my interpretation of that; the stories break the interpretation into features. Open one to see how I built it, or to compare it with yours.');
  });
});

describe('the charts’ audited words', () => {
  const tabWith = async (charts: string): Promise<HTMLElement> => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt(`?tab=charts&charts=${charts}`)} feed={feed}/>);
    await feedIsSubscribed(feed);
    return chartsDesk.findChartsTab();
  };

  test('should head the live charts with a colon, not a dash', async () => {
    expect(chartsDesk.titleIn(await tabWith('price'), 'Bitcoin, live: every BTC-USD trade on Coinbase', 2)).toBeInTheDocument();
  });

  test('should explain the price line by its period, its first close and its color', async () => {
    await tabWith('price');

    expect(chartsDesk.chart('live trades')).toHaveTextContent('This measures the price of one bitcoin in US dollars, live. The line is the closing price of each span in the period: the fetched past fills the left, and new trades fold into the newest span as they happen. The dotted line marks the first price in the period, the close of its first candle, and the color shows the trend against it. High and low mark the period’s range; the headline is the latest price paid and how far it has moved. The period menu sets how much time the chart covers. Every period stays live.');
  });

  test('should explain the candles as spans grouped from the same measurement', async () => {
    await tabWith('candles');
    const candles = chartsDesk.chart('candles');

    expect(candles).toHaveTextContent('The same measurement, grouped: each candle summarizes one span of time. The body runs from the first to the last price, green when it rose and orange when it fell. The wick runs from the span’s high to its low.');
    expect(candles).toHaveTextContent('the period menu sets how much time the chart covers.');
  });

});
