import {TestApp} from '@__test_support/TestApp';
import {demosAt, demoTabRow, demoTabs} from '@pages/Demos/__test_support';
import {expect, test} from 'vitest';
import {render} from '@testing-library/react';
import {appAddress} from '@__test_support/address';
import {site} from '@pages/__test_support';
import {Paths} from '@navigation';

describe('The Demos page', () => {
  test('should mark Accordions as the current tab when it is the demo shown', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    expect(await demoTabs.current()).toEqual(['Accordions']);
  });

  test('should mark Drag sort as the current tab when it is the demo shown', async () => {
    render(<TestApp at={demosAt('drag-and-drop')}/>);

    expect(await demoTabs.current()).toEqual(['Drag sort']);
  });

  test('should mark Tables as the current tab when it is the demo shown', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    expect(await demoTabs.current()).toEqual(['Tables']);
  });

  test('should run its tabs in the order the opening names them, simple to expert', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    expect(await demoTabs.names()).toEqual(['Accordions', 'Z-index', 'Drag sort', 'Charts', 'Tables']);
  });

  test('the tab row on the Z-index tab names the tab the reader is on', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    expect(await demoTabRow.current()).toBe('Z-index');
  });

  test('the tab row on the Z-index tab offers Accordions as the tab before it', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    expect(await demoTabRow.previous()).toHaveAccessibleName('Previous tab, Accordions');
  });

  test('the tab row on the Z-index tab leads back to the Accordions tab', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    expect(await demoTabRow.previous()).toHaveAttribute('href', demosAt('accordions'));
  });

  test('the tab row on the Z-index tab offers Drag sort as the tab after it', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    expect(await demoTabRow.next()).toHaveAccessibleName('Next tab, Drag sort');
  });

  test('the tab row on the Z-index tab leads on to the Drag sort tab', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    expect(await demoTabRow.next()).toHaveAttribute('href', demosAt('drag-and-drop'));
  });

  test('the tab row on the first tab, Accordions, offers no tab before it', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    expect(await demoTabRow.previous()).not.toBeInTheDocument();
  });

  test('the tab row on the last tab, Tables, offers no tab after it', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    expect(await demoTabRow.next()).not.toBeInTheDocument();
  });

  test('the charts a reader set up come back when they return to the charts tab', async () => {
    render(<TestApp at={demosAt('charts', '?charts=price,candles:day')}/>);
    await demoTabs.open('Tables');
    await demoTabs.arrivedOn('Tables');

    await demoTabs.open('Charts');

    await demoTabs.arrivedOn('Charts');
    expect(new URLSearchParams(appAddress.search().textContent).get('charts')).toBe('price,candles:day');
  });

  test('the demos page’s own address lands on the Accordions tab', async () => {
    const from = Paths.demos;
    render(<TestApp at={from}/>);

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('accordions'));
  });

  test('the demos page’s address with a world lands on the Accordions tab with its world kept', async () => {
    const from = `${Paths.demos}?world=vanilla`;
    render(<TestApp at={from}/>);

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('accordions', '?world=vanilla'));
  });

  test('an old tables address with its dials lands on the Tables tab with its dials kept', async () => {
    const from = `${Paths.demos}?tab=tables&world=vanilla`;
    render(<TestApp at={from}/>);

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('tables', '?world=vanilla'));
  });

  test('an old drag sort address with its pace lands on the Drag sort tab with its pace kept', async () => {
    const from = `${Paths.demos}?tab=dragAndDrop&pace=lazy`;
    render(<TestApp at={from}/>);

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('drag-and-drop', '?pace=lazy'));
  });

  test('an old tables address pointing to a station lands on that station’s part page', async () => {
    const from = `${Paths.demos}?tab=tables#station-5`;
    render(<TestApp at={from}/>);

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('tables/the-live-table-and-the-store'));
    expect(appAddress.fragment()).toBe('');
  });

  test('an old tables address repeating a dial lands on the Tables tab with every value kept', async () => {
    const from = `${Paths.demos}?tab=tables&col=a&col=b`;
    render(<TestApp at={from}/>);

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('tables', '?col=a&col=b'));
  });

  test('an old address naming the behavior tab lands on the Accordions tab', async () => {
    const from = `${Paths.demos}?tab=behavior`;
    render(<TestApp at={from}/>);

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('accordions'));
  });

  test('an old address naming the constructor tab lands on the Accordions tab', async () => {
    const from = `${Paths.demos}?tab=constructor`;
    render(<TestApp at={from}/>);

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('accordions'));
  });

  test('a tab the demos do not have is no such room', async () => {
    render(<TestApp at={demosAt('behavior')}/>);

    expect(await site.pageTitled()).toHaveTextContent('No such room');
  });

  test('each tab links to its own address and carries the dials along', async () => {
    render(<TestApp at={demosAt('tables', '?world=vanilla')}/>);

    expect(await demoTabs.addresses()).toEqual(
      ['accordions', 'z-index', 'drag-and-drop', 'charts', 'tables'].map(topic => demosAt(topic, '?world=vanilla')));
  });

  test('returning to the Accordions tab shows the exhibits it showed before', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    const dealt = (await demoTabs.arrivedOn('Accordions')).textContent;

    await demoTabs.open('Charts');
    await demoTabs.arrivedOn('Charts');
    await demoTabs.open('Accordions');

    expect((await demoTabs.arrivedOn('Accordions')).textContent).toBe(dealt);
  });

  test('a tab switch leaves focus on the tab the reader chose, since the tabs stay where they were', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.arrivedOn('Accordions');

    await demoTabs.open('Z-index');
    await demoTabs.arrivedOn('Z-index');

    expect(await demoTabs.tab('Z-index')).toHaveFocus();
  });

  test('should name the Accordions tab by its region, with no heading inside repeating it', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    await demoTabs.open('Accordions');

    expect(await demoTabs.headingRepeatingItsName('Accordions')).not.toBeInTheDocument();
  });

  test('should name the Z-index tab by its region, with no heading inside repeating it', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    await demoTabs.open('Z-index');

    expect(await demoTabs.headingRepeatingItsName('Z-index')).not.toBeInTheDocument();
  });

  test('should name the Drag sort tab by its region, with no heading inside repeating it', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    await demoTabs.open('Drag sort');

    expect(await demoTabs.headingRepeatingItsName('Drag sort')).not.toBeInTheDocument();
  });

  test('should name the Charts tab by its region, with no heading inside repeating it', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    await demoTabs.open('Charts');

    expect(await demoTabs.headingRepeatingItsName('Charts')).not.toBeInTheDocument();
  });

  test('should name the Tables tab by its region, with no heading inside repeating it', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    await demoTabs.open('Tables');

    expect(await demoTabs.headingRepeatingItsName('Tables')).not.toBeInTheDocument();
  });

  test('should title the page Demos Accordions, the name on its tab, once that tab is chosen', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    await demoTabs.open('Accordions');

    expect(await demoTabs.title('Demos Accordions')).toBeInTheDocument();
  });

  test('should title the page Demos Z-index, the name on its tab, once that tab is chosen', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    await demoTabs.open('Z-index');

    expect(await demoTabs.title('Demos Z-index')).toBeInTheDocument();
  });

  test('should title the page Demos Drag sort, the name on its tab, once that tab is chosen', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    await demoTabs.open('Drag sort');

    expect(await demoTabs.title('Demos Drag sort')).toBeInTheDocument();
  });

  test('should title the page Demos Charts, the name on its tab, once that tab is chosen', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    await demoTabs.open('Charts');

    expect(await demoTabs.title('Demos Charts')).toBeInTheDocument();
  });

  test('should title the page Demos Tables, the name on its tab, once that tab is chosen', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    await demoTabs.open('Tables');

    expect(await demoTabs.title('Demos Tables')).toBeInTheDocument();
  });
});
