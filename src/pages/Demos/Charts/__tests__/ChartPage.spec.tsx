import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {chartPageAt, demoPage, demoTabs, feedIsSubscribed, partsIndex} from '@pages/Demos/__test_support';
import {listeningFeed} from '@pages/Demos/__test_support/feed';
import {outOfReadingOrder} from '@__test_support/reading-order';
import {titleAbove} from '@__test_support/title-above';
import {chartsDesk} from '@pages/Demos/Charts/__test_support';
import {site} from '@pages/__test_support';

describe('a chart’s page', () => {
  test('should sit under the Demos tabs, with Charts current but not the page', async () => {
    render(<TestApp at={chartPageAt('candles')}/>);

    expect(await demoTabs.currentButNotThePage()).toEqual(['Charts']);
  });

  test('should title the page with the tab and the chart', async () => {
    render(<TestApp at={chartPageAt('candles')}/>);

    expect(await demoTabs.title('Demos Charts · Candles')).toBeInTheDocument();
  });

  test('should mark the chart the reader is on as the current page', async () => {
    render(<TestApp at={chartPageAt('candles')}/>);

    const index = await partsIndex.find();

    expect(partsIndex.currentIn(index)).toHaveAccessibleName('Candles');
  });

  test('should say on the chart’s page how long the charts take together', async () => {
    render(<TestApp at={chartPageAt('candles')}/>);

    const page = await chartsDesk.findPage('Candles tutorial');

    expect(await chartsDesk.sizeIn(page)).toHaveTextContent(/about 25 minutes/);
  });

  test('should list the charts once', async () => {
    render(<TestApp at={chartPageAt('candles')}/>);

    await partsIndex.find();

    expect(demoPage.entriesLinking(/Pressure$/)).toHaveLength(1);
  });

  test('should be named apart from the chart it holds, so a reader hears each region once', async () => {
    render(<TestApp at={chartPageAt('candles')}/>);

    await chartsDesk.findPage('Candles tutorial');

    expect(chartsDesk.regionsNamed(/^candles$/i)).toHaveLength(1);
  });

  test('should hold its title in the chart’s own page', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={chartPageAt('price')} feed={feed}/>);
    await feedIsSubscribed(feed);

    const page = await chartsDesk.findPage('Price line tutorial');

    expect(chartsDesk.titleIn(page, 'Price line tutorial', 2)).toBeInTheDocument();
  });

  test('should hold the panel after its title and before its chart', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={chartPageAt('price')} feed={feed}/>);
    await feedIsSubscribed(feed);

    const title = chartsDesk.title('Price line tutorial', 2);
    const index = await partsIndex.find();
    const chart = await chartsDesk.findTitle('live trades', 3);

    expect(outOfReadingOrder([title, index, chart])).toEqual([]);
  });

  test('should leave its chart under the chart’s own title, not under the parts', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={chartPageAt('price')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(titleAbove(await chartsDesk.findTitle('live trades', 3))).toBe('Price line tutorial');
  });

  test('an address naming no chart should say there is no room there', async () => {
    render(<TestApp at={chartPageAt('bars')}/>);

    expect(await site.roomSays('There is no room at this address.')).toBeVisible();
  });
});
