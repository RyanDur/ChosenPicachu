import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {Paths} from '@navigation';
import {demoPage, demosAt, demoTabs, pageFoot, partsIndex} from '@pages/Demos/__test_support';
import {zIndexParts} from '@pages/Demos/ZIndexDemo/part-pages';
import {stackingPile, zIndexTab} from '@pages/Demos/ZIndexDemo/__test_support';
import {site} from '@pages/__test_support';

const thirdOnTop = 'z-index/why-third-is-on-top';

describe('why Third is on top, on its own page', () => {
  test('should say its place in the z-index book', async () => {
    render(<TestApp at={demosAt(thirdOnTop)}/>);

    expect(await zIndexTab.place()).toHaveTextContent('Z-index · part 1 of 6');
  });

  test('should raise the card the address names in its pile', async () => {
    render(<TestApp at={demosAt(thirdOnTop, '?raised=second')}/>);

    const raised = await stackingPile.findCardRaised();

    expect(stackingPile.card(raised, 'Second')).toBeChecked();
  });

  test('should lead on to the part after it, on its own page, by number and title, with the raised card carried', async () => {
    render(<TestApp at={demosAt(thirdOnTop, '?raised=second')}/>);

    expect(await pageFoot.leadsOn('the z-index parts')).toEqual([
      ['Next: 2. Why 9999 still loses', demosAt('z-index/why-9999-still-loses', '?raised=second')]
    ]);
  });

  test('should link the accordions tab its opener names', async () => {
    render(<TestApp at={demosAt(thirdOnTop)}/>);

    const page = await demoTabs.arrivedOn('Z-index');

    expect(demoPage.linksToTabsIn(page)).toEqual([
      ['accordions tab', `${Paths.demos}accordions/`]
    ]);
  });

  test('should send the class its opener assumes to the accordions part that defines it', async () => {
    render(<TestApp at={demosAt(thirdOnTop)}/>);

    const page = await demoTabs.arrivedOn('Z-index');

    expect(demoPage.linksToPageIn(page, demosAt('accordions/a-box-remembers-the-fold')))
      .toContainEqual(['a class', demosAt('accordions/a-box-remembers-the-fold')]);
  });

  test('should send its gloss of class to the accordions part that defines it, by the part’s title', async () => {
    render(<TestApp at={demosAt(thirdOnTop)}/>);

    const page = await demoTabs.arrivedOn('Z-index');

    expect(demoPage.linksToPageIn(page, demosAt('accordions/a-box-remembers-the-fold')))
      .toContainEqual(['A box remembers the fold, and a rule reads it', demosAt('accordions/a-box-remembers-the-fold')]);
  });

  test('should link rules at its first use to the accordions tab’s fold choices, with the raised card carried', async () => {
    render(<TestApp at={demosAt(thirdOnTop, '?raised=second')}/>);

    await demoTabs.arrivedOn('Z-index');

    expect(demoPage.signpost('rules'))
      .toHaveAttribute('href', `${demosAt('accordions', '?raised=second')}#fold-choices-heading`);
  });

  test('should title the page with the tab and the part', async () => {
    render(<TestApp at={demosAt(thirdOnTop)}/>);

    expect(await demoTabs.title('Demos Z-index · Why Third is on top')).toBeInTheDocument();
  });

  test('should keep Z-index as the current tab', async () => {
    render(<TestApp at={demosAt(thirdOnTop)}/>);

    expect(await demoTabs.currentButNotThePage()).toEqual(['Z-index']);
  });

  test('an address naming no part of the z-index tab says there is no room there', async () => {
    render(<TestApp at={demosAt('z-index/why-first-is-on-top')}/>);

    expect(await site.roomSays('There is no room at this address.')).toBeVisible();
  });
});

describe('a z-index part’s page', () => {
  test('holds the six parts beside the part, as the tab does', async () => {
    render(<TestApp at={demosAt('z-index/why-9999-still-loses')}/>);

    const index = await partsIndex.find();

    expect(partsIndex.titlesIn(index)).toEqual(zIndexParts.inOrder.map(part => zIndexParts.told(part).name));
  });

  test('marks the part the reader is on as the current page', async () => {
    render(<TestApp at={demosAt('z-index/why-9999-still-loses')}/>);

    const index = await partsIndex.find();

    expect(partsIndex.currentIn(index)).toHaveAccessibleName('Why 9999 still loses');
  });

  test('says beside the part how long the parts take together', async () => {
    render(<TestApp at={demosAt('z-index/why-9999-still-loses')}/>);

    expect(await demoPage.panel('parts and minutes')).toHaveTextContent(/about 24 minutes/);
  });

  test('leads from the panel to every part, with the reader’s choices carried', async () => {
    render(<TestApp at={demosAt('z-index/why-9999-still-loses', '?raised=second')}/>);

    const index = await partsIndex.find();

    expect(partsIndex.addressesIn(index)).toEqual(zIndexParts.inOrder.map(part =>
      demosAt(`z-index/${part}`, '?raised=second')));
  });

  test('lists the parts once, beside the part', async () => {
    render(<TestApp at={demosAt('z-index/why-9999-still-loses')}/>);

    await partsIndex.find();

    expect(demoPage.listedSignposts(/Why the popover wins$/)).toHaveLength(1);
  });
});

describe('the z-index tab’s panel', () => {
  test('says how long the parts take together', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    expect(await demoPage.panel('parts and minutes')).toHaveTextContent(/about 24 minutes/);
  });
});
