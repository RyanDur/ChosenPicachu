import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demoPage, demosAt, demoTabs, pageFoot, partsIndex} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {menuInTheTopLayer, zIndexTab} from '@pages/Demos/ZIndexDemo/__test_support';

const popoverWins = 'z-index/why-the-popover-wins';
const title = 'Why the popover wins';

describe('why the popover wins, on its own page', () => {
  test('should say its place in the z-index book', async () => {
    render(<TestApp at={demosAt(popoverWins)}/>);

    expect(await zIndexTab.place()).toHaveTextContent('Z-index · part 6 of 7');
  });

  test('should link why 9999 still loses, which it builds on, to its page with the raised card carried', async () => {
    render(<TestApp at={demosAt(popoverWins, '?raised=second')}/>);

    const part = await explanation.part(title);
    const opener = explanation.opener(part);

    expect(explanation.linkNamed(opener, 'Why 9999 still loses')).toHaveAttribute('href', demosAt('z-index/why-9999-still-loses', '?raised=second'));
  });

  test('should show the menu in the top layer, the exhibit it explains', async () => {
    render(<TestApp at={demosAt(popoverWins)}/>);

    expect(await menuInTheTopLayer.find()).toBeInTheDocument();
  });

  test('should link the run on the menu’s placement to card one’s list in What else forms a stacking context', async () => {
    render(<TestApp at={demosAt(popoverWins)}/>);

    const part = await explanation.part(title);
    const run = explanation.saying(part, /The site’s Menu component places a menu/);

    expect(explanation.linkNamed(run, 'What else forms a stacking context')).toHaveAttribute('href', demosAt('z-index/what-else-forms-a-stacking-context'));
  });

  test('should link the run on Menu, Entry and Item to the Charts tab, whose period menu is built from them', async () => {
    render(<TestApp at={demosAt(popoverWins)}/>);

    const part = await explanation.part(title);
    const run = explanation.runTelling(part, /built from three components: Menu, Entry and Item/);

    expect(explanation.linkNamed(run, 'Charts tab')).toHaveAttribute('href', demosAt('charts'));
  });

  test('should link the run on the menu’s placement to the Charts tab, whose period menu is placed that way', async () => {
    render(<TestApp at={demosAt(popoverWins)}/>);

    const part = await explanation.part(title);
    const run = explanation.runTelling(part, /The site’s Menu component places a menu/);

    expect(explanation.linkNamed(run, 'Charts tab')).toHaveAttribute('href', demosAt('charts'));
  });

  test('should link rule, at its first use, to part one’s page with the raised card carried', async () => {
    render(<TestApp at={demosAt(popoverWins, '?raised=second')}/>);

    const part = await explanation.part(title);

    expect(explanation.linkNamed(part, 'rule')).toHaveAttribute('href', demosAt('z-index/why-third-is-on-top', '?raised=second'));
  });

  test('should lead back to part five’s page and on to part seven’s page, by number and title, with the raised card carried', async () => {
    render(<TestApp at={demosAt(popoverWins, '?raised=second')}/>);

    expect(await pageFoot.leadsOn()).toEqual([
      ['Previous: 5. Why a fixed banner still loses', demosAt('z-index/why-a-fixed-banner-still-loses', '?raised=second')],
      ['Next: 7. Let’s build this feature', demosAt('z-index/lets-build-this-feature', '?raised=second')]
    ]);
  });

  test('should title the page with its tab', async () => {
    render(<TestApp at={demosAt(popoverWins)}/>);

    expect(await demoTabs.title('Demos Z-index')).toBeInTheDocument();
  });

  test('should keep Z-index as the current tab', async () => {
    render(<TestApp at={demosAt(popoverWins)}/>);

    expect(await demoTabs.currentButNotThePage()).toEqual(['Z-index']);
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

    const introduction = demoPage.says(/^Later tabs build on part 6, /);

    expect(explanation.linkNamed(introduction, title)).toHaveAttribute('href', demosAt(popoverWins, '?raised=second'));
  });
});
