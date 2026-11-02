import {TestApp} from '@__test_support/TestApp';
import {demosAt, demoTabs} from '@pages/Demos/__test_support';
import {expect, test} from 'vitest';
import {render, screen, within} from '@testing-library/react';
import {appAddress} from '@__test_support/address';
import {site} from '@pages/__test_support';
import {Paths} from '@pages/Paths';

describe('The Demos page', () => {
  test('should mark Accordions as the current tab when it is the demo shown', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const tabs = within(await screen.findByRole('navigation', {name: 'demos'}));

    expect(tabs.getByRole('link', {name: 'Accordions', current: 'page'})).toBeInTheDocument();
    expect(tabs.getAllByRole('link', {current: 'page'})).toHaveLength(1);
  });

  test('should mark Drag sort as the current tab when it is the demo shown', async () => {
    render(<TestApp at={demosAt('drag-and-drop')}/>);

    const tabs = within(await screen.findByRole('navigation', {name: 'demos'}));

    expect(tabs.getByRole('link', {name: 'Drag sort', current: 'page'})).toBeInTheDocument();
    expect(tabs.getAllByRole('link', {current: 'page'})).toHaveLength(1);
  });

  test('should mark Tables as the current tab when it is the demo shown', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    const tabs = within(await screen.findByRole('navigation', {name: 'demos'}));

    expect(tabs.getByRole('link', {name: 'Tables', current: 'page'})).toBeInTheDocument();
    expect(tabs.getAllByRole('link', {current: 'page'})).toHaveLength(1);
  });

  test('should run its tabs in the order the opening names them, simple to expert', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    const tabs = within(await screen.findByRole('navigation', {name: 'demos'})).getAllByRole('link');

    expect(tabs.map(tab => tab.textContent)).toEqual(['Accordions', 'Z-index', 'Drag sort', 'Charts', 'Tables']);
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
    const from = `${Paths.demos}?tab=tables&world=vanilla&tut=menu`;
    render(<TestApp at={from}/>);

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('tables', '?world=vanilla&tut=menu'));
  });

  test('an old drag sort address with its pace lands on the Drag sort tab with its pace kept', async () => {
    const from = `${Paths.demos}?tab=dragAndDrop&pace=lazy`;
    render(<TestApp at={from}/>);

    expect(await appAddress.movedOnFrom(from)).toBe(demosAt('drag-and-drop', '?pace=lazy'));
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

  test('a tab switch keeps the page, so the exhibits already dealt stay as they were', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    const dealt = (await demoTabs.arrivedOn('Accordions')).textContent;

    await demoTabs.open('Charts');
    await demoTabs.arrivedOn('Charts');
    await demoTabs.open('Accordions');

    expect((await demoTabs.arrivedOn('Accordions')).textContent).toBe(dealt);
  });

  test('should name the Accordions tab by its region, with no heading inside repeating it', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    await demoTabs.open('Accordions');

    const region = await screen.findByRole('region', {name: 'Accordions'});
    expect(within(region).queryByRole('heading', {name: 'Accordions'})).not.toBeInTheDocument();
  });

  test('should name the Z-index tab by its region, with no heading inside repeating it', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    await demoTabs.open('Z-index');

    const region = await screen.findByRole('region', {name: 'Z-index'});
    expect(within(region).queryByRole('heading', {name: 'Z-index'})).not.toBeInTheDocument();
  });

  test('should name the Drag sort tab by its region, with no heading inside repeating it', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    await demoTabs.open('Drag sort');

    const region = await screen.findByRole('region', {name: 'Drag sort'});
    expect(within(region).queryByRole('heading', {name: 'Drag sort'})).not.toBeInTheDocument();
  });

  test('should name the Charts tab by its region, with no heading inside repeating it', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    await demoTabs.open('Charts');

    const region = await screen.findByRole('region', {name: 'Charts'});
    expect(within(region).queryByRole('heading', {name: 'Charts'})).not.toBeInTheDocument();
  });

  test('should name the Tables tab by its region, with no heading inside repeating it', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    await demoTabs.open('Tables');

    const region = await screen.findByRole('region', {name: 'Tables'});
    expect(within(region).queryByRole('heading', {name: 'Tables'})).not.toBeInTheDocument();
  });

  test('should title the page Demos Accordions, the name on its tab, once that tab is chosen', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    await demoTabs.open('Accordions');

    expect(await screen.findByRole('heading', {level: 1, name: 'Demos Accordions'})).toBeInTheDocument();
  });

  test('should title the page Demos Z-index, the name on its tab, once that tab is chosen', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    await demoTabs.open('Z-index');

    expect(await screen.findByRole('heading', {level: 1, name: 'Demos Z-index'})).toBeInTheDocument();
  });

  test('should title the page Demos Drag sort, the name on its tab, once that tab is chosen', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    await demoTabs.open('Drag sort');

    expect(await screen.findByRole('heading', {level: 1, name: 'Demos Drag sort'})).toBeInTheDocument();
  });

  test('should title the page Demos Charts, the name on its tab, once that tab is chosen', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    await demoTabs.open('Charts');

    expect(await screen.findByRole('heading', {level: 1, name: 'Demos Charts'})).toBeInTheDocument();
  });

  test('should title the page Demos Tables, the name on its tab, once that tab is chosen', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    await demoTabs.open('Tables');

    expect(await screen.findByRole('heading', {level: 1, name: 'Demos Tables'})).toBeInTheDocument();
  });
});
