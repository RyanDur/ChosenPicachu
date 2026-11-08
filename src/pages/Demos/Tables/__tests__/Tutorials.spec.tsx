import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {Paths} from '@navigation';
import {demoPage} from '@pages/Demos/__test_support';
import {tablesTab} from '@pages/Demos/Tables/__test_support';
import {Tutorials} from '../Tutorials';

describe('the table tutorials', () => {
  test('should head the recipe’s walk from need to design', async () => {
    render(<TestApp at="/"><Tutorials/></TestApp>);
    await demoPage.findTitle('let’s build this feature');

    expect(demoPage.title('let’s build this feature')).toBeVisible();
    expect(demoPage.title('Start with the need, and let it pick the element')).toBeVisible();
    expect(demoPage.title('The trader can watch the live market in windows they arrange')).toBeVisible();
    expect(tablesTab().columnHeader('what it tells you')).toBeVisible();
    expect(demoPage.row(/keep themselves current/)).toBeVisible();
    expect(demoPage.title('Sketch a design from the need')).toBeVisible();
    expect(demoPage.unanswered('what a design cannot tell you')).toBeVisible();
  });

  test('the recipe’s tables name their rows and columns', async () => {
    render(<TestApp at="/"><Tutorials/></TestApp>);
    await demoPage.findTitle('let’s build this feature');

    const clues = tablesTab().table('the clues');
    expect(clues.columns).toHaveLength(2);
    expect(clues.rows).toHaveLength(5);
    const layers = tablesTab().table('the layers');
    expect(layers.columns).toHaveLength(4);
    expect(layers.rows).toHaveLength(4);
    expect(tablesTab().columnsIn('Sketch a design from the need')).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
    const sketch = tablesTab().headersIn('Sketch a design from the need');
    expect(sketch.rows).toHaveLength(5);
  });

  test('the slices point at their stations', async () => {
    render(<TestApp at="/"><Tutorials/></TestApp>);
    await demoPage.findTitle('let’s build this feature');

    expect(demoPage.title('Slice the design into stories')).toBeVisible();
    expect(demoPage.sliceLinks()).toEqual(['#station-4', '#station-5', '#station-6', '#station-6', '#station-6']);
    expect(demoPage.sliceLinksLandingNowhere()).toEqual([]);
  });

  test('should head the layers with both their axes', async () => {
    render(<TestApp at="/"><Tutorials/></TestApp>);
    await demoPage.findTitle('let’s build this feature');

    expect(demoPage.title('Layer on functionality, in the order it was asked for')).toBeVisible();
    expect(tablesTab().columnHeader('by keyboard')).toBeVisible();
    expect(demoPage.row('Widen a column')).toBeVisible();
  });

  test('should link each term it glosses, and each tab it names, to that tab', async () => {
    render(<TestApp at="/"><Tutorials/></TestApp>);
    await demoPage.findTitle('let’s build this feature');

    expect(demoPage.linksToTabs()).toEqual([
      ['z-index tab', `${Paths.demos}z-index/`],
      ['z-index tab', `${Paths.demos}z-index/`],
      ['accordions tab', `${Paths.demos}accordions/`],
      ['z-index tab', `${Paths.demos}z-index/`]
    ]);
  });

});
