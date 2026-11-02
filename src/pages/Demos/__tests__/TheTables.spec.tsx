import {TestApp} from '@__test_support/TestApp';
import {Paths} from '@pages/Paths';
import {itemHeadedBy} from '@__test_support/headed-item';
import {demoPage, demosAt, demoTabs, feedIsSubscribed} from '@pages/Demos/__test_support';
import {render, waitFor} from '@testing-library/react';
import {broadcast, listeningFeed, tradeFrame} from '@pages/Demos/__test_support/feed';
import {recipeFolds} from '@pages/Demos/Recipe/__test_support';
import {aggregations, tableControls, tablesTab} from '@pages/Demos/Tables/__test_support';
import {sortableTable} from '@components/DragSortableTable/__test_support';

const now = 1700000000000;
const fourTrades = [
  tradeFrame(50001, now - 30 * 60000, '0.10', 'bought'),
  tradeFrame(50002, now - 10 * 60000, '0.25', 'sold'),
  tradeFrame(50003, now - 3 * 60000, '0.05', 'bought'),
  tradeFrame(50004, now, '0.01', 'bought')
];

describe('the tables tab’s links out', () => {
  test('should link the resize step’s :has() to MDN', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('tables', '?tut=resize')} feed={feed}/>);
    await feedIsSubscribed(feed);

    expect(await tablesTab.linkIn('drag resize', ':has()')).toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/CSS/:has');
  });
});

describe('the tables demo', () => {
  test('the fixed windows hold their rows while the stream fills the cells', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    await aggregations.arrived();
    expect(aggregations.columns()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
    expect(aggregations.rows()).toHaveLength(6);
    broadcast(feed, fourTrades);
    await waitFor(() => expect(sortableTable.texts(aggregations.row('this minute'))).toEqual(
      ['this minute', '1', '1', '0', '0.01', '$50,004.00', '+$0.00']));
    expect(sortableTable.texts(aggregations.row('last 5 minutes'))).toEqual(
      ['last 5 minutes', '2', '2', '0', '0.06', '$50,003.17', '+$1.00']);
    expect(sortableTable.texts(aggregations.row('last 15 minutes'))).toEqual(
      ['last 15 minutes', '3', '2', '1', '0.31', '$50,002.23', '+$2.00']);
    expect(sortableTable.texts(aggregations.row('this hour'))).toEqual(
      ['this hour', '4', '3', '1', '0.41', '$50,001.93', '+$3.00']);
    expect(sortableTable.texts(aggregations.row('session'))).toEqual(
      ['session', '4', '3', '1', '0.41', '$50,001.93', '+$3.00']);
  });

  test('the glider offers a pace, an origin and a motion, eager by default', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    await tableControls.pressSettings();
    expect(await tableControls.axes()).toEqual(['pace', 'origin', 'motion']);
    expect(await tableControls.radios()).toEqual(['Eager', 'Lazy', 'Keep', 'Hide', 'Animate', 'Static']);
    expect(await tableControls.radio('Eager')).toBeChecked();
    expect(await tableControls.radio('Hide')).toBeChecked();
    expect(await tableControls.radio('Animate')).toBeChecked();
  });

  test('the controls start folded behind their readout, and a press opens them', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    expect(await tableControls.settings()).not.toHaveAttribute('open');
    expect(tableControls.readout('<EagerTable className="hide animated"/>')).toBeVisible();

    await tableControls.pressSettings();
    expect(await tableControls.region()).toBeVisible();
    expect(tableControls.readout('<EagerTable className="hide animated"/>')).toBeVisible();
  });

  test("the controls' prompt reads settings apart from its readout", async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    expect(await tableControls.settings()).toHaveTextContent(/^settings \S/);
  });

  test('the controls read out the table first shown', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    expect(await tableControls.reading('pace')).toHaveTextContent(/Neighbors swap the moment you drag past them/);
    expect(await tableControls.reading('origin')).toHaveTextContent(/moves with the pointer, cells and all/);
    expect(await tableControls.reading('motion')).toHaveTextContent(/slide to their new places/);
    expect(tableControls.readout('<EagerTable className="hide animated"/>')).toBeVisible();
  });

  test('the controls read out whatever is chosen', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('tables')} feed={feed}/>);
    await feedIsSubscribed(feed);

    await tableControls.choose('Lazy', 'Keep', 'Static');

    expect(await tableControls.reading('pace')).toHaveTextContent(/dispatches the new order on drop/);
    expect(await tableControls.reading('origin')).toHaveTextContent(/stays where it was/);
    expect(await tableControls.reading('motion')).toHaveTextContent(/gives them no time/);
    expect(tableControls.readout('<LazyTable className="keep static"/>')).toBeVisible();
  });

  test('the arrangement survives a change of table: the order belongs to the page', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    await aggregations.arrived();
    expect(aggregations.windows().slice(0, 2)).toEqual(['this minute', 'last 5 minutes']);

    await aggregations.moveWindowByKey(1, '{ArrowDown}');
    await aggregations.moveColumnByKey('trades', '{ArrowRight}');
    expect(aggregations.windows().slice(0, 2)).toEqual(['last 5 minutes', 'this minute']);

    await tableControls.choose('Lazy', 'Static');

    expect(tableControls.readout('<LazyTable className="hide static"/>')).toBeVisible();
    expect(aggregations.windows().slice(0, 2)).toEqual(['last 5 minutes', 'this minute']);
    expect(aggregations.columns().slice(0, 3)).toEqual(['window', 'buys', 'trades']);
  });

  test('should open the recipe with its stories closed', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await tablesTab.recipe('drag sort');

    expect(recipe).toBeVisible();
    expect(recipeFolds.story(recipe, 'The trader can sort by column')).not.toHaveAttribute('open');
    expect(recipeFolds.story(recipe, 'The trader can sort by row')).not.toHaveAttribute('open');
  });

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

  test('opening the sort by column story shows the drag build with its steps closed', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await tablesTab.recipe('drag sort');

    await recipeFolds.press(recipe, 'The trader can sort by column');

    expect(recipeFolds.story(recipe, 'The trader can sort by column')).toHaveAttribute('open');
    expect(recipeFolds.reveals(recipe).length).toBeGreaterThan(0);
    expect(recipeFolds.opened(recipeFolds.reveals(recipe))).toHaveLength(0);
  });

  test('the drag build in plain HTML links its implementation to its file on GitHub', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('tables', '?world=vanilla')} feed={feed}/>);
    await feedIsSubscribed(feed);
    await tablesTab.recipe('drag sort');

    expect((await tablesTab.linksIn('drag sort', 'the implementation'))[0]).toHaveAttribute('href', 'https://github.com/RyanDur/ChosenPicachu/blob/main/src/pages/Demos/Tables/Frame/builds/Eager.ts');
  });

  test('should link the drag build out to the drag sort list demo, its implementation and insertBefore', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await tablesTab.recipe('drag sort');

    await recipeFolds.press(recipe, 'The trader can sort by column');

    expect((await tablesTab.linksIn('drag sort', /Drag sort list demo/))[0]).toHaveAttribute('href', '/demos/drag-and-drop/');
    expect((await tablesTab.linksIn('drag sort', 'the implementation'))[0]).toHaveAttribute('href', 'https://github.com/RyanDur/ChosenPicachu/tree/main/src/pages/Demos/Tables/Builds/EagerTable');
    expect((await tablesTab.linksIn('drag sort', 'insertBefore'))[0]).toHaveAttribute('href', expect.stringContaining('developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore'));
  });

  test('the recipe teaches whatever the dials are set to', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await tablesTab.recipe('drag sort');
    await recipeFolds.press(recipe, 'The trader can sort by column');
    await recipeFolds.press(recipe, 'The trader can sort by row');

    await tablesTab.chooseInRecipe('drag sort', 'Lazy', 'Keep', 'Static');

    expect(recipeFolds.story(recipe, 'The trader can sort by row')).toHaveAttribute('open');
    expect(recipeFolds.stepTitled(recipe, 'Hold still, dispatch on release')).toBeInTheDocument();
    expect(recipeFolds.stepTitled(recipe, 'Keep the origin in place and let only the order move')).toBeInTheDocument();
    expect(recipeFolds.stepTitled(recipe, 'Leave the motion out')).toBeInTheDocument();
    expect(recipeFolds.queryStepTitled(recipe, 'Commit inside the move')).not.toBeInTheDocument();
    expect(await tableControls.chosenDials()).toEqual(['Lazy', 'Keep', 'Static']);
  });

  test('should take the keyboard to the station the address names', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={`${demosAt('tables')}#station-5`} feed={feed}/>);
    await feedIsSubscribed(feed);

    await demoPage.findTitle('The trader can watch the market live, in windows');

    await waitFor(() => expect(itemHeadedBy('the stations', 'The trader can watch the market live, in windows')).toHaveFocus());
  });

  test('the keyboard track teaches the same sort with the arrow keys', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('tables')} feed={feed}/>);

    await feedIsSubscribed(feed);
    const recipe = await tablesTab.recipe('drag sort');
    await tablesTab.chooseInRecipe('drag sort', 'By keyboard');

    expect(recipeFolds.stepTitled(recipe, 'Give focus a place to land')).toBeInTheDocument();
    expect(recipeFolds.stepTitled(recipe, 'The arrows give the direction')).toBeInTheDocument();
    expect(recipeFolds.stepTitled(recipe, 'Both parties slide')).toBeInTheDocument();
    expect(recipeFolds.queryStepTitled(recipe, 'Hold the pointer from the lift')).not.toBeInTheDocument();
    await recipeFolds.press(recipe, 'The trader can sort by column');
    expect(recipeFolds.stepTitled(recipe, 'Turn the arrows vertical')).toBeInTheDocument();
    expect(recipeFolds.story(recipe, 'The trader can sort by row')).toBeInTheDocument();
    expect(await tablesTab.radioIn('drag sort', 'Lazy')).not.toBeInTheDocument();
  });

  test('the keyboard track answers the motion dial', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('tables', '?track=keyboard')} feed={feed}/>);

    await feedIsSubscribed(feed);
    const recipe = await tablesTab.recipe('drag sort');
    expect(recipeFolds.stepTitled(recipe, 'Both parties slide')).toBeInTheDocument();

    await tablesTab.chooseInRecipe('drag sort', 'Static');

    expect(recipeFolds.stepTitled(recipe, 'Cut on the keypress')).toBeInTheDocument();
    expect(recipeFolds.queryStepTitled(recipe, 'Both parties slide')).not.toBeInTheDocument();
  });

  test('switching back to the pointer track restores its road', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('tables', '?track=keyboard')} feed={feed}/>);

    await feedIsSubscribed(feed);
    const recipe = await tablesTab.recipe('drag sort');

    await tablesTab.chooseInRecipe('drag sort', 'By pointer');

    expect(recipeFolds.stepTitled(recipe, 'Hold the pointer from the lift')).toBeInTheDocument();
  });

  test('the chosen track travels in the url', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('tables', '?track=keyboard')} feed={feed}/>);

    await feedIsSubscribed(feed);
    const recipe = await tablesTab.recipe('drag sort');
    expect(recipeFolds.stepTitled(recipe, 'The arrows give the direction')).toBeInTheDocument();
    expect(recipeFolds.queryStepTitled(recipe, 'Hold the pointer from the lift')).not.toBeInTheDocument();
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

  test('the open cards travel in the url', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('tables', '?sort=column')} feed={feed}/>);

    await feedIsSubscribed(feed);
    const recipe = await tablesTab.recipe('drag sort');
    expect(recipeFolds.story(recipe, 'The trader can sort by column')).toHaveAttribute('open');
    expect(recipeFolds.story(recipe, 'The trader can sort by row')).not.toHaveAttribute('open');
    const living = demoPage.part('the living table');
    expect(recipeFolds.story(living, 'The trader can watch the market live, in windows')).not.toHaveAttribute('open');
    expect(recipeFolds.story(living, 'The page is a store, and so is the table')).not.toHaveAttribute('open');
  });

  test('a story folds shut without folding the story beside it', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('tables', '?sort=column,row')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await tablesTab.recipe('drag sort');
    expect(recipeFolds.story(recipe, 'The trader can sort by row')).toHaveAttribute('open');

    const column = await recipeFolds.press(recipe, 'The trader can sort by column');

    expect(column).not.toHaveAttribute('open');
    expect(recipeFolds.story(recipe, 'The trader can sort by row')).toHaveAttribute('open');
    expect(demoPage.urlSearch()).toHaveTextContent('sort=row');
  });

  test('the address holds every story the trader opens', async () => {
    const feed = await listeningFeed();
    render(<TestApp at={demosAt('tables')} feed={feed}/>);
    await feedIsSubscribed(feed);
    const recipe = await tablesTab.recipe('drag sort');

    const column = await recipeFolds.press(recipe, 'The trader can sort by column');
    const row = await recipeFolds.press(recipe, 'The trader can sort by row');

    expect(column).toHaveAttribute('open');
    expect(row).toHaveAttribute('open');
    expect(demoPage.urlSearch()).toHaveTextContent('sort=column%2Crow');
  });

  test('the dials travel in the url', async () => {
    const feed = await listeningFeed();

    render(<TestApp at={demosAt('tables', '?pace=lazy&origin=keep&motion=static')} feed={feed}/>);

    await feedIsSubscribed(feed);
    expect(await tableControls.chosenDials()).toEqual(['Lazy', 'Keep', 'Static']);
    expect(tableControls.readout('<LazyTable className="keep static"/>')).toBeVisible();
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

    test('should offer the build’s dials in the html world', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('tables', '?world=vanilla')} feed={feed}/>);
      await feedIsSubscribed(feed);

      expect((await tablesTab.findRadios('Eager')).length).toBeGreaterThan(0);
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

    test('the sort tutorial stands on both tracks in the react world', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('tables', '?tut=sort&world=react')} feed={feed}/>);

      expect(recipeFolds.story(await tablesTab.recipe('drag sort'), 'The trader can sort by column')).toBeInTheDocument();
      await tablesTab.pick('By keyboard');
      expect(await demoPage.findTitle('Give focus a place to land')).toBeInTheDocument();
    });

    test('the sort tutorial stands on both tracks in the vanilla world', async () => {
      const feed = await listeningFeed();

      render(<TestApp at={demosAt('tables', '?tut=sort&world=vanilla')} feed={feed}/>);

      expect(recipeFolds.story(await tablesTab.recipe('drag sort'), 'The trader can sort by column')).toBeInTheDocument();
      await tablesTab.pick('By keyboard');
      expect(await demoPage.findTitle('Give focus a place to land')).toBeInTheDocument();
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
