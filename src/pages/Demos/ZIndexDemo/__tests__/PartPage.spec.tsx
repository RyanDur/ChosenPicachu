import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {Paths} from '@navigation';
import {demoPage, demosAt, demoTabs, pageFoot} from '@pages/Demos/__test_support';
import {stackingPile, zIndexTab} from '@pages/Demos/ZIndexDemo/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
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

  test('should lead on to the part after it on the tab, by number and title, with the raised card carried', async () => {
    render(<TestApp at={demosAt(thirdOnTop, '?raised=second')}/>);

    expect(await pageFoot.leadsOn('the z-index parts')).toEqual([
      ['Next: 2. Why 9999 still loses', `${demosAt('z-index', '?raised=second')}#9999-still-loses-heading`]
    ]);
  });

  test('should link each term it glosses, and each tab it names, to that tab', async () => {
    render(<TestApp at={demosAt(thirdOnTop)}/>);

    const page = await demoTabs.arrivedOn('Z-index');

    expect(demoPage.linksToTabsIn(page)).toEqual([
      ['accordions tab', `${Paths.demos}accordions/`],
      ['accordions tab', `${Paths.demos}accordions/`]
    ]);
  });

  test('should open on what it assumes, linking the accordions tab with the raised card carried', async () => {
    render(<TestApp at={demosAt(thirdOnTop, '?raised=second')}/>);

    const page = await demoTabs.arrivedOn('Z-index');

    const opener = explanation.saying(page, /^Even with no z-index anywhere/);

    expect(explanation.linkNamed(opener, 'accordions tab')).toHaveAttribute('href', demosAt('accordions', '?raised=second'));
  });

  test('should title the page with the tab and the part', async () => {
    render(<TestApp at={demosAt(thirdOnTop)}/>);

    expect(await demoTabs.title('Demos Z-index · Why Third is on top')).toBeInTheDocument();
  });

  test('should keep Z-index as the current tab', async () => {
    render(<TestApp at={demosAt(thirdOnTop)}/>);

    expect(await demoTabs.current()).toEqual(['Z-index']);
  });

  test('an address naming no part of the z-index tab says there is no room there', async () => {
    render(<TestApp at={demosAt('z-index/why-first-is-on-top')}/>);

    expect(await site.roomSays('There is no room at this address.')).toBeVisible();
  });
});
