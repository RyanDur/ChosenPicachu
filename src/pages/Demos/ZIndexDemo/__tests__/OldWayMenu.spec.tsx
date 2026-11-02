import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {TestApp} from '@__test_support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {controlsBeforeTheSteps, wayLabelled} from '@pages/Demos/ZIndexDemo/__test_support';

const under = 'The list opened under card two. Its 9999 counts only inside card one.';
const over = 'The list opened over card two. Card one has no z-index now, so the 9999 is compared with card two’s 1.';

const theTrap = (): Promise<HTMLElement> => screen.findByRole('figure', {name: /^The trap\./});

describe('the menu built the old way', () => {
  test('should open from a press, with its first choice in focus', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    const sortBy = await within(await theTrap()).findByRole('button', {name: 'Sort by, the old way'});
    expect(sortBy).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(sortBy);

    expect(sortBy).toHaveAttribute('aria-expanded', 'true');
    expect(within(screen.getByRole('menu')).getAllByRole('menuitem').map(choice => choice.textContent)).toEqual(['name', 'date', 'size']);
    expect(screen.getByRole('menuitem', {name: 'name'})).toHaveFocus();
  });

  test('should move through its choices by arrow, Home and End, and wrap at either end', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    (await within(await theTrap()).findByRole('button', {name: 'Sort by, the old way'})).focus();

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
    render(<TestApp at={demosAt('z-index')}/>);
    (await within(await theTrap()).findByRole('button', {name: 'Sort by, the old way'})).focus();

    await userEvent.keyboard('{Enter}{ArrowDown}{Enter}');

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(within(await theTrap()).getByRole('button', {name: 'Sort by: date, the old way'})).toHaveFocus();
  });

  test('should mark the choice taken as current when it opens again', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    await userEvent.click(await within(await theTrap()).findByRole('button', {name: 'Sort by, the old way'}));
    await userEvent.click(screen.getByRole('menuitem', {name: 'date'}));

    await userEvent.click(within(await theTrap()).getByRole('button', {name: 'Sort by: date, the old way'}));

    expect(screen.getByRole('menuitem', {current: true})).toHaveTextContent('date');
  });

  test('should close on Escape, and give focus back to its button', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    await userEvent.click(await within(await theTrap()).findByRole('button', {name: 'Sort by, the old way'}));

    await userEvent.keyboard('{Escape}');

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(within(await theTrap()).getByRole('button', {name: 'Sort by, the old way'})).toHaveFocus();
  });

  test('should open from ArrowDown on its button, with its first choice in focus', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    (await within(await theTrap()).findByRole('button', {name: 'Sort by, the old way'})).focus();

    await userEvent.keyboard('{ArrowDown}');

    expect(screen.getByRole('menuitem', {name: 'name'})).toHaveFocus();
  });

  test('should close when focus leaves it', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    await userEvent.click(await within(await theTrap()).findByRole('button', {name: 'Sort by, the old way'}));

    await userEvent.tab();

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

describe('the card that traps the menu', () => {
  test('should give its steps before any control', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    const trap = await screen.findByRole('figure', {name: /^The trap\./});

    const [steps] = within(trap).getAllByRole('list');

    expect(controlsBeforeTheSteps(steps, [...within(trap).getAllByRole('button'), within(trap).getByRole('checkbox')])).toEqual([]);
  });

  test('should show Sort by on both buttons, under the way each is built, and name each by its words then its way', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    const trap = await screen.findByRole('figure', {name: /^The trap\./});

    const oldWay = within(trap).getByRole('button', {name: 'Sort by, the old way'});
    const topLayer = within(trap).getByRole('button', {name: 'Sort by, in the top layer'});

    expect(wayLabelled(trap, 'The old way')).toContainElement(oldWay);
    expect(wayLabelled(trap, 'The old way')).not.toContainElement(topLayer);
    expect(wayLabelled(trap, 'The top layer')).toContainElement(topLayer);
    expect(oldWay).toHaveTextContent(/^Sort by$/);
    expect(topLayer).toHaveTextContent(/^Sort by$/);
  });

  test('should name a button by the choice it shows, then its way', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    await userEvent.click(await within(await theTrap()).findByRole('button', {name: 'Sort by, the old way'}));

    await userEvent.click(screen.getByRole('menuitem', {name: 'date'}));

    expect(within(await theTrap()).getByRole('button', {name: 'Sort by: date, the old way'})).toHaveTextContent(/^Sort by: date$/);
  });

  test('should say nothing before the first press', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    expect(await screen.findByRole('status', {name: 'where the list opened'})).toBeEmptyDOMElement();
  });

  test('should take back what it said when the box changes, since the next press answers', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    await userEvent.click(await within(await theTrap()).findByRole('button', {name: 'Sort by, the old way'}));
    await userEvent.keyboard('{Escape}');

    await userEvent.click(screen.getByRole('checkbox', {name: 'Card one has z-index: 1'}));

    expect(screen.getByRole('status', {name: 'where the list opened'})).toBeEmptyDOMElement();
  });

  test('should say the list opened under card two when card one has its z-index', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    await userEvent.click(await within(await theTrap()).findByRole('button', {name: 'Sort by, the old way'}));

    expect(screen.getByRole('status', {name: 'where the list opened'})).toHaveTextContent(under);
  });

  test('should say where the list opened when ArrowDown opens it', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    (await within(await theTrap()).findByRole('button', {name: 'Sort by, the old way'})).focus();

    await userEvent.keyboard('{ArrowDown}');

    expect(screen.getByRole('status', {name: 'where the list opened'})).toHaveTextContent(under);
  });

  test('should say the list opened over card two once the box is unchecked, and write it into the address', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    await userEvent.click(await screen.findByRole('checkbox', {name: 'Card one has z-index: 1'}));

    await userEvent.click(within(await theTrap()).getByRole('button', {name: 'Sort by, the old way'}));

    expect(screen.getByRole('status', {name: 'where the list opened'})).toHaveTextContent(over);
    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('card-one=free');
  });

  test('should say the list opened under card two again once the box is checked again', async () => {
    render(<TestApp at={demosAt('z-index', '?card-one=free')}/>);
    const contextChoice = await screen.findByRole('checkbox', {name: 'Card one has z-index: 1'});
    await userEvent.click(within(await theTrap()).getByRole('button', {name: 'Sort by, the old way'}));
    await userEvent.keyboard('{Escape}');

    await userEvent.click(contextChoice);
    await userEvent.click(within(await theTrap()).getByRole('button', {name: 'Sort by, the old way'}));

    expect(screen.getByRole('status', {name: 'where the list opened'})).toHaveTextContent(under);
  });

  test('should open freed when the address says so', async () => {
    render(<TestApp at={demosAt('z-index', '?card-one=free')}/>);

    expect(await screen.findByRole('checkbox', {name: 'Card one has z-index: 1'})).not.toBeChecked();
  });
});

describe('why 9999 still loses', () => {
  test('should link where it says the cards are compared to What else forms a stacking context', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    const part = await screen.findByRole('region', {name: 'Why 9999 still loses'});

    expect(within(explanation.runTelling(part, /The cards are compared in the nearest context/)).getByRole('link', {name: 'What else forms a stacking context'})).toHaveAttribute('href', `#${screen.getByRole('heading', {name: 'What else forms a stacking context'}).id}`);
  });
});
