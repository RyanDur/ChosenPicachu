import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {appAddress} from '@__test_support/address';
import {demoPage, demosAt, demoTabs, pageFoot} from '@pages/Demos/__test_support';
import {aggregations, tableControls, tablesTab} from '@pages/Demos/Tables/__test_support';
import {site} from '@pages/__test_support';

describe('the table tutorials, each on its own page', () => {
  test('following a tutorial from the tables tab opens that tutorial’s page', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    await tablesTab().follow('Sort menu');

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

  test('should say on the tables tab how long each tutorial takes to read', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    expect(await tablesTab().tutorialReadingTimeOf('Sort menu')).toHaveTextContent(/^7 minutes to read$/);
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

  test('a tutorial’s page says its place in the book', async () => {
    render(<TestApp at={demosAt('tables/menu')}/>);

    expect(await tablesTab().place()).toHaveTextContent('Tables · part 7 of 8');
  });

  test('the first tutorial’s page leads back to the live table’s page and on to the next tutorial, with the build carried', async () => {
    render(<TestApp at={demosAt('tables/sort', '?world=vanilla')}/>);

    expect(await pageFoot.leadsOn('the tables parts')).toEqual([
      ['Previous: 5. Make the table live', demosAt('tables/the-live-table-and-the-store', '?world=vanilla')],
      ['Next: 7. Sort menu', demosAt('tables/menu', '?world=vanilla')]
    ]);
  });

  test('a tutorial’s page leads back to the tutorial before it and on to the one after it', async () => {
    render(<TestApp at={demosAt('tables/menu', '?world=vanilla')}/>);

    expect(await pageFoot.leadsOn('the tables parts')).toEqual([
      ['Previous: 6. Drag sort', demosAt('tables/sort', '?world=vanilla')],
      ['Next: 8. Drag resize', demosAt('tables/resize', '?world=vanilla')]
    ]);
  });

  test('the last tutorial’s page leads back and nowhere on, as the last part of every book does', async () => {
    render(<TestApp at={demosAt('tables/resize', '?world=vanilla')}/>);

    expect(await pageFoot.leadsOn('the tables parts')).toEqual([
      ['Previous: 7. Sort menu', demosAt('tables/menu', '?world=vanilla')]
    ]);
  });

  test('the build chosen on a tutorial’s page carries back to the tables tab', async () => {
    const from = demosAt('tables/menu', '?world=vanilla');
    render(<TestApp at={from}/>);

    await tablesTab().backToTheTab();

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('tables', '?world=vanilla'));
  });

  test('a tutorial’s page links to the live table’s page, where it starts, with the build carried and both stories open', async () => {
    const from = demosAt('tables/menu', '?world=vanilla');
    render(<TestApp at={from}/>);

    await tablesTab().follow('Make the table live');

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('tables/the-live-table-and-the-store', '?world=vanilla'));
  });

  test('the build chosen on the tables tab carries into the tutorial it opens', async () => {
    render(<TestApp at={demosAt('tables', '?world=vanilla')}/>);

    await tablesTab().follow('Drag resize');

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

describe('a link saved to an old tables tutorial address', () => {
  test('should open the tutorial it names at that tutorial’s own address', async () => {
    const old = demosAt('tables', '?tut=menu');
    render(<TestApp at={old}/>);

    expect(await appAddress.movedOnFrom(old)).toBe(demosAt('tables/menu'));
    expect(await tablesTab().recipe('sort menu')).toBeVisible();
  });

  test('should open the tutorial in the build the address carries', async () => {
    const old = demosAt('tables', '?tut=resize&world=vanilla');
    render(<TestApp at={old}/>);

    expect(await appAddress.movedOnFrom(old)).toBe(demosAt('tables/resize', '?world=vanilla'));
  });

  test('should carry the dials alone, leaving what else the address holds', async () => {
    const old = demosAt('tables', '?tut=resize&world=vanilla&note=a%26b&col=a&col=b');
    render(<TestApp at={old}/>);

    expect(await appAddress.movedOnFrom(old)).toBe(demosAt('tables/resize', '?world=vanilla'));
  });

  test('should keep the place in the page the address points to', async () => {
    const old = demosAt('tables', '?tut=resize#station-3');
    render(<TestApp at={old}/>);

    expect(await appAddress.movedOnFrom(old)).toBe(demosAt('tables/resize'));
    expect(appAddress.fragment()).toBe('#station-3');
  });

  test('should open the tutorial it names when it also names a story, and carry neither on', async () => {
    const old = demosAt('tables', '?tut=menu&living=still');
    render(<TestApp at={old}/>);

    expect(await appAddress.movedOnFrom(old)).toBe(demosAt('tables/menu'));
  });

  test('should stay on the tables tab and its list when it names no tutorial', async () => {
    const old = demosAt('tables', '?tut=scroll');
    render(<TestApp at={old}/>);

    expect(await tablesTab().tutorialsListed()).toEqual(['Drag sort', 'Sort menu', 'Drag resize']);
    expect(appAddress.shown()).toBe(old);
  });
});
