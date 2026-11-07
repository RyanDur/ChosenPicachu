import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {appAddress} from '@__test_support/address';
import {demoPage, demosAt, demoTabs} from '@pages/Demos/__test_support';
import {aggregations, tableControls, tablesTab} from '@pages/Demos/Tables/__test_support';
import {site} from '@pages/__test_support';

describe('the table tutorials, each on its own page', () => {
  test('following a tutorial from the tables tab opens that tutorial’s page', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    await tablesTab().openTutorial('Sort menu');

    expect(await appAddress.movedOnFrom(demosAt('tables'))).toBe(demosAt('tables/menu'));
    expect(await tablesTab().recipe('sort menu')).toBeVisible();
  });

  test('the tables tab lists its tutorials in the order they build on each other: Drag sort, Sort menu, Drag resize', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    expect(await tablesTab().tutorialsListed()).toEqual(['Drag sort', 'Sort menu', 'Drag resize']);
  });

  test('the tables tab shows none of the tutorials it lists', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    await tablesTab().tutorialLink('Drag sort');

    expect(tablesTab().recipeShown('drag sort')).not.toBeInTheDocument();
    expect(tablesTab().recipeShown('sort menu')).not.toBeInTheDocument();
    expect(tablesTab().recipeShown('drag resize')).not.toBeInTheDocument();
  });

  test('a tutorial’s page shows the live table, then only that tutorial', async () => {
    render(<TestApp at={demosAt('tables/resize')}/>);

    expect(await tablesTab().recipe('drag resize')).toBeVisible();
    expect(aggregations.card()).toBeVisible();
    expect(tablesTab().recipeShown('drag sort')).not.toBeInTheDocument();
    expect(tablesTab().recipeShown('sort menu')).not.toBeInTheDocument();
    expect(tablesTab().titleShown('Slice the design into stories')).not.toBeInTheDocument();
  });

  test('the drag sort tutorial’s page brings the table’s controls', async () => {
    render(<TestApp at={demosAt('tables/sort')}/>);

    expect(await tableControls.readout('<EagerTable className="hide animated"/>')).toBeVisible();
  });

  test('the drag sort tutorial’s page links the dials it glosses to the accordions tab', async () => {
    render(<TestApp at={demosAt('tables/sort')}/>);

    await tablesTab().recipe('drag sort');

    expect(demoPage.linksToTabsIn(demoPage.part('Drag sort'))).toContainEqual(['dials', demosAt('accordions')]);
  });

  test('a tutorial’s page leads back to the tables tab', async () => {
    render(<TestApp at={demosAt('tables/menu')}/>);

    await tablesTab().backToTheTab();

    expect(await appAddress.movedOnFrom(demosAt('tables/menu'))).toBe(demosAt('tables'));
  });

  test('a tutorial’s page says its place among the tutorials', async () => {
    render(<TestApp at={demosAt('tables/menu')}/>);

    expect(await tablesTab().place()).toHaveTextContent('Tables · tutorial 2 of 3');
  });

  test('the build chosen on a tutorial’s page carries back to the tables tab', async () => {
    const from = demosAt('tables/menu', '?world=vanilla');
    render(<TestApp at={from}/>);

    await tablesTab().backToTheTab();

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('tables', '?world=vanilla'));
  });

  test('a tutorial’s page links to station 5 of the tables tab, carrying the chosen build', async () => {
    const from = demosAt('tables/menu', '?world=vanilla');
    render(<TestApp at={from}/>);

    await tablesTab().readTheStationFirst();

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('tables', '?world=vanilla'));
    expect(appAddress.fragment()).toBe('#station-5');
  });

  test('the build chosen on the tables tab carries into the tutorial it opens', async () => {
    render(<TestApp at={demosAt('tables', '?world=vanilla')}/>);

    await tablesTab().openTutorial('Drag resize');

    expect(await appAddress.movedOnFrom(demosAt('tables', '?world=vanilla'))).toBe(demosAt('tables/resize', '?world=vanilla'));
  });

  test('a tutorial’s page has its own build dial', async () => {
    render(<TestApp at={demosAt('tables/menu')}/>);

    await tablesTab().pick('Vanilla');

    expect(await appAddress.movedOnFrom(demosAt('tables/menu'))).toBe(demosAt('tables/menu', '?world=vanilla'));
  });

  test('an address naming no tutorial says there is no room there', async () => {
    render(<TestApp at={demosAt('tables/scroll')}/>);

    expect(await site.roomSays('There is no room at this address.')).toBeVisible();
  });

  test('should title a tutorial’s page with the tab and the tutorial', async () => {
    render(<TestApp at={demosAt('tables/menu')}/>);

    expect(await demoTabs.title('Demos Tables · Sort menu')).toBeInTheDocument();
  });

  test('should keep Tables as the current tab on a tutorial’s page', async () => {
    render(<TestApp at={demosAt('tables/resize')}/>);

    expect(await demoTabs.current()).toEqual(['Tables']);
  });
});
