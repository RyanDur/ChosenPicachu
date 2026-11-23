import {render, screen, within} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demosAt, demoTabs, pageFoot, partsIndex} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {zIndexTab} from '@pages/Demos/ZIndexDemo/__test_support';

const stillLoses = 'z-index/why-9999-still-loses';
const title = 'Why 9999 still loses';
const exhibitName = 'A context inside a context';

describe('why 9999 still loses, on its own page', () => {
  test('should say its place in the z-index book', async () => {
    render(<TestApp at={demosAt(stillLoses)}/>);

    expect(await zIndexTab.place()).toHaveTextContent('Z-index · part 3 of 7');
  });

  test('should link why Third is on top, which it builds on, to its page with the raised card carried', async () => {
    render(<TestApp at={demosAt(stillLoses, '?raised=second')}/>);

    const part = await explanation.part(title);

    expect(explanation.linkNamed(explanation.opener(part), 'Why Third is on top')).toHaveAttribute('href', demosAt('z-index/why-third-is-on-top', '?raised=second'));
  });

  test('should link how position places a box, which it builds on, to its page with the raised card carried', async () => {
    render(<TestApp at={demosAt(stillLoses, '?raised=second')}/>);

    const part = await explanation.part(title);

    expect(explanation.linkNamed(explanation.opener(part), 'How position places a box')).toHaveAttribute('href', demosAt('z-index/how-position-places-a-box', '?raised=second'));
  });

  test('should say, on the exhibit’s first step, that card A forms no context yet', async () => {
    render(<TestApp at={demosAt(stillLoses)}/>);

    expect(await screen.findByRole('status', {name: 'what the browser drew'})).toHaveTextContent(/^Card A forms no context yet\.$/);
  });

  test('should say, on the exhibit’s second step, that card A is now a context inside the page', async () => {
    render(<TestApp at={demosAt(stillLoses, '?nesting=a-context-inside')}/>);

    expect(await screen.findByRole('status', {name: 'what the browser drew'})).toHaveTextContent(/^Card A is now a context inside the page\.$/);
  });

  test('should show no menu', async () => {
    render(<TestApp at={demosAt(stillLoses)}/>);

    const part = await explanation.part(title);

    expect(within(part).queryByRole('button', {name: /Sort by/})).not.toBeInTheDocument();
  });

  test('should lead back to part two’s page and on to part four’s page, by number and title, with the raised card carried', async () => {
    render(<TestApp at={demosAt(stillLoses, '?raised=second')}/>);

    expect(await pageFoot.leadsOn()).toEqual([
      ['Previous: 2. How position places a box', demosAt('z-index/how-position-places-a-box', '?raised=second')],
      ['Next: 4. What else forms a stacking context', demosAt('z-index/what-else-forms-a-stacking-context', '?raised=second')]
    ]);
  });

  test('should title the page with its tab', async () => {
    render(<TestApp at={demosAt(stillLoses)}/>);

    expect(await demoTabs.title('Demos Z-index')).toBeInTheDocument();
  });

  test('should keep Z-index as the current tab', async () => {
    render(<TestApp at={demosAt(stillLoses)}/>);

    expect(await demoTabs.currentButNotThePage()).toEqual(['Z-index']);
  });
});

describe('why 9999 still loses, on the tab', () => {
  test('should link its title to its page, with the raised card carried', async () => {
    render(<TestApp at={demosAt('z-index', '?raised=second')}/>);

    const listing = partsIndex.entryOf(await partsIndex.find(), title);

    expect(explanation.linkNamed(listing, title)).toHaveAttribute('href', demosAt(stillLoses, '?raised=second'));
  });

  test('should leave its exhibit to its page', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    await demoTabs.arrivedOn('Z-index');

    expect(screen.queryByRole('figure', {name: exhibitName})).not.toBeInTheDocument();
  });
});
