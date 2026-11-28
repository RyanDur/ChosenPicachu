import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demosAt, demoTabs, pageFoot, partsIndex} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {wearsChooser, zIndexTab} from '@pages/Demos/ZIndexDemo/__test_support';

const whatElseForms = 'z-index/what-else-forms-a-stacking-context';
const title = 'What else forms a stacking context';

describe('what else forms a stacking context, on its own page', () => {
  test('should say its place in the z-index book', async () => {
    render(<TestApp at={demosAt(whatElseForms)}/>);

    expect(await zIndexTab.place()).toHaveTextContent('Z-index · part 4 of 7');
  });

  test('should link why Third is on top, which it builds on, to its page with the wear carried', async () => {
    render(<TestApp at={demosAt(whatElseForms, '?wears=opacity')}/>);

    const part = await explanation.part(title);

    expect(explanation.linkNamed(explanation.opener(part), 'Why Third is on top')).toHaveAttribute('href', demosAt('z-index/why-third-is-on-top', '?wears=opacity'));
  });

  test('should link why 9999 still loses, which it builds on, to its page with the wear carried', async () => {
    render(<TestApp at={demosAt(whatElseForms, '?wears=opacity')}/>);

    const part = await explanation.part(title);
    const opener = explanation.opener(part);

    expect(explanation.linkNamed(opener, 'Why 9999 still loses')).toHaveAttribute('href', demosAt('z-index/why-9999-still-loses', '?wears=opacity'));
  });

  test('should link why 9999 still loses, where card B was positioned too, to its page with the wear carried', async () => {
    render(<TestApp at={demosAt(whatElseForms, '?wears=opacity')}/>);

    const part = await explanation.part(title);

    expect(explanation.linkNamed(explanation.saying(part, /Card B in/), 'Why 9999 still loses')).toHaveAttribute('href', demosAt('z-index/why-9999-still-loses', '?wears=opacity'));
  });

  test('should lead back to part three’s page and on to part five’s page, by number and title, with the wear carried', async () => {
    render(<TestApp at={demosAt(whatElseForms, '?wears=opacity')}/>);

    expect(await pageFoot.leadsOn()).toEqual([
      ['Previous: 3. Why 9999 still loses', demosAt('z-index/why-9999-still-loses', '?wears=opacity')],
      ['Next: 5. Why a fixed banner still loses', demosAt('z-index/why-a-fixed-banner-still-loses', '?wears=opacity')]
    ]);
  });

  test('should title the page with its tab', async () => {
    render(<TestApp at={demosAt(whatElseForms)}/>);

    expect(await demoTabs.title('Demos Z-index')).toBeInTheDocument();
  });

  test('should keep Z-index as the current tab', async () => {
    render(<TestApp at={demosAt(whatElseForms)}/>);

    expect(await demoTabs.currentButNotThePage()).toEqual(['Z-index']);
  });
});

describe('what else forms a stacking context, on the tab', () => {
  test('should link its title to its page, with the wear carried', async () => {
    render(<TestApp at={demosAt('z-index', '?wears=opacity')}/>);

    const listing = partsIndex.entryOf(await partsIndex.find(), title);

    expect(explanation.linkNamed(listing, title)).toHaveAttribute('href', demosAt(whatElseForms, '?wears=opacity'));
  });

  test('should leave its chooser to its page', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    await demoTabs.arrivedOn('Z-index');

    expect(wearsChooser.query()).not.toBeInTheDocument();
  });
});
