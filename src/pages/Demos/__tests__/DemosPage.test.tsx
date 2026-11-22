import {TestApp} from '@__test_support/TestApp';
import {demoPage, demosAt, demoTabPager, demoTabs} from '@pages/Demos/__test_support';
import {expect, test} from 'vitest';
import {render, waitFor} from '@testing-library/react';
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

  test('should run its tabs from Accordions to Tables, each adding to the ones before', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    expect(await demoTabs.names()).toEqual(['Accordions', 'Z-index', 'Drag sort', 'Charts', 'Tables']);
  });

  test('a part’s page should open with the Demos introduction above its tabs', async () => {
    render(<TestApp at={demosAt('z-index/why-9999-still-loses')}/>);

    await demoPage.findTitle('Why 9999 still loses');

    expect(demoPage.introduction()).toBeInTheDocument();
  });

  test('a tables tutorial’s page should open with the Demos introduction above its tabs', async () => {
    render(<TestApp at={demosAt('tables/menu')}/>);

    await demoPage.findTitle('Demos Tables · Sort menu');

    expect(demoPage.introduction()).toBeInTheDocument();
  });

  test('the Tables tab opens with the Demos introduction above its tabs', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    await demoPage.findTitle('Demos Tables');

    expect(demoPage.introduction()).toBeInTheDocument();
  });

  test('the tab row on the Z-index tab names the tab the reader is on', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    expect(await demoTabPager.current()).toEqual(['Z-index']);
  });

  test('the tab row on a part page of the Z-index tab leads back to the Z-index tab', async () => {
    render(<TestApp at={demosAt('z-index/why-third-is-on-top')}/>);

    expect(await demoTabPager.currentTabButNotThePage()).toHaveAttribute('href', demosAt('z-index'));
  });

  test('the tab row on the Z-index tab offers Accordions as the tab before it', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    expect(await demoTabPager.previous()).toHaveAccessibleName('Previous tab, Accordions');
  });

  test('the tab row on the Z-index tab leads back to the Accordions tab', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    expect(await demoTabPager.previous()).toHaveAttribute('href', demosAt('accordions'));
  });

  test('the tab row on the Z-index tab offers Drag sort as the tab after it', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    expect(await demoTabPager.next()).toHaveAccessibleName('Next tab, Drag sort');
  });

  test('the tab row on the Z-index tab leads on to the Drag sort tab', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    expect(await demoTabPager.next()).toHaveAttribute('href', demosAt('drag-and-drop'));
  });

  test('the tab row keeps a keyboard reader on its next tab after they press it', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    await demoTabPager.goNextByKeyboard();

    await waitFor(async () => expect(await demoTabPager.next()).toHaveAccessibleName('Next tab, Charts'));
    expect(await demoTabPager.next()).toHaveFocus();
  });

  test('the tab row keeps a keyboard reader on the name of the last tab after they press their way onto it', async () => {
    render(<TestApp at={demosAt('charts')}/>);

    await demoTabPager.goNextByKeyboard();

    await waitFor(async () => expect(await demoTabPager.current()).toEqual(['Tables']));
    expect(await demoTabPager.currentTab()).toHaveFocus();
  });

  test('the tab row keeps a keyboard reader on the name of the first tab after they press their way back onto it', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    await demoTabPager.goPreviousByKeyboard();

    await waitFor(async () => expect(await demoTabPager.current()).toEqual(['Accordions']));
    expect(await demoTabPager.currentTab()).toHaveFocus();
  });

  test('the tab row on the first tab, Accordions, offers no tab before it', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    expect(await demoTabPager.previous()).not.toBeInTheDocument();
  });

  test('the tab row on the last tab, Tables, offers no tab after it', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    expect(await demoTabPager.next()).not.toBeInTheDocument();
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
