import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demoPage, demosAt, demoTabs, pageFoot} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {theTrap, zIndexTab} from '@pages/Demos/ZIndexDemo/__test_support';

const stillLoses = 'z-index/why-9999-still-loses';
const title = 'Why 9999 still loses';

describe('why 9999 still loses, on its own page', () => {
  test('should say its place in the z-index book', async () => {
    render(<TestApp at={demosAt(stillLoses)}/>);

    expect(await zIndexTab.place()).toHaveTextContent('Z-index · part 2 of 6');
  });

  test('should link part one, which it builds on, to its page with the raised card carried', async () => {
    render(<TestApp at={demosAt(stillLoses, '?raised=second')}/>);

    const part = await explanation.part(title);

    expect(explanation.linkNamed(part, 'Why Third is on top')).toHaveAttribute('href', demosAt('z-index/why-third-is-on-top', '?raised=second'));
  });

  test('should link Why the popover wins, where its opener glosses the top layer, to its page with the raised card carried', async () => {
    render(<TestApp at={demosAt(stillLoses, '?raised=second')}/>);

    const part = await explanation.part(title);
    const opener = explanation.saying(part, /^A list with a z-index of 9999/);

    expect(explanation.linkNamed(opener, 'Why the popover wins')).toHaveAttribute('href', demosAt('z-index/why-the-popover-wins', '?raised=second'));
  });

  test('should name the top layer in its steps without a link, so pressing the words never leaves the exhibit', async () => {
    render(<TestApp at={demosAt(stillLoses)}/>);

    const trap = await theTrap.find();

    expect(explanation.queryLinkNamed(trap, 'top layer')).not.toBeInTheDocument();
  });

  test('should lead back to part one’s page and on to part three’s page, by number and title, with the raised card carried', async () => {
    render(<TestApp at={demosAt(stillLoses, '?raised=second')}/>);

    expect(await pageFoot.leadsOn('the z-index parts')).toEqual([
      ['Previous: 1. Why Third is on top', demosAt('z-index/why-third-is-on-top', '?raised=second')],
      ['Next: 3. What else forms a stacking context', demosAt('z-index/what-else-forms-a-stacking-context', '?raised=second')]
    ]);
  });

  test('should title the page with the tab and the part', async () => {
    render(<TestApp at={demosAt(stillLoses)}/>);

    expect(await demoTabs.title('Demos Z-index · Why 9999 still loses')).toBeInTheDocument();
  });

  test('should keep Z-index as the current tab', async () => {
    render(<TestApp at={demosAt(stillLoses)}/>);

    expect(await demoTabs.current()).toEqual(['Z-index']);
  });
});

describe('why 9999 still loses, on the tab', () => {
  test('should link its title to its page, with the raised card carried', async () => {
    render(<TestApp at={demosAt('z-index', '?raised=second')}/>);

    const listing = await explanation.part(title);

    expect(explanation.linkNamed(listing, title)).toHaveAttribute('href', demosAt(stillLoses, '?raised=second'));
  });

  test('should leave its menus to its page', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    await demoTabs.arrivedOn('Z-index');

    expect(theTrap.query()).not.toBeInTheDocument();
  });

  test('should link the tab’s introduction, where it names the menu, to this page with the raised card carried', async () => {
    render(<TestApp at={demosAt('z-index', '?raised=second')}/>);
    await demoTabs.arrivedOn('Z-index');

    const introduction = demoPage.says(/^This tab also explains/);

    expect(explanation.linkNamed(introduction, 'Why 9999 still loses')).toHaveAttribute('href', demosAt('z-index/why-9999-still-loses', '?raised=second'));
  });
});
