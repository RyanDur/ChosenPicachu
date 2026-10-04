import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {TestApp} from '@__test_support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {controlsBeforeTheSteps, wayLabelled} from '@pages/Demos/ZIndexDemo/__test_support';

const under = 'The list opened under card two. Its 9999 counts only inside card one.';
const over = 'The list opened over card two. Card one has no z-index now, so the 9999 is compared with card two’s 1.';

describe('the menu built the old way', () => {
  test('should open from a press, with its first choice in focus', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    const sortBy = await screen.findByRole('button', {name: 'Sort by, the old way'});
    expect(sortBy).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(sortBy);

    expect(sortBy).toHaveAttribute('aria-expanded', 'true');
    expect(within(screen.getByRole('menu')).getAllByRole('menuitem').map(choice => choice.textContent)).toEqual(['name', 'date', 'size']);
    expect(screen.getByRole('menuitem', {name: 'name'})).toHaveFocus();
  });

  test('should move through its choices by arrow, Home and End, and wrap at either end', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    (await screen.findByRole('button', {name: 'Sort by, the old way'})).focus();

    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', {name: 'date'})).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('menuitem', {name: 'size'})).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', {name: 'name'})).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', {name: 'size'})).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('menuitem', {name: 'name'})).toHaveFocus();
  });

  test('should take the choice pressed, close, and give focus back to its button', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    (await screen.findByRole('button', {name: 'Sort by, the old way'})).focus();

    await userEvent.keyboard('{Enter}{ArrowDown}{Enter}');

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Sort by: date, the old way'})).toHaveFocus();
  });

  test('should mark the choice taken as current when it opens again', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    await userEvent.click(await screen.findByRole('button', {name: 'Sort by, the old way'}));
    await userEvent.click(screen.getByRole('menuitem', {name: 'date'}));

    await userEvent.click(screen.getByRole('button', {name: 'Sort by: date, the old way'}));

    expect(screen.getByRole('menuitem', {current: true})).toHaveTextContent('date');
  });

  test('should close on Escape, and give focus back to its button', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    await userEvent.click(await screen.findByRole('button', {name: 'Sort by, the old way'}));

    await userEvent.keyboard('{Escape}');

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Sort by, the old way'})).toHaveFocus();
  });

  test('should open from ArrowDown on its button, with its first choice in focus', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    (await screen.findByRole('button', {name: 'Sort by, the old way'})).focus();

    await userEvent.keyboard('{ArrowDown}');

    expect(screen.getByRole('menuitem', {name: 'name'})).toHaveFocus();
  });

  test('should close when focus leaves it', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    await userEvent.click(await screen.findByRole('button', {name: 'Sort by, the old way'}));

    await userEvent.tab();

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

describe('the card that traps the menu', () => {
  test('should give its steps before any control', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    const trap = await screen.findByRole('figure', {name: /^The trap\./});

    const [steps] = within(trap).getAllByRole('list');

    expect(within(steps).getAllByRole('listitem').map(step => step.textContent)).toEqual([
      'Press Sort by, built the old way, and look where its list opens.',
      'Uncheck “Card one has z-index: 1”, and press Sort by again.',
      'Press Sort by, in the top layer, with the box checked or not.'
    ]);
    expect(controlsBeforeTheSteps(steps, [...within(trap).getAllByRole('button'), within(trap).getByRole('checkbox')])).toEqual([]);
  });

  test('should keep the checkbox in card one, and tell each card’s z-index in a sentence', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    const trap = await screen.findByRole('figure', {name: /^The trap\./});

    const cardOne = within(trap).getAllByRole('listitem').find(card => within(card).queryByRole('checkbox', {name: 'Card one has z-index: 1'}) !== null);

    expect(cardOne).toHaveTextContent('Its list has z-index: 9999.');
    expect(within(trap).getByText('Card two has z-index: 1, and comes later in the code.')).toBeInTheDocument();
  });

  test('should show Sort by on both buttons, under the way each is built, and name each by its words then its way', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    const trap = await screen.findByRole('figure', {name: /^The trap\./});

    const oldWay = screen.getByRole('button', {name: 'Sort by, the old way'});
    const topLayer = screen.getByRole('button', {name: 'Sort by, in the top layer'});

    expect(wayLabelled(trap, 'The old way')).toContainElement(oldWay);
    expect(wayLabelled(trap, 'The old way')).not.toContainElement(topLayer);
    expect(wayLabelled(trap, 'The top layer')).toContainElement(topLayer);
    expect(oldWay).toHaveTextContent(/^Sort by$/);
    expect(topLayer).toHaveTextContent(/^Sort by$/);
  });

  test('should name a button by the choice it shows, then its way', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    await userEvent.click(await screen.findByRole('button', {name: 'Sort by, the old way'}));

    await userEvent.click(screen.getByRole('menuitem', {name: 'date'}));

    expect(screen.getByRole('button', {name: 'Sort by: date, the old way'})).toHaveTextContent(/^Sort by: date$/);
  });

  test('should say nothing before the first press', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    expect(await screen.findByRole('status', {name: 'where the list opened'})).toBeEmptyDOMElement();
  });

  test('should take back what it said when the box changes, since the next press answers', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    await userEvent.click(await screen.findByRole('button', {name: 'Sort by, the old way'}));
    await userEvent.keyboard('{Escape}');

    await userEvent.click(screen.getByRole('checkbox', {name: 'Card one has z-index: 1'}));

    expect(screen.getByRole('status', {name: 'where the list opened'})).toBeEmptyDOMElement();
  });

  test('should say the list opened under card two when card one has its z-index', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    await userEvent.click(await screen.findByRole('button', {name: 'Sort by, the old way'}));

    expect(screen.getByRole('status', {name: 'where the list opened'})).toHaveTextContent(under);
  });

  test('should say where the list opened when ArrowDown opens it', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    (await screen.findByRole('button', {name: 'Sort by, the old way'})).focus();

    await userEvent.keyboard('{ArrowDown}');

    expect(screen.getByRole('status', {name: 'where the list opened'})).toHaveTextContent(under);
  });

  test('should say the list opened over card two once the box is unchecked, and write it into the address', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    await userEvent.click(await screen.findByRole('checkbox', {name: 'Card one has z-index: 1'}));

    await userEvent.click(screen.getByRole('button', {name: 'Sort by, the old way'}));

    expect(screen.getByRole('status', {name: 'where the list opened'})).toHaveTextContent(over);
    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('card-one=free');
  });

  test('should say the list opened under card two again once the box is checked again', async () => {
    render(<TestApp at={demosAt('?tab=z-index&card-one=free')}/>);
    const contextChoice = await screen.findByRole('checkbox', {name: 'Card one has z-index: 1'});
    await userEvent.click(screen.getByRole('button', {name: 'Sort by, the old way'}));
    await userEvent.keyboard('{Escape}');

    await userEvent.click(contextChoice);
    await userEvent.click(screen.getByRole('button', {name: 'Sort by, the old way'}));

    expect(screen.getByRole('status', {name: 'where the list opened'})).toHaveTextContent(under);
  });

  test('should open freed when the address says so', async () => {
    render(<TestApp at={demosAt('?tab=z-index&card-one=free')}/>);

    expect(await screen.findByRole('checkbox', {name: 'Card one has z-index: 1'})).not.toBeChecked();
  });
});

describe('why 9999 still loses', () => {
  test('should say what focus is where the tab first speaks of it', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    const part = await screen.findByRole('region', {name: 'Why 9999 still loses'});

    expect(explanation.runTelling(part, /Move through it with the arrow keys/))
      .toHaveTextContent('Move through it with the arrow keys. The choice in focus is the one the keys go to, and it moves where you cannot see it, under card two.');
  });

  test('should show the list’s 9999 and the card’s context beside the run that says what the reader saw', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    const part = await screen.findByRole('region', {name: 'Why 9999 still loses'});

    expect(explanation.everyCodeBeside(part, /The list has a z-index of 9999, and card two/).join())
      .toMatch(/\.sort-choices \{[^]*position: absolute[^]*z-index: 9999[^]*\.old-way-card \{[^]*position: relative[^]*\.forms-context \{[^]*z-index: 1/);
  });

  test('should show card one, with the checkbox inside it, beside the run that says what unchecking it does', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    const part = await screen.findByRole('region', {name: 'Why 9999 still loses'});

    expect(explanation.everyCodeBeside(part, /With the box unchecked, card one’s z-index is auto/).join())
      .toMatch(/'old-way-card[^]*'forms-context'[^]*type="checkbox"[^]*Card one has z-index: 1/);
  });

  test('should draw the layer and the tree of contexts beside the runs that tell them', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    const part = await screen.findByRole('region', {name: 'Why 9999 still loses'});

    expect(explanation.runTelling(part, /so it forms a stacking context/)).toContainElement(within(part).getByRole('figure', {name: /^A number inside a layer\./}));
    expect(explanation.runTelling(part, /The page itself is a stacking context/)).toContainElement(within(part).getByRole('figure', {name: /^Where 9999 is compared\./}));
  });
});
