import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {appAddress} from '@__test_support/address';
import {demoPage, demosAt, demoTabs, pageFoot} from '@pages/Demos/__test_support';
import {aggregations, tablesTab} from '@pages/Demos/Tables/__test_support';
import {recipeFolds} from '@pages/Demos/Recipe/__test_support';

const theNeed = 'Start with the need, and let it pick the element';
const theNeedsPage = demosAt('tables/the-need-and-its-clues');
const theSketch = 'Sketch a design from the need';
const theSketchsPage = demosAt('tables/the-sketch');
const unanswered = 'what a design cannot tell you';
const theSlices = 'Slice the design into stories';
const theSlicesPage = demosAt('tables/the-slices');
const theStillTable = 'Build the still table';
const theStillStory = 'The trader can read the market in a table';
const theStillTablesPage = demosAt('tables/the-still-table');
const theStory = 'The trader can watch the live market over lookbacks they arrange';
const theLiveTable = 'Make the table live';
const theFlowStory = 'The trader can watch the market live, one lookback beside another';
const theStoreStory = 'The page is a store, and so is the table';
const theLiveTablesPage = demosAt('tables/the-live-table-and-the-store');
const theFeatures = 'Add features, in the order they were asked for';
const bothStoriesOpen = 'living=flow%2Cstore';

describe('the tables tab’s parts, each on its own page', () => {
  test('following the need and its clues from the tables tab opens its page', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    await tablesTab().follow(theNeed);

    expect(await appAddress.movedOnFrom(demosAt('tables'))).toBe(theNeedsPage);
    expect(await tablesTab().place()).toBeVisible();
    expect(tablesTab().table('the clues').rows).toHaveLength(5);
  });

  test('the need’s page shows the live table, then only the need and its clues', async () => {
    render(<TestApp at={theNeedsPage}/>);

    await tablesTab().place();

    expect(aggregations.card()).toBeVisible();
    const clues = tablesTab().table('the clues');
    expect(clues.columns).toHaveLength(2);
    expect(clues.rows).toHaveLength(5);
    expect(tablesTab().titleShown('Sketch a design from the need')).not.toBeInTheDocument();
  });

  test('the need’s page says its place among the parts', async () => {
    render(<TestApp at={theNeedsPage}/>);

    expect(await tablesTab().place()).toHaveTextContent('Tables · part 1 of 8');
  });

  test('the need’s page heads the need once, as its title', async () => {
    render(<TestApp at={theNeedsPage}/>);

    await tablesTab().place();

    expect(tablesTab().titles(theNeed, 2)).toHaveLength(1);
    expect(tablesTab().titles(theNeed)).toHaveLength(1);
  });

  test('the need’s page links the tab its clues name', async () => {
    render(<TestApp at={theNeedsPage}/>);

    await tablesTab().place();

    expect(demoPage.linksToTabsIn(demoPage.part(theNeed))).toContainEqual(['z-index tab', demosAt('z-index')]);
  });

  test('the build chosen on the tables tab carries into the part it opens', async () => {
    render(<TestApp at={demosAt('tables', '?world=vanilla')}/>);

    await tablesTab().follow(theNeed);

    expect(await appAddress.movedOnFrom(demosAt('tables', '?world=vanilla'))).toBe(demosAt('tables/the-need-and-its-clues', '?world=vanilla'));
  });

  test('the need’s page leads on to the sketch’s page, by number and title, with the build carried', async () => {
    render(<TestApp at={demosAt('tables/the-need-and-its-clues', '?world=vanilla')}/>);

    expect(await pageFoot.leadsOn('the tables parts')).toEqual([
      ['Next: 2. Sketch a design from the need', demosAt('tables/the-sketch', '?world=vanilla')]
    ]);
  });

  test('the tables tab leads to the need’s page instead of showing its clues', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    await tablesTab().tutorialLink(theNeed);

    expect(tablesTab().tableShown('the clues')).not.toBeInTheDocument();
  });

  test('should title the need’s page with the tab and the part', async () => {
    render(<TestApp at={theNeedsPage}/>);

    expect(await demoTabs.title(`Demos Tables · ${theNeed}`)).toBeInTheDocument();
  });

  test('should keep Tables as the current tab on the need’s page', async () => {
    render(<TestApp at={theNeedsPage}/>);

    expect(await demoTabs.current()).toEqual(['Tables']);
  });

  test('following the sketch from the tables tab opens its page', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    await tablesTab().follow(theSketch);

    expect(await appAddress.movedOnFrom(demosAt('tables'))).toBe(theSketchsPage);
    expect(await tablesTab().place()).toBeVisible();
    expect(tablesTab().titleShown(unanswered)).toBeVisible();
  });

  test('the sketch’s page shows the live table, then only the sketch', async () => {
    render(<TestApp at={theSketchsPage}/>);

    await tablesTab().place();

    expect(aggregations.card()).toBeVisible();
    expect(tablesTab().titleShown(unanswered)).toBeVisible();
    expect(tablesTab().tableShown('the clues')).not.toBeInTheDocument();
    expect(tablesTab().titleShown('Slice the design into stories')).not.toBeInTheDocument();
  });

  test('the sketch’s table names its rows and columns', async () => {
    render(<TestApp at={theSketchsPage}/>);

    await tablesTab().place();

    expect(tablesTab().columnsIn(theSketch)).toEqual(['lookback', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
    expect(tablesTab().headersIn(theSketch).rows).toHaveLength(5);
  });

  test('the sketch’s page says its place among the parts', async () => {
    render(<TestApp at={theSketchsPage}/>);

    expect(await tablesTab().place()).toHaveTextContent('Tables · part 2 of 8');
  });

  test('the sketch’s page heads the sketch once, as its title', async () => {
    render(<TestApp at={theSketchsPage}/>);

    await tablesTab().place();

    expect(tablesTab().titles(theSketch, 2)).toHaveLength(1);
    expect(tablesTab().titles(theSketch)).toHaveLength(1);
  });

  test('the sketch’s page heads what a design cannot tell you one level under its title', async () => {
    render(<TestApp at={theSketchsPage}/>);

    await tablesTab().place();

    expect(tablesTab().titles('what a design cannot tell you', 3)).toHaveLength(1);
  });

  test('the sketch’s page leads back to the need’s page and on to the slices’ page, by number and title, with the build carried', async () => {
    render(<TestApp at={demosAt('tables/the-sketch', '?world=vanilla')}/>);

    expect(await pageFoot.leadsOn('the tables parts')).toEqual([
      ['Previous: 1. Start with the need, and let it pick the element', demosAt('tables/the-need-and-its-clues', '?world=vanilla')],
      ['Next: 3. Slice the design into stories', demosAt('tables/the-slices', '?world=vanilla')]
    ]);
  });

  test('the tables tab leads to the sketch’s page instead of showing the sketch', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    await tablesTab().tutorialLink(theSketch);

    expect(tablesTab().titleShown(unanswered)).not.toBeInTheDocument();
  });

  test('the tables tab says the need takes one minute to read', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    expect(await tablesTab().readingTimeOf(theNeed)).toHaveTextContent(/^1 minute to read$/);
  });

  test('the tables tab says the sketch takes one minute to read', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    expect(await tablesTab().readingTimeOf(theSketch)).toHaveTextContent(/^1 minute to read$/);
  });

  test('should title the sketch’s page with the tab and the part', async () => {
    render(<TestApp at={theSketchsPage}/>);

    expect(await demoTabs.title(`Demos Tables · ${theSketch}`)).toBeInTheDocument();
  });

  test('following the slices from the tables tab opens their page', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    await tablesTab().follow(theSlices);

    expect(await appAddress.movedOnFrom(demosAt('tables'))).toBe(theSlicesPage);
    expect(await tablesTab().place()).toBeVisible();
    expect(demoPage.title(theStory)).toBeVisible();
  });

  test('the slices’ page shows the live table, then only the story and its slices', async () => {
    render(<TestApp at={theSlicesPage}/>);

    await tablesTab().place();

    expect(aggregations.card()).toBeVisible();
    expect(demoPage.title(theStory)).toBeVisible();
    expect(tablesTab().titleShown(unanswered)).not.toBeInTheDocument();
    expect(tablesTab().titleShown('Add features, in the order they were asked for')).not.toBeInTheDocument();
  });

  test('the slices’ page links the tab its story names', async () => {
    render(<TestApp at={theSlicesPage}/>);

    await tablesTab().place();

    expect(demoPage.linksToTabsIn(demoPage.part(theSlices))).toContainEqual(['z-index tab', demosAt('z-index')]);
  });

  test('the slices’ page says its place among the parts', async () => {
    render(<TestApp at={theSlicesPage}/>);

    expect(await tablesTab().place()).toHaveTextContent('Tables · part 3 of 8');
  });

  test('the slices’ page heads the slices once, as its title', async () => {
    render(<TestApp at={theSlicesPage}/>);

    await tablesTab().place();

    expect(tablesTab().titles(theSlices, 2)).toHaveLength(1);
    expect(tablesTab().titles(theSlices)).toHaveLength(1);
  });

  test('the slices’ page heads its story one level under its title', async () => {
    render(<TestApp at={theSlicesPage}/>);

    await tablesTab().place();

    expect(tablesTab().titles('The trader can watch the live market over lookbacks they arrange', 3)).toHaveLength(1);
  });

  test('the slices on their page point at the still table’s and the live table’s pages and the later stations on the tables tab, with the build carried', async () => {
    render(<TestApp at={demosAt('tables/the-slices', '?world=vanilla')}/>);

    await tablesTab().place();

    const station = (at: number) => `${demosAt('tables', '?world=vanilla')}#station-${at}`;
    expect(demoPage.sliceLinks()).toEqual([
      demosAt('tables/the-still-table', '?world=vanilla&living=still'),
      demosAt('tables/the-live-table-and-the-store', `?world=vanilla&${bothStoriesOpen}`),
      station(6), station(6), station(6)
    ]);
  });

  test('the tables tab holds every station the slices on their page point at', async () => {
    const {unmount} = render(<TestApp at={theSlicesPage}/>);
    await tablesTab().place();
    const stations = demoPage.sliceStationsOn(demosAt('tables'));
    unmount();

    render(<TestApp at={demosAt('tables')}/>);
    await demoPage.findTitle('let’s build this feature');

    expect(demoPage.missing(stations)).toEqual([]);
  });

  test('the slices’ page leads back to the sketch’s page and on to the still table’s page, by number and title, with the build carried', async () => {
    render(<TestApp at={demosAt('tables/the-slices', '?world=vanilla')}/>);

    expect(await pageFoot.leadsOn('the tables parts')).toEqual([
      ['Previous: 2. Sketch a design from the need', demosAt('tables/the-sketch', '?world=vanilla')],
      ['Next: 4. Build the still table', demosAt('tables/the-still-table', '?world=vanilla&living=still')]
    ]);
  });

  test('the tables tab leads to the slices’ page instead of showing the slices', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    await tablesTab().tutorialLink(theSlices);

    expect(tablesTab().titleShown(theStory)).not.toBeInTheDocument();
  });

  test('the tables tab says the slices take two minutes to read', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    expect(await tablesTab().readingTimeOf(theSlices)).toHaveTextContent(/^2 minutes to read$/);
  });

  test('should title the slices’ page with the tab and the part', async () => {
    render(<TestApp at={theSlicesPage}/>);

    expect(await demoTabs.title(`Demos Tables · ${theSlices}`)).toBeInTheDocument();
  });

  test('following the still table from the tables tab opens its page with its story open', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    await tablesTab().follow(theStillTable);

    expect(await appAddress.movedOnFrom(demosAt('tables'))).toBe(demosAt('tables/the-still-table', '?living=still'));
    await tablesTab().place();
    expect(recipeFolds.story(demoPage.part(theStillTable), theStillStory)).toHaveAttribute('open');
  });

  test('the still table’s page names its section by its title', async () => {
    render(<TestApp at={theStillTablesPage}/>);

    await tablesTab().place();

    expect(demoPage.part(theStillTable)).toBeVisible();
  });

  test('the still table’s page shows the live table, then only the still table', async () => {
    render(<TestApp at={theStillTablesPage}/>);

    await tablesTab().place();

    expect(aggregations.card()).toBeVisible();
    expect(demoPage.part(theStillTable)).toBeVisible();
    expect(tablesTab().titleShown(theStory)).not.toBeInTheDocument();
    expect(tablesTab().titleShown(theFlowStory)).not.toBeInTheDocument();
  });

  test('the still table’s page links each term it glosses, and each tab it names, to that tab', async () => {
    render(<TestApp at={theStillTablesPage}/>);

    await tablesTab().place();

    expect(demoPage.linksToTabsIn(demoPage.part(theStillTable))).toEqual([
      ['accordions tab', demosAt('accordions')],
      ['z-index tab', demosAt('z-index')]
    ]);
  });

  test('the still table’s page says its place among the parts', async () => {
    render(<TestApp at={theStillTablesPage}/>);

    expect(await tablesTab().place()).toHaveTextContent('Tables · part 4 of 8');
  });

  test('the still table’s page heads the still table once, as its title', async () => {
    render(<TestApp at={theStillTablesPage}/>);

    await tablesTab().place();

    expect(tablesTab().titles(theStillTable, 2)).toHaveLength(1);
    expect(tablesTab().titles(theStillTable)).toHaveLength(1);
  });

  test('the still table’s page leads back to the slices’ page and on to the live table’s page, by number and title, with the build carried', async () => {
    render(<TestApp at={demosAt('tables/the-still-table', '?world=vanilla')}/>);

    expect(await pageFoot.leadsOn('the tables parts')).toEqual([
      ['Previous: 3. Slice the design into stories', demosAt('tables/the-slices', '?world=vanilla')],
      ['Next: 5. Make the table live', demosAt('tables/the-live-table-and-the-store', `?world=vanilla&${bothStoriesOpen}`)]
    ]);
  });

  test('the tables tab leads to the still table’s page instead of showing the still table', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    await tablesTab().tutorialLink(theStillTable);

    expect(tablesTab().titleShown(theStillStory)).not.toBeInTheDocument();
  });

  test('should title the still table’s page with the tab and the part', async () => {
    render(<TestApp at={theStillTablesPage}/>);

    expect(await demoTabs.title(`Demos Tables · ${theStillTable}`)).toBeInTheDocument();
  });

  test('following the live table from the tables tab opens its page with both its stories open', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    await tablesTab().follow(theLiveTable);

    expect(await appAddress.movedOnFrom(demosAt('tables'))).toBe(demosAt('tables/the-live-table-and-the-store', `?${bothStoriesOpen}`));
    await tablesTab().place();
    expect(recipeFolds.story(demoPage.part(theLiveTable), theFlowStory)).toHaveAttribute('open');
    expect(recipeFolds.story(demoPage.part(theLiveTable), theStoreStory)).toHaveAttribute('open');
  });

  test('the live table’s page opens only the story its address names', async () => {
    render(<TestApp at={demosAt('tables/the-live-table-and-the-store', '?living=flow')}/>);

    await tablesTab().place();

    const live = demoPage.part(theLiveTable);
    expect(recipeFolds.story(live, theFlowStory)).toHaveAttribute('open');
    expect(recipeFolds.story(live, theStoreStory)).not.toHaveAttribute('open');
  });

  test('the live table’s page names its section by its title', async () => {
    render(<TestApp at={theLiveTablesPage}/>);

    await tablesTab().place();

    expect(demoPage.part(theLiveTable)).toBeVisible();
  });

  test('the live table’s page shows the live table, then only the live table and the store', async () => {
    render(<TestApp at={theLiveTablesPage}/>);

    await tablesTab().place();

    expect(aggregations.card()).toBeVisible();
    const live = demoPage.part(theLiveTable);
    expect(recipeFolds.story(live, theFlowStory)).toBeInTheDocument();
    expect(recipeFolds.story(live, theStoreStory)).toBeInTheDocument();
    expect(tablesTab().titleShown(theStillStory)).not.toBeInTheDocument();
    expect(tablesTab().titleShown(theFeatures)).not.toBeInTheDocument();
  });

  test('the live table’s page links each term it glosses, and each tab it names, to that tab', async () => {
    render(<TestApp at={theLiveTablesPage}/>);

    await tablesTab().place();

    expect(demoPage.linksToTabsIn(demoPage.part(theLiveTable))).toEqual([
      ['charts tab', demosAt('charts')]
    ]);
  });

  test('the live table’s page tells its stories in the html world', async () => {
    render(<TestApp at={demosAt('tables/the-live-table-and-the-store', '?world=vanilla')}/>);

    expect(await demoPage.findTitle(theFlowStory)).toBeInTheDocument();
  });

  test('the live table’s page says its place among the parts', async () => {
    render(<TestApp at={theLiveTablesPage}/>);

    expect(await tablesTab().place()).toHaveTextContent('Tables · part 5 of 8');
  });

  test('the live table’s page heads the live table once, as its title', async () => {
    render(<TestApp at={theLiveTablesPage}/>);

    await tablesTab().place();

    expect(tablesTab().titles(theLiveTable, 2)).toHaveLength(1);
    expect(tablesTab().titles(theLiveTable)).toHaveLength(1);
  });

  test('the live table’s page leads back to the still table’s page and on to the features on the tables tab, with the build carried', async () => {
    render(<TestApp at={demosAt('tables/the-live-table-and-the-store', '?world=vanilla')}/>);

    expect(await pageFoot.leadsOn('the tables parts')).toEqual([
      ['Previous: 4. Build the still table', demosAt('tables/the-still-table', '?world=vanilla&living=still')],
      ['Next: Add features, in the order they were asked for', `${demosAt('tables', '?world=vanilla')}#station-6`]
    ]);
  });

  test('the tables tab leads to the live table’s page instead of showing the live table', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    await tablesTab().tutorialLink(theLiveTable);

    expect(tablesTab().titleShown(theFlowStory)).not.toBeInTheDocument();
  });

  test('the tables tab says the live table takes twelve minutes to read', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    expect(await tablesTab().readingTimeOf(theLiveTable)).toHaveTextContent(/^12 minutes to read$/);
  });

  test('should title the live table’s page with the tab and the part', async () => {
    render(<TestApp at={theLiveTablesPage}/>);

    expect(await demoTabs.title(`Demos Tables · ${theLiveTable}`)).toBeInTheDocument();
  });
});
