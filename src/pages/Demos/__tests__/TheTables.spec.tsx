import {TestApp} from '@__test_support/TestApp';
import {Paths} from '@pages/Paths';
import {itemHeadedBy} from '@__test_support/headed-item';
import {demoPage, demosAt, demoTabs, feedIsSubscribed} from '@pages/Demos/__test_support';
import {render, waitFor} from '@testing-library/react';
import {listeningFeed} from '@pages/Demos/__test_support/feed';
import {recipeFolds} from '@pages/Demos/Recipe/__test_support';
import {aggregations, tableControls, tablesTab} from '@pages/Demos/Tables/__test_support';

describe('the tables tab’s links out', () => {
  test('should link the resize step’s :has() to MDN', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('tables', '?tut=resize')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await tablesTab.linkIn('drag resize', ':has()')).toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/CSS/:has');
  });
});

describe('the tables demo', () => {
  test('should head the recipe’s walk from need to design', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await tablesTab.recipe('drag sort');

    expect(demoPage.title('let’s build this feature')).toBeVisible();
    expect(demoPage.title('Start with the need, and let it pick the element')).toBeVisible();
    expect(demoPage.title('The trader can watch the live market in windows they arrange')).toBeVisible();
    expect(tablesTab.columnHeader('what it tells you')).toBeVisible();
    expect(demoPage.row(/keep themselves current/)).toBeVisible();
    expect(demoPage.title('Sketch a design from the need')).toBeVisible();
    expect(demoPage.unanswered('what a design cannot tell you')).toBeVisible();
  });

  test('the recipe’s tables name their rows and columns', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await tablesTab.recipe('drag sort');

    const clues = tablesTab.table('the clues');
    expect(clues.columns).toHaveLength(2);
    expect(clues.rows).toHaveLength(5);
    const layers = tablesTab.table('the layers');
    expect(layers.columns).toHaveLength(4);
    expect(layers.rows).toHaveLength(4);
    expect(tablesTab.columnsIn('Sketch a design from the need')).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
    const sketch = tablesTab.headersIn('Sketch a design from the need');
    expect(sketch.rows).toHaveLength(5);
  });

  test('the slices point at their stations', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await tablesTab.recipe('drag sort');

    expect(demoPage.title('Slice the design into stories')).toBeVisible();
    expect(demoPage.sliceLinks()).toEqual(['#station-4', '#station-5', '#station-6', '#station-6', '#station-6']);
    expect(demoPage.sliceLinksLandingNowhere()).toEqual([]);
  });

  test('the recipe links out to the user story', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await tablesTab.recipe('drag sort');

    expect(demoPage.signpost('user story')).toHaveAttribute('href', expect.stringContaining('initialcapacity.io/insights/user-story'));
  });

  test('should hold their stories in the still table and the living table', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await tablesTab.recipe('drag sort');

    const still = demoPage.part('the still table');
    expect(still).toBeVisible();
    expect(recipeFolds.story(still, 'The trader can read the market in a table')).toBeInTheDocument();
    const living = demoPage.part('the living table');
    expect(living).toBeVisible();
    expect(recipeFolds.story(living, 'The trader can watch the market live, in windows')).toBeInTheDocument();
    expect(recipeFolds.story(living, 'The page is a store, and so is the table')).toBeInTheDocument();
  });

  test('should head the layers with both their axes', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await tablesTab.recipe('drag sort');

    expect(demoPage.title('Layer on functionality, in the order it was asked for')).toBeVisible();
    expect(tablesTab.columnHeader('by keyboard')).toBeVisible();
    expect(demoPage.row('Widen a column')).toBeVisible();
  });

  test('should take the keyboard to the station the address names', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={`${demosAt('tables')}#station-5`} feed={feed}/>);
    await feedIsSubscribed(feed);

    await demoPage.findTitle('The trader can watch the market live, in windows');

    await waitFor(() => expect(itemHeadedBy('the stations', 'The trader can watch the market live, in windows')).toHaveFocus());
  });

  test('choosing drag resize swaps in the resize tutorial', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    expect(await tablesTab.recipe('drag sort')).toBeVisible();
    expect(tablesTab.recipeShown('drag resize')).not.toBeInTheDocument();

    await tablesTab.pick('Drag resize');

    const resize = await tablesTab.recipe('drag resize');
    expect(resize).toBeVisible();
    expect(recipeFolds.story(resize, 'The trader can widen a column')).toBeInTheDocument();
    expect((await tablesTab.linksIn('drag resize', 'captures its pointer'))[0]).toHaveAttribute('href', expect.stringContaining('developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture'));
    expect(tablesTab.recipeShown('drag sort')).not.toBeInTheDocument();
    expect(tableControls.shown()).not.toBeInTheDocument();
    expect(demoPage.part('the living table')).toBeVisible();
  });

  test('choosing drag sort brings the sort tutorial back', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    await tablesTab.pick('Drag resize');
    await tablesTab.recipe('drag resize');

    await tablesTab.pick('Drag sort');

    expect(await tablesTab.recipe('drag sort')).toBeVisible();
  });

  test('choosing the sort menu swaps in the sort menu tutorial', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    await aggregations.arrived();
    await tablesTab.pick('Sort menu');

    const recipe = await tablesTab.recipe('sort menu');
    expect(recipe).toBeVisible();
    expect((await tablesTab.linksIn('sort menu', 'position-area'))[0]).toHaveAttribute('href', expect.stringContaining('developer.mozilla.org/en-US/docs/Web/CSS/position-area'));
    expect(recipeFolds.story(recipe, 'The trader can sort the windows by any measure, or take the order back')).toBeInTheDocument();
    expect(tablesTab.recipeShown('drag sort')).not.toBeInTheDocument();
    expect(tableControls.shown()).not.toBeInTheDocument();
    expect(demoPage.part('the living table')).toBeVisible();
  });

  test('the chosen tutorial travels in the url', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('tables', '?tut=resize')} feed={feed}/>);

    await feedIsSubscribed(feed);
    expect(await tablesTab.recipe('drag resize')).toBeVisible();
    expect(tablesTab.recipeShown('drag sort')).not.toBeInTheDocument();
  });

  describe('the table worlds', () => {
    test('the tutorial stands unchanged in the html world', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('tables', '?world=vanilla')} feed={feed}/>);
      await feedIsSubscribed(feed);

      expect(await demoPage.findTitle('The trader can watch the market live, in windows')).toBeInTheDocument();
    });

    test('the menu story stands in the html world', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('tables', '?world=vanilla&tut=menu')} feed={feed}/>);
      await feedIsSubscribed(feed);

      expect(await demoPage.findTitle('The trader can sort the windows by any measure, or take the order back')).toBeInTheDocument();
    });

    test('the resize story stands in the html world', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('tables', '?world=vanilla&tut=resize')} feed={feed}/>);
      await feedIsSubscribed(feed);

      expect(await demoPage.findTitle('The trader can widen a column')).toBeInTheDocument();
    });

  });
});

describe('the tables tab’s introduction', () => {
  test('should say what it assumes from earlier tabs, linking each tab it names', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    expect(await demoTabs.assumedLinks('Tables')).toEqual([
      ['charts tab', `${Paths.demos}charts/`],
      ['drag sort tab', `${Paths.demos}drag-and-drop/`],
      ['z-index tab', `${Paths.demos}z-index/`],
      ['accordions tab', `${Paths.demos}accordions/`]
    ]);
  });
});

describe('the links to other tabs', () => {
  test('should link each term it glosses, and each tab it names, to that tab', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('tables')} feed={feed}/>);
    await feedIsSubscribed(feed);

    const tab = await demoTabs.arrivedOn('Tables');

    expect(demoPage.linksToTabsIn(tab)).toEqual([
      ['charts tab', `${Paths.demos}charts/`],
      ['drag sort tab', `${Paths.demos}drag-and-drop/`],
      ['z-index tab', `${Paths.demos}z-index/`],
      ['accordions tab', `${Paths.demos}accordions/`],
      ['z-index tab', `${Paths.demos}z-index/`],
      ['events', `${Paths.demos}z-index/`],
      ['z-index tab', `${Paths.demos}z-index/`],
      ['z-index tab', `${Paths.demos}z-index/`],
      ['z-index tab', `${Paths.demos}z-index/`],
      ['accordions tab', `${Paths.demos}accordions/`],
      ['z-index tab', `${Paths.demos}z-index/`],
      ['dials', `${Paths.demos}accordions/`],
      ['Drag sort list demo', `${Paths.demos}drag-and-drop/`]
    ]);
  });
});
