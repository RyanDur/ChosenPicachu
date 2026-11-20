import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {chartPageAt, demoPage, demosAt, demoTabs, feedIsSubscribed, partsIndex} from '@pages/Demos/__test_support';
import {listeningFeed} from '@pages/Demos/__test_support/feed';
import {outOfReadingOrder} from '@__test_support/reading-order';
import {chartPage, chartsDesk} from '@pages/Demos/Charts/__test_support';
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

  test('should lead to another tab from its row of tabs', async () => {
    render(<TestApp at={chartPageAt('candles')}/>);

    await demoTabs.open('Tables');

    expect(await site.titled('Demos Tables')).toBeInTheDocument();
  });

  test('should hold the four charts beside it, as the tab does', async () => {
    render(<TestApp at={chartPageAt('candles')}/>);

    const index = await partsIndex.find();

    expect(chartPage.partsIn(index)).toEqual([
      ['Price line', chartPageAt('price')],
      ['Candles', chartPageAt('candles')],
      ['Pressure', chartPageAt('pressure')],
      ['Pie', chartPageAt('pie')]
    ]);
  });

  test('should mark the chart the reader is on as the current page', async () => {
    render(<TestApp at={chartPageAt('candles')}/>);

    const index = await partsIndex.find();

    expect(partsIndex.currentIn(index)).toHaveAccessibleName('Candles');
  });

  test('should say beside the chart how long the charts take together', async () => {
    render(<TestApp at={chartPageAt('candles')}/>);

    expect(await demoPage.panel('parts and minutes')).toHaveTextContent(/about 25 minutes/);
  });

  test('should list the charts once', async () => {
    render(<TestApp at={chartPageAt('candles')}/>);

    await partsIndex.find();

    expect(demoPage.entriesLinking(/Pressure$/)).toHaveLength(1);
  });

  test('should hold the panel after its title and before its chart', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={chartPageAt('price')} feed={feed}/>);
    await feedIsSubscribed(feed);

    const panel = await demoPage.panel('parts and minutes');
    const chart = await chartsDesk.findTitle('live trades', 3);

    expect(outOfReadingOrder([panel, chart])).toEqual([]);
  });

  test('an address naming no chart should say there is no room there', async () => {
    render(<TestApp at={chartPageAt('bars')}/>);

    expect(await site.roomSays('There is no room at this address.')).toBeVisible();
  });
});

describe('the charts tab’s panel', () => {
  test('should say how long the charts take together', async () => {
    render(<TestApp at={demosAt('charts')}/>);

    expect(await demoPage.panel('parts and minutes')).toHaveTextContent(/about 25 minutes/);
  });
});
