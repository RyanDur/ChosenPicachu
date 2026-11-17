import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demosAt, demoTabs, pageFoot} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {wearsChooser, zIndexTab} from '@pages/Demos/ZIndexDemo/__test_support';

const whatElseForms = 'z-index/what-else-forms-a-stacking-context';
const title = 'What else forms a stacking context';

describe('what else forms a stacking context, on its own page', () => {
  test('should say its place in the z-index book', async () => {
    render(<TestApp at={demosAt(whatElseForms)}/>);

    expect(await zIndexTab.place()).toHaveTextContent('Z-index · part 3 of 6');
  });

  test('should link part one, which it builds on, to its page with the wear carried', async () => {
    render(<TestApp at={demosAt(whatElseForms, '?wears=opacity')}/>);

    const part = await explanation.part(title);

    expect(explanation.linkNamed(part, 'Why Third is on top')).toHaveAttribute('href', demosAt('z-index/why-third-is-on-top', '?wears=opacity'));
  });

  test('should link part two, which it builds on, to its page with the wear carried', async () => {
    render(<TestApp at={demosAt(whatElseForms, '?wears=opacity')}/>);

    const part = await explanation.part(title);
    const opener = explanation.saying(part, /^A card with no z-index at all/);

    expect(explanation.linkNamed(opener, 'Why 9999 still loses')).toHaveAttribute('href', demosAt('z-index/why-9999-still-loses', '?wears=opacity'));
  });

  test('should link the menu part’s card to part two’s page, with the wear carried', async () => {
    render(<TestApp at={demosAt(whatElseForms, '?wears=opacity')}/>);

    const part = await explanation.part(title);

    expect(explanation.linkNamed(part, 'The menu part’s card')).toHaveAttribute('href', demosAt('z-index/why-9999-still-loses', '?wears=opacity'));
  });

  test('should show the wear chosen on the tab', async () => {
    render(<TestApp at={demosAt(whatElseForms, '?wears=transform')}/>);

    expect(wearsChooser.wear(await wearsChooser.find(), 'transform: rotate(-1deg)')).toBeChecked();
  });

  test('should lead back to part two’s page and on to part four on the tab, by number and title, with the wear carried', async () => {
    render(<TestApp at={demosAt(whatElseForms, '?wears=opacity')}/>);

    expect(await pageFoot.leadsOn('the z-index parts')).toEqual([
      ['Previous: 2. Why 9999 still loses', demosAt('z-index/why-9999-still-loses', '?wears=opacity')],
      ['Next: 4. Why the popover wins', `${demosAt('z-index', '?wears=opacity')}#popover-wins-heading`]
    ]);
  });

  test('should title the page with the tab and the part', async () => {
    render(<TestApp at={demosAt(whatElseForms)}/>);

    expect(await demoTabs.title('Demos Z-index · What else forms a stacking context')).toBeInTheDocument();
  });

  test('should keep Z-index as the current tab', async () => {
    render(<TestApp at={demosAt(whatElseForms)}/>);

    expect(await demoTabs.current()).toEqual(['Z-index']);
  });
});

describe('what else forms a stacking context, on the tab', () => {
  test('should link its title to its page, with the wear carried', async () => {
    render(<TestApp at={demosAt('z-index', '?wears=opacity')}/>);

    const listing = await explanation.part(title);

    expect(explanation.linkNamed(listing, title)).toHaveAttribute('href', demosAt(whatElseForms, '?wears=opacity'));
  });

  test('should leave its chooser to its page', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    await demoTabs.arrivedOn('Z-index');

    expect(wearsChooser.query()).not.toBeInTheDocument();
  });
});
