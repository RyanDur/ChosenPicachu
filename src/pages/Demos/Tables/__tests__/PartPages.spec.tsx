import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {appAddress} from '@__test_support/address';
import {demoPage, demosAt, demoTabs, pageFoot} from '@pages/Demos/__test_support';
import {aggregations, tablesTab} from '@pages/Demos/Tables/__test_support';

const theNeed = 'Start with the need, and let it pick the element';
const theNeedsPage = demosAt('tables/the-need-and-its-clues');
const theSketch = 'Sketch a design from the need';
const theSketchsPage = demosAt('tables/the-sketch');
const unanswered = 'what a design cannot tell you';

describe('the tables tab’s parts, each on its own page', () => {
  test('following the need and its clues from the tables tab opens its page', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    await tablesTab().follow(theNeed);

    expect(await appAddress.movedOnFrom(demosAt('tables'))).toBe(theNeedsPage);
    expect(await tablesTab().partPlace()).toBeVisible();
    expect(tablesTab().table('the clues').rows).toHaveLength(5);
  });

  test('the need’s page shows the live table, then only the need and its clues', async () => {
    render(<TestApp at={theNeedsPage}/>);

    await tablesTab().partPlace();

    expect(aggregations.card()).toBeVisible();
    const clues = tablesTab().table('the clues');
    expect(clues.columns).toHaveLength(2);
    expect(clues.rows).toHaveLength(5);
    expect(tablesTab().titleShown('Sketch a design from the need')).not.toBeInTheDocument();
  });

  test('the need’s page says its place among the parts', async () => {
    render(<TestApp at={theNeedsPage}/>);

    expect(await tablesTab().partPlace()).toHaveTextContent('Tables · part 1 of 5');
  });

  test('the need’s page heads the need once, as its title', async () => {
    render(<TestApp at={theNeedsPage}/>);

    await tablesTab().partPlace();

    expect(tablesTab().titles(theNeed, 2)).toHaveLength(1);
    expect(tablesTab().titles(theNeed)).toHaveLength(1);
  });

  test('the need’s page links the tab its clues name', async () => {
    render(<TestApp at={theNeedsPage}/>);

    await tablesTab().partPlace();

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
    expect(await tablesTab().partPlace()).toBeVisible();
    expect(tablesTab().titleShown(unanswered)).toBeVisible();
  });

  test('the sketch’s page shows the live table, then only the sketch', async () => {
    render(<TestApp at={theSketchsPage}/>);

    await tablesTab().partPlace();

    expect(aggregations.card()).toBeVisible();
    expect(tablesTab().titleShown(unanswered)).toBeVisible();
    expect(tablesTab().tableShown('the clues')).not.toBeInTheDocument();
    expect(tablesTab().titleShown('Slice the design into stories')).not.toBeInTheDocument();
  });

  test('the sketch’s table names its rows and columns', async () => {
    render(<TestApp at={theSketchsPage}/>);

    await tablesTab().partPlace();

    expect(tablesTab().columnsIn(theSketch)).toEqual(['lookback', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
    expect(tablesTab().headersIn(theSketch).rows).toHaveLength(5);
  });

  test('the sketch’s page says its place among the parts', async () => {
    render(<TestApp at={theSketchsPage}/>);

    expect(await tablesTab().partPlace()).toHaveTextContent('Tables · part 2 of 5');
  });

  test('the sketch’s page heads the sketch once, as its title', async () => {
    render(<TestApp at={theSketchsPage}/>);

    await tablesTab().partPlace();

    expect(tablesTab().titles(theSketch, 2)).toHaveLength(1);
    expect(tablesTab().titles(theSketch)).toHaveLength(1);
  });

  test('the sketch’s page leads back to the need’s page and on to the slices on the tables tab, by number and title, with the build carried', async () => {
    render(<TestApp at={demosAt('tables/the-sketch', '?world=vanilla')}/>);

    expect(await pageFoot.leadsOn('the tables parts')).toEqual([
      ['Previous: 1. Start with the need, and let it pick the element', demosAt('tables/the-need-and-its-clues', '?world=vanilla')],
      ['Next: 3. Slice the design into stories', `${demosAt('tables', '?world=vanilla')}#phase-stories`]
    ]);
  });

  test('the tables tab leads to the sketch’s page instead of showing the sketch', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    await tablesTab().tutorialLink(theSketch);

    expect(tablesTab().titleShown(unanswered)).not.toBeInTheDocument();
  });

  test('the tables tab says the sketch takes one minute to read', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    expect(await tablesTab().readingTime('1 minute to read')).toBeVisible();
  });

  test('should title the sketch’s page with the tab and the part', async () => {
    render(<TestApp at={theSketchsPage}/>);

    expect(await demoTabs.title(`Demos Tables · ${theSketch}`)).toBeInTheDocument();
  });
});
