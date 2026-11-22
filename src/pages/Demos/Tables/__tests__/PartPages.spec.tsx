import {render, waitFor} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {appAddress} from '@__test_support/address';
import {demoPage, demosAt, demoTabs, pageFoot} from '@pages/Demos/__test_support';
import {aggregations, tablesTab} from '@pages/Demos/Tables/__test_support';
import {explanation, recipeFolds} from '@pages/Demos/Recipe/__test_support';
import {titleAbove} from '@__test_support/title-above';

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

describe('the tables tab’s parts, each on its own page', () => {
  test('following the need and its clues from the tables tab opens its page', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    await tablesTab().followPart(theNeed);

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

  test('the need’s page cites the z-index part that names its clues', async () => {
    render(<TestApp at={theNeedsPage}/>);

    await tablesTab().place();

    expect(demoPage.linksToPageIn(demoPage.part(theNeed), demosAt('z-index/lets-build-this-feature'))).toEqual([['Let’s build this feature', demosAt('z-index/lets-build-this-feature')]]);
  });

  test('the build chosen on the tables tab carries into the part it opens', async () => {
    render(<TestApp at={demosAt('tables', '?world=vanilla')}/>);

    await tablesTab().followPart(theNeed);

    expect(await appAddress.movedOnFrom(demosAt('tables', '?world=vanilla'))).toBe(demosAt('tables/the-need-and-its-clues', '?world=vanilla'));
  });

  test('the need’s page leads on to the sketch’s page, by number and title, with the build carried', async () => {
    render(<TestApp at={demosAt('tables/the-need-and-its-clues', '?world=vanilla')}/>);

    expect(await pageFoot.leadsOn()).toEqual([
      ['Next: 2. Sketch a design from the need', demosAt('tables/the-sketch', '?world=vanilla')]
    ]);
  });

  test('the tables tab leads to the need’s page instead of showing its clues', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    await tablesTab().partLink(theNeed);

    expect(tablesTab().tableShown('the clues')).not.toBeInTheDocument();
  });

  test('should title the need’s page with its tab', async () => {
    render(<TestApp at={theNeedsPage}/>);

    expect(await demoTabs.title('Demos Tables')).toBeInTheDocument();
  });

  test('should keep Tables as the current tab on the need’s page', async () => {
    render(<TestApp at={theNeedsPage}/>);

    expect(await demoTabs.currentButNotThePage()).toEqual(['Tables']);
  });

  test('following the sketch from the tables tab opens its page', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    await tablesTab().followPart(theSketch);

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

    expect(await tablesTab().sketchColumns(theSketch))
      .toEqual(['lookback', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
    expect((await tablesTab().sketchHeaders(theSketch)).rows).toHaveLength(5);
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

  test('the sketch’s page holds what a design cannot tell you as a section of its own, its questions under its title', async () => {
    render(<TestApp at={theSketchsPage}/>);

    const [firstQuestion] = explanation.runsIn(await explanation.part(unanswered));

    expect(titleAbove(firstQuestion)).toBe(unanswered);
  });

  test('the sketch’s page leads back to the need’s page and on to the slices’ page, by number and title, with the build carried', async () => {
    render(<TestApp at={demosAt('tables/the-sketch', '?world=vanilla')}/>);

    expect(await pageFoot.leadsOn()).toEqual([
      ['Previous: 1. Start with the need, and let it pick the element', demosAt('tables/the-need-and-its-clues', '?world=vanilla')],
      ['Next: 3. Slice the design into stories', demosAt('tables/the-slices', '?world=vanilla')]
    ]);
  });

  test('the tables tab leads to the sketch’s page instead of showing the sketch', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    await tablesTab().partLink(theSketch);

    expect(tablesTab().titleShown(unanswered)).not.toBeInTheDocument();
  });

  test('the tables tab gives the need its minutes, as 1 min', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    expect(await tablesTab().minutesOf(theNeed)).toHaveTextContent(/^1 min$/);
  });

  test('the tables tab gives the sketch its minutes, as 1 min', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    expect(await tablesTab().minutesOf(theSketch)).toHaveTextContent(/^1 min$/);
  });

  test('should title the sketch’s page with its tab', async () => {
    render(<TestApp at={theSketchsPage}/>);

    expect(await demoTabs.title('Demos Tables')).toBeInTheDocument();
  });

  test('following the slices from the tables tab opens their page', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    await tablesTab().followPart(theSlices);

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
    expect(tablesTab().tableShown('the features')).not.toBeInTheDocument();
  });

  test('the slices’ page cites the z-index part that teaches a user story', async () => {
    render(<TestApp at={theSlicesPage}/>);

    await tablesTab().place();

    expect(demoPage.linksToPageIn(demoPage.part(theSlices), demosAt('z-index/lets-build-this-feature')))
      .toContainEqual(['Let’s build this feature', demosAt('z-index/lets-build-this-feature')]);
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

  test('the slices on their page point at the pages of the parts that build them, with the build carried', async () => {
    render(<TestApp at={demosAt('tables/the-slices', '?world=vanilla')}/>);

    await tablesTab().place();

    expect(demoPage.sliceLinks()).toEqual([
      demosAt('tables/the-still-table', '?world=vanilla'),
      demosAt('tables/the-live-table-and-the-store', '?world=vanilla'),
      demosAt('tables/sort', '?world=vanilla'),
      demosAt('tables/menu', '?world=vanilla'),
      demosAt('tables/resize', '?world=vanilla')
    ]);
  });

  test('the slices on their page name the part that builds each one', async () => {
    render(<TestApp at={demosAt('tables/the-slices')}/>);

    await tablesTab().place();

    expect(demoPage.sliceLinkNames()).toEqual(['part 4', 'part 5', 'part 6', 'part 7', 'part 8']);
  });

  test('the slices’ page leads back to the sketch’s page and on to the still table’s page, by number and title, with the build carried', async () => {
    render(<TestApp at={demosAt('tables/the-slices', '?world=vanilla')}/>);

    expect(await pageFoot.leadsOn()).toEqual([
      ['Previous: 2. Sketch a design from the need', demosAt('tables/the-sketch', '?world=vanilla')],
      ['Next: 4. Build the still table', demosAt('tables/the-still-table', '?world=vanilla')]
    ]);
  });

  test('the tables tab leads to the slices’ page instead of showing the slices', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    await tablesTab().partLink(theSlices);

    expect(tablesTab().titleShown(theStory)).not.toBeInTheDocument();
  });

  test('the tables tab gives the slices their minutes, as 2 min', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    expect(await tablesTab().minutesOf(theSlices)).toHaveTextContent(/^2 min$/);
  });

  test('should title the slices’ page with its tab', async () => {
    render(<TestApp at={theSlicesPage}/>);

    expect(await demoTabs.title('Demos Tables')).toBeInTheDocument();
  });

  test('following the still table from the tables tab opens its page with its story open', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    await tablesTab().followPart(theStillTable);

    expect(await appAddress.movedOnFrom(demosAt('tables'))).toBe(theStillTablesPage);
    await tablesTab().place();
    expect(recipeFolds.story(demoPage.part(theStillTable), theStillStory)).toHaveAttribute('open');
  });

  test('the still table’s page names its section by its title', async () => {
    render(<TestApp at={theStillTablesPage}/>);

    await tablesTab().place();

    expect(demoPage.part(theStillTable)).toBeVisible();
  });

  test('the still table’s page names its steps for what they build', async () => {
    render(<TestApp at={theStillTablesPage}/>);

    expect(await tablesTab().recipe('still table')).toBeVisible();
  });

  test('the still table’s page shows the live table, then only the still table', async () => {
    render(<TestApp at={theStillTablesPage}/>);

    await tablesTab().place();

    expect(aggregations.card()).toBeVisible();
    expect(demoPage.part(theStillTable)).toBeVisible();
    expect(tablesTab().titleShown(theStory)).not.toBeInTheDocument();
    expect(tablesTab().titleShown(theFlowStory)).not.toBeInTheDocument();
  });

  test('the still table’s page glosses class with the accordions part that teaches it, in React', async () => {
    render(<TestApp at={theStillTablesPage}/>);

    await tablesTab().place();

    expect(demoPage.linksToPageIn(await tablesTab().recipe('still table'), demosAt('accordions/a-box-remembers-the-fold')))
      .toEqual([['A box remembers the fold, and a rule reads it', demosAt('accordions/a-box-remembers-the-fold')]]);
  });

  test('the still table’s page glosses class with the accordions part that teaches it, in vanilla', async () => {
    render(<TestApp at={demosAt('tables/the-still-table', '?world=vanilla')}/>);

    await tablesTab().place();

    expect(demoPage.linksToPageIn(await tablesTab().recipe('still table'), demosAt('accordions/a-box-remembers-the-fold')))
      .toEqual([['A box remembers the fold, and a rule reads it', demosAt('accordions/a-box-remembers-the-fold')]]);
  });

  test('the still table’s page cites the z-index part that defines a component', async () => {
    render(<TestApp at={theStillTablesPage}/>);

    await tablesTab().place();

    expect(demoPage.linksToPageIn(await tablesTab().recipe('still table'), demosAt('z-index/why-the-popover-wins')))
      .toEqual([['Why the popover wins', demosAt('z-index/why-the-popover-wins')]]);
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

    expect(await pageFoot.leadsOn()).toEqual([
      ['Previous: 3. Slice the design into stories', demosAt('tables/the-slices', '?world=vanilla')],
      ['Next: 5. Make the table live', demosAt('tables/the-live-table-and-the-store', '?world=vanilla')]
    ]);
  });

  test('the tables tab leads to the still table’s page instead of showing the still table', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    await tablesTab().partLink(theStillTable);

    expect(tablesTab().titleShown(theStillStory)).not.toBeInTheDocument();
  });

  test('should title the still table’s page with its tab', async () => {
    render(<TestApp at={theStillTablesPage}/>);

    expect(await demoTabs.title('Demos Tables')).toBeInTheDocument();
  });

  test('following the live table from the tables tab opens its page with both its stories open', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    await tablesTab().followPart(theLiveTable);

    expect(await appAddress.movedOnFrom(demosAt('tables'))).toBe(theLiveTablesPage);
    await tablesTab().place();
    expect(recipeFolds.story(demoPage.part(theLiveTable), theFlowStory)).toHaveAttribute('open');
    expect(recipeFolds.story(demoPage.part(theLiveTable), theStoreStory)).toHaveAttribute('open');
  });

  test('the still table’s page draws its story open at its own address', async () => {
    render(<TestApp at={theStillTablesPage}/>);

    await tablesTab().place();

    expect(recipeFolds.story(demoPage.part(theStillTable), theStillStory)).toHaveAttribute('open');
  });

  test('the live table’s page draws both its stories open at its own address', async () => {
    render(<TestApp at={theLiveTablesPage}/>);

    await tablesTab().place();

    const live = demoPage.part(theLiveTable);
    expect(recipeFolds.story(live, theFlowStory)).toHaveAttribute('open');
    expect(recipeFolds.story(live, theStoreStory)).toHaveAttribute('open');
  });

  test('the live table’s page names its section by its title', async () => {
    render(<TestApp at={theLiveTablesPage}/>);

    await tablesTab().place();

    expect(demoPage.part(theLiveTable)).toBeVisible();
  });

  test('the live table’s page names its steps for what they build', async () => {
    render(<TestApp at={theLiveTablesPage}/>);

    expect(await tablesTab().recipe('live table')).toBeVisible();
  });

  test('the live table’s page shows the live table, then only the live table and the store', async () => {
    render(<TestApp at={theLiveTablesPage}/>);

    await tablesTab().place();

    expect(aggregations.card()).toBeVisible();
    const live = demoPage.part(theLiveTable);
    expect(recipeFolds.story(live, theFlowStory)).toBeInTheDocument();
    expect(recipeFolds.story(live, theStoreStory)).toBeInTheDocument();
    expect(tablesTab().titleShown(theStillStory)).not.toBeInTheDocument();
    expect(tablesTab().tableShown('the features')).not.toBeInTheDocument();
  });

  test('the live table’s page links each term it glosses, and each tab it names, to that tab', async () => {
    render(<TestApp at={theLiveTablesPage}/>);

    await tablesTab().place();

    expect(demoPage.linksToTabsIn(await tablesTab().recipe('live table'))).toEqual([
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

  test('the live table’s page leads back to the still table’s page and on to the first tutorial, with the build carried', async () => {
    render(<TestApp at={demosAt('tables/the-live-table-and-the-store', '?world=vanilla')}/>);

    expect(await pageFoot.leadsOn()).toEqual([
      ['Previous: 4. Build the still table', demosAt('tables/the-still-table', '?world=vanilla')],
      ['Next: 6. Drag sort', demosAt('tables/sort', '?world=vanilla')]
    ]);
  });

  test('the tables tab leads to the live table’s page instead of showing the live table', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    await tablesTab().partLink(theLiveTable);

    expect(tablesTab().titleShown(theFlowStory)).not.toBeInTheDocument();
  });

  test('the tables tab gives the live table its minutes, as 12 min', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    expect(await tablesTab().minutesOf(theLiveTable)).toHaveTextContent(/^12 min$/);
  });

  test('should title the live table’s page with its tab', async () => {
    render(<TestApp at={theLiveTablesPage}/>);

    expect(await demoTabs.title('Demos Tables')).toBeInTheDocument();
  });
});

describe('a link saved to a story when it was on the tables tab', () => {
  test('should open the still table’s page with its story open', async () => {
    const old = demosAt('tables', '?living=still');
    render(<TestApp at={old}/>);

    expect(await appAddress.movedOnFrom(old)).toBe(theStillTablesPage);
    await tablesTab().place();
    expect(recipeFolds.story(demoPage.part(theStillTable), theStillStory)).toHaveAttribute('open');
  });

  test('should open the live table’s page with the flow story open, in the build the address carries', async () => {
    const old = demosAt('tables', '?world=vanilla&living=flow');
    render(<TestApp at={old}/>);

    expect(await appAddress.movedOnFrom(old)).toBe(demosAt('tables/the-live-table-and-the-store', '?world=vanilla'));
    await tablesTab().place();
    expect(recipeFolds.story(demoPage.part(theLiveTable), theFlowStory)).toHaveAttribute('open');
  });

  test('should open the live table’s page with the store story open', async () => {
    const old = demosAt('tables', '?living=store');
    render(<TestApp at={old}/>);

    expect(await appAddress.movedOnFrom(old)).toBe(theLiveTablesPage);
    await tablesTab().place();
    expect(recipeFolds.story(demoPage.part(theLiveTable), theStoreStory)).toHaveAttribute('open');
  });

  test('should open the live table’s page with both its stories open when it names them both', async () => {
    const old = demosAt('tables', '?living=flow%2Cstore');
    render(<TestApp at={old}/>);

    expect(await appAddress.movedOnFrom(old)).toBe(theLiveTablesPage);
    await tablesTab().place();
    const live = demoPage.part(theLiveTable);
    expect(recipeFolds.story(live, theFlowStory)).toHaveAttribute('open');
    expect(recipeFolds.story(live, theStoreStory)).toHaveAttribute('open');
  });

  test('should open the page of the story it names first when it names stories on two pages', async () => {
    const old = demosAt('tables', '?living=store%2Cstill');
    render(<TestApp at={old}/>);

    expect(await appAddress.movedOnFrom(old)).toBe(theLiveTablesPage);
  });

  test('should land on the story a saved link points at, on the story’s page', async () => {
    const old = demosAt('tables', '?living=flow');
    render(<TestApp at={`${old}#living-flow-story`}/>);

    expect(await appAddress.movedOnFrom(old)).toBe(theLiveTablesPage);
    await tablesTab().place();
    const flow = recipeFolds.story(demoPage.part(theLiveTable), theFlowStory);
    await waitFor(() => expect(recipeFolds.itemOf(flow)).toHaveFocus());
    expect(appAddress.fragment()).toBe('#living-flow-story');
  });

  test('should open the page of the story its place points to, whatever story it names', async () => {
    const old = demosAt('tables', '?living=flow');
    render(<TestApp at={`${old}#living-still-story`}/>);

    expect(await appAddress.movedOnFrom(old)).toBe(theStillTablesPage);
    expect(appAddress.fragment()).toBe('#living-still-story');
  });

  test('should open the page of the story its place points to, over the tutorial it names', async () => {
    const old = demosAt('tables', '?tut=menu&living=still');
    render(<TestApp at={`${old}#living-still-story`}/>);

    expect(await appAddress.movedOnFrom(old)).toBe(theStillTablesPage);
  });

  test('should land at the features on the tables tab when it points to their station, without the story', async () => {
    const old = demosAt('tables', '?world=vanilla&living=still');
    render(<TestApp at={`${old}#station-6`}/>);

    expect(await appAddress.movedOnFrom(old)).toBe(demosAt('tables', '?world=vanilla'));
    expect(appAddress.fragment()).toBe('#features-asked-for');
  });

  test('should open the part page of a build station it points to, with the dials', async () => {
    const old = demosAt('tables', '?world=vanilla');
    render(<TestApp at={`${old}#station-2`}/>);

    expect(await appAddress.movedOnFrom(old)).toBe(demosAt('tables/the-sketch', '?world=vanilla'));
    expect(appAddress.fragment()).toBe('');
  });

  test('should open the page of the story its place points to, when it names stories on two pages', async () => {
    const old = demosAt('tables', '?living=flow%2Cstill');
    render(<TestApp at={`${old}#living-still-story`}/>);

    expect(await appAddress.movedOnFrom(old)).toBe(theStillTablesPage);
  });

  test('should stay on the tables tab when it names no story a page tells', async () => {
    const old = demosAt('tables', '?living=nowhere');
    render(<TestApp at={old}/>);

    await tablesTab().partLink(theLiveTable);
    expect(appAddress.shown()).toBe(old);
  });
});

describe('a part page reached by a link saved with a story or a tutorial in its address', () => {
  test('should stay on its own page when the address names a story', async () => {
    const saved = demosAt('tables/the-need-and-its-clues', '?world=vanilla&living=still');
    render(<TestApp at={saved}/>);

    await pageFoot.leadsOn();

    expect(appAddress.shown()).toBe(saved);
  });

  test('should stay on its own page when the address names a tutorial', async () => {
    const saved = demosAt('tables/the-need-and-its-clues', '?world=vanilla&tut=menu');
    render(<TestApp at={saved}/>);

    await pageFoot.leadsOn();

    expect(appAddress.shown()).toBe(saved);
  });

  test('should lead on without the story the address names', async () => {
    render(<TestApp at={demosAt('tables/the-need-and-its-clues', '?world=vanilla&living=still')}/>);

    expect(await pageFoot.leadsOn()).toEqual([
      ['Next: 2. Sketch a design from the need', demosAt('tables/the-sketch', '?world=vanilla')]
    ]);
  });

  test('should lead on with the dials alone, leaving another tab’s story behind', async () => {
    render(<TestApp at={demosAt('tables/the-need-and-its-clues', '?world=vanilla&graph=price')}/>);

    expect(await pageFoot.leadsOn()).toEqual([
      ['Next: 2. Sketch a design from the need', demosAt('tables/the-sketch', '?world=vanilla')]
    ]);
  });

  test('should lead on without the tutorial the address names', async () => {
    render(<TestApp at={demosAt('tables/the-need-and-its-clues', '?world=vanilla&tut=menu')}/>);

    expect(await pageFoot.leadsOn()).toEqual([
      ['Next: 2. Sketch a design from the need', demosAt('tables/the-sketch', '?world=vanilla')]
    ]);
  });
});
