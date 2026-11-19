import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demoPage, demosAt, demoTabs, pageFoot, partsIndex} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {theTrap, zIndexTab} from '@pages/Demos/ZIndexDemo/__test_support';

const popoverWins = 'z-index/why-the-popover-wins';
const title = 'Why the popover wins';

describe('why the popover wins, on its own page', () => {
  test('should say its place in the z-index book', async () => {
    render(<TestApp at={demosAt(popoverWins)}/>);

    expect(await zIndexTab.place()).toHaveTextContent('Z-index · part 4 of 6');
  });

  test('should link part two, which it builds on, to its page with the raised card carried', async () => {
    render(<TestApp at={demosAt(popoverWins, '?raised=second')}/>);

    const part = await explanation.part(title);
    const opener = explanation.opener(part);

    expect(explanation.linkNamed(opener, 'Why 9999 still loses')).toHaveAttribute('href', demosAt('z-index/why-9999-still-loses', '?raised=second'));
  });

  test('should show the two Sort by menus it explains, side by side', async () => {
    render(<TestApp at={demosAt(popoverWins)}/>);

    const trap = await theTrap.find();

    expect(theTrap.controlIn(trap, 'Sort by, the old way')).toBeInTheDocument();
    expect(theTrap.controlIn(trap, 'Sort by, in the top layer')).toBeInTheDocument();
  });

  test('should lead back to part three’s page and on to part five’s page, by number and title, with the raised card carried', async () => {
    render(<TestApp at={demosAt(popoverWins, '?raised=second')}/>);

    expect(await pageFoot.leadsOn('the z-index parts')).toEqual([
      ['Previous: 3. What else forms a stacking context', demosAt('z-index/what-else-forms-a-stacking-context', '?raised=second')],
      ['Next: 5. Why a fixed banner still loses', demosAt('z-index/why-a-fixed-banner-still-loses', '?raised=second')]
    ]);
  });

  test('should title the page with the tab and the part', async () => {
    render(<TestApp at={demosAt(popoverWins)}/>);

    expect(await demoTabs.title('Demos Z-index · Why the popover wins')).toBeInTheDocument();
  });

  test('should keep Z-index as the current tab', async () => {
    render(<TestApp at={demosAt(popoverWins)}/>);

    expect(await demoTabs.current()).toEqual(['Z-index']);
  });
});

describe('why the popover wins, on the tab', () => {
  test('should link its title to its page, with the raised card carried', async () => {
    render(<TestApp at={demosAt('z-index', '?raised=second')}/>);

    const listing = partsIndex.entryOf(await partsIndex.find(), title);

    expect(explanation.linkNamed(listing, title)).toHaveAttribute('href', demosAt(popoverWins, '?raised=second'));
  });

  test('should link the tab’s introduction to its page, with the raised card carried', async () => {
    render(<TestApp at={demosAt('z-index', '?raised=second')}/>);
    await demoTabs.arrivedOn('Z-index');

    const introduction = demoPage.says(/^Part 4, .*explains what the later tabs build on/);

    expect(explanation.linkNamed(introduction, title)).toHaveAttribute('href', demosAt(popoverWins, '?raised=second'));
  });
});
