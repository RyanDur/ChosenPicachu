import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {outOfReadingOrder} from '@__test_support/reading-order';
import {chartPageAt, demoPage, demosAt, feedIsSubscribed, partsIndex} from '@pages/Demos/__test_support';
import {listeningFeed} from '@pages/Demos/__test_support/feed';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {chartPage, chartsDesk} from '@pages/Demos/Charts/__test_support';
import {chartKinds} from '@pages/Demos/Charts/chart-kinds';

describe('the charts parts list', () => {
  test('should list the four charts in order, each a link to its page', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('charts')} feed={feed}/>);
    await feedIsSubscribed(feed);

    const index = await partsIndex.find();

    expect(chartPage.partsIn(index)).toEqual([
      ['Price line', chartPageAt('price')],
      ['Candles', chartPageAt('candles')],
      ['Pressure', chartPageAt('pressure')],
      ['Pie', chartPageAt('pie')]
    ]);
  });

  test('should come after the size line, and before the opening, the live chart and the workspace story', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('charts')} feed={feed}/>);
    await feedIsSubscribed(feed);

    const index = await partsIndex.list();

    expect(outOfReadingOrder([await chartsDesk.size(), index, await chartsDesk.opening(),
      await chartsDesk.findChartList(), await chartsDesk.findFeatureStories()])).toEqual([]);
  });

  test('should say on its tab that the four parts take about 25 minutes', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('charts')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await demoPage.findSays('Four parts, about 25 minutes.')).toBeInTheDocument();
  });

  test('should give the price line its minutes, as 8 min', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('charts')} feed={feed}/>);
    await feedIsSubscribed(feed);

    const entry = partsIndex.entryOf(await partsIndex.find(), 'Price line');

    expect(explanation.saying(entry, '8 min')).toBeInTheDocument();
  });

  test('should say under candles what its part is about', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('charts')} feed={feed}/>);
    await feedIsSubscribed(feed);

    const entry = partsIndex.entryOf(await partsIndex.find(), 'Candles');

    expect(explanation.saying(entry, chartKinds.told.candles.says)).toBeInTheDocument();
  });
});
