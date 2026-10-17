import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {TestApp} from '@__test_support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {computeAccessibleName} from 'dom-accessibility-api';
import {outOfReadingOrder} from '@__test_support/reading-order';

const heading = 'What else forms a stacking context';

const theChooser = (): Promise<HTMLElement> => screen.findByRole('figure', {name: /^What card one wears decides/});

describe('the part on what else forms a stacking context', () => {
  test('should offer, in order, the seven things card one can wear, with nothing chosen at first', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    const wears = within(await theChooser()).getByRole('group', {name: 'What card one wears'});

    expect(within(wears).getAllByRole('radio').map(choice => computeAccessibleName(choice))).toEqual([
      'nothing', 'position: relative', 'outline', 'z-index: 1', 'opacity: 0.9', 'transform: rotate(-1deg)', 'isolation: isolate'
    ]);
    expect(within(wears).getByRole('radio', {name: 'nothing'})).toBeChecked();
  });

  test('should say nothing until Sort by is pressed', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    const chooser = await theChooser();

    expect(within(chooser).getByRole('status', {name: 'what card one formed'})).toBeEmptyDOMElement();
  });

  test.each([
    ['nothing', 'The list opened over card two. Card one wears nothing, so it forms no stacking context.'],
    ['position: relative', 'The list opened over card two. position: relative alone forms no stacking context.'],
    ['outline', 'The list opened over card two. An outline forms no stacking context.'],
    ['z-index: 1', 'The list opened under card two. z-index: 1 formed a stacking context, so the 9999 counts only inside card one.'],
    ['opacity: 0.9', 'The list opened under card two. opacity: 0.9 formed a stacking context.'],
    ['transform: rotate(-1deg)', 'The list opened under card two. The transform formed a stacking context.'],
    ['isolation: isolate', 'The list opened under card two. isolation: isolate formed a stacking context.']
  ])('should say where the list opened, and its cause, once card one wears %s and Sort by is pressed', async (worn, said) => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    const chooser = await theChooser();

    await userEvent.click(within(chooser).getByRole('radio', {name: worn}));
    await userEvent.click(within(chooser).getByRole('button', {name: 'Sort by, the old way'}));

    expect(within(chooser).getByRole('status', {name: 'what card one formed'})).toHaveTextContent(said);
  });

  test('should go quiet when another choice is made after Sort by was pressed', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    const chooser = await theChooser();
    await userEvent.click(within(chooser).getByRole('button', {name: 'Sort by, the old way'}));
    await userEvent.keyboard('{Escape}');

    await userEvent.click(within(chooser).getByRole('radio', {name: 'isolation: isolate'}));

    expect(within(chooser).getByRole('status', {name: 'what card one formed'})).toBeEmptyDOMElement();
  });

  test('should write the choice into the address, and bring it back from there', async () => {
    const {unmount} = render(<TestApp at={demosAt('?tab=z-index')}/>);
    await userEvent.click(within(await theChooser()).getByRole('radio', {name: 'transform: rotate(-1deg)'}));
    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('wears=transform');
    unmount();

    render(<TestApp at={demosAt('?tab=z-index&wears=transform')}/>);

    expect(within(await theChooser()).getByRole('radio', {name: 'transform: rotate(-1deg)'})).toBeChecked();
  });

  test('should leave the menu part’s own checkbox as it was', async () => {
    render(<TestApp at={demosAt('?tab=z-index&wears=opacity')}/>);

    expect(within(await screen.findByRole('figure', {name: /^The trap\./})).getByRole('checkbox', {name: 'Card one has z-index: 1'})).toBeChecked();
  });

  test.each([
    ['position', /^is not enough on its own, and neither is absolute/, '.positioned {'],
    ['outline', /^is paint\. An outline, a border/, '.outlined {'],
    ['z-index', /^forms a context on a positioned element\. It forms one on a grid item too, which card one is here/, '.forms-context {'],
    ['opacity', /^, like any opacity below 1, forms a context/, '.faded {'],
    ['transform', /^forms a context, as any transform does/, '.turned {'],
    ['isolation', /^forms a context and does nothing more\. Use it to keep/, '.isolated {']
  ])('should open the %s run on its property, linked to MDN, with its rule beside it', async (property, words, rule) => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    const part = await screen.findByRole('region', {name: heading});

    const run = explanation.runTelling(part, words);

    expect(within(run).getAllByRole('link')[0]).toHaveAttribute('href', `https://developer.mozilla.org/en-US/docs/Web/CSS/${property}`);
    expect(explanation.codeBeside(part, words)).toHaveTextContent(rule);
  });

  test('should say this site isolates the tab’s panel, with the panel’s rule beside the isolation run', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    const part = await screen.findByRole('region', {name: heading});
    const words = /^forms a context and does nothing more/;

    expect(explanation.runTelling(part, words)).toHaveTextContent('I use it that way here: the tab’s panel wears it, in Tabs.css, so no z-index inside a tab is ever compared with one outside it.');
    expect(explanation.everyCodeBeside(part, words).join()).toMatch(/\.isolated \{[^]*\.tabs ~ \* \{\s*isolation: isolate;/);
  });

  test('should caption the chooser with where the 9999 counts: in the tab’s panel, against card two, or only inside the card', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    const part = await screen.findByRole('region', {name: heading});

    expect(within(part).getByText(/^What card one wears decides/)).toHaveTextContent('What card one wears decides whether its list’s 9999 counts in the tab’s panel, against card two, or only inside the card.');
  });

  test('should say, in a run of its own after the bare card’s, that the list is placed by anchor positioning, linked to MDN, with the two anchor rules beside it', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    const part = await screen.findByRole('region', {name: heading});
    const run = explanation.runTelling(part, /^The list is placed by/);

    expect(run).toHaveTextContent('The list is placed by anchor positioning. The Sort by button names itself --sort-by, and position-anchor on the list picks that button. anchor(end) puts the list’s top at the button’s bottom. anchor(start) lines the list’s start edge up with the button’s; the start edge is the side a line of text begins on. Nothing between the list and the card is positioned.');
    expect(within(run).getByRole('link', {name: 'anchor positioning'})).toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning');
    expect(explanation.everyCodeBeside(part, /^The list is placed by/).join()).toMatch(/\.old-way-card \.button \{\s*anchor-name: --sort-by;[^]*\.sort-choices \{\s*position-anchor: --sort-by;\s*inset-block-start: anchor\(end\);\s*inset-inline-start: anchor\(start\);/);
    expect(outOfReadingOrder([explanation.runTelling(part, /^With nothing on it, card one is a plain grid item/), run])).toEqual([]);
  });

  test('should say the bare card’s list is compared with card two in the tab panel’s context', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    const part = await screen.findByRole('region', {name: heading});

    expect(explanation.runTelling(part, /^With nothing on it, card one is a plain grid item/)).toHaveTextContent('Its list’s 9999 is compared with card two’s 1 in the tab panel’s context, so the list opens on top.');
  });

  test('should show the grid, and no anchor rule, beside the run on a card that wears nothing', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    const part = await screen.findByRole('region', {name: heading});

    const code = explanation.everyCodeBeside(part, /^With nothing on it, card one is a plain grid item, a box laid out by a parent whose display is grid/).join();

    expect(code).toMatch(/\.old-way-cards \{[^]*display: grid;/);
    expect(code).not.toMatch(/anchor/);
  });

  test('should say what sticky is where the part first names it', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    const part = await screen.findByRole('region', {name: heading});

    expect(explanation.runTelling(part, /^is not enough on its own, and neither is absolute/))
      .toHaveTextContent('Fixed and sticky are different. Each forms a context by itself. Sticky scrolls with the page until it reaches an edge and then stays there.');
  });

  test('should open its run on MDN’s whole list', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    const part = await screen.findByRole('region', {name: heading});

    expect(within(part).getByRole('link', {name: 'the whole list'}))
      .toHaveAttribute('href', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context');
  });
});
