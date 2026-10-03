import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {TestApp} from '@__test_support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';

const contained = 'Card one forms a stacking context. Its menu opens under card two.';
const free = 'Card one forms no stacking context. Its menu opens over card two.';

describe('the menu built the old way', () => {
  test('should open from a press, with its first choice in focus', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    const sortBy = await screen.findByRole('button', {name: 'Sort by'});
    expect(sortBy).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(sortBy);

    expect(sortBy).toHaveAttribute('aria-expanded', 'true');
    expect(within(screen.getByRole('menu')).getAllByRole('menuitem').map(choice => choice.textContent)).toEqual(['name', 'date', 'size']);
    expect(screen.getByRole('menuitem', {name: 'name'})).toHaveFocus();
  });

  test('should move through its choices by arrow, Home and End, and wrap at either end', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    (await screen.findByRole('button', {name: 'Sort by'})).focus();

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
    (await screen.findByRole('button', {name: 'Sort by'})).focus();

    await userEvent.keyboard('{Enter}{ArrowDown}{Enter}');

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Sort by: date'})).toHaveFocus();
  });

  test('should close on Escape, and give focus back to its button', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    await userEvent.click(await screen.findByRole('button', {name: 'Sort by'}));

    await userEvent.keyboard('{Escape}');

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Sort by'})).toHaveFocus();
  });

  test('should open from ArrowDown on its button, with its first choice in focus', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    (await screen.findByRole('button', {name: 'Sort by'})).focus();

    await userEvent.keyboard('{ArrowDown}');

    expect(screen.getByRole('menuitem', {name: 'name'})).toHaveFocus();
  });

  test('should close when focus leaves it', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    await userEvent.click(await screen.findByRole('button', {name: 'Sort by'}));

    await userEvent.tab();

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

describe('the card that traps the menu', () => {
  test('should form a stacking context at first, and say nothing until the checkbox changes', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    expect(await screen.findByRole('checkbox', {name: 'Card one has z-index: 1'})).toBeChecked();
    expect(screen.getByRole('status', {name: 'what card one does'})).toBeEmptyDOMElement();
  });

  test('should say the card traps the menu again when checked again', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    const contextChoice = await screen.findByRole('checkbox', {name: 'Card one has z-index: 1'});

    await userEvent.click(contextChoice);
    await userEvent.click(contextChoice);

    expect(screen.getByRole('status', {name: 'what card one does'})).toHaveTextContent(contained);
  });

  test('should free the menu when unchecked, say so, and write it into the address', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    await userEvent.click(await screen.findByRole('checkbox', {name: 'Card one has z-index: 1'}));

    expect(screen.getByRole('status', {name: 'what card one does'})).toHaveTextContent(free);
    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('card-one=free');
  });

  test('card one should show its z-index: 1 rule only while the checkbox is checked', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    const trap = await screen.findByRole('figure', {name: /^The trap\./});
    const cardOne = (): HTMLElement => within(trap).getAllByRole('listitem')
      .filter(card => within(card).queryByRole('button', {name: 'Sort by'}) !== null)[0];
    expect(within(cardOne()).getByText('.forms-context { z-index: 1 }')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('checkbox', {name: 'Card one has z-index: 1'}));

    expect(within(cardOne()).queryByText('.forms-context { z-index: 1 }')).not.toBeInTheDocument();
  });

  test('should open freed when the address says so', async () => {
    render(<TestApp at={demosAt('?tab=z-index&card-one=free')}/>);

    expect(await screen.findByRole('checkbox', {name: 'Card one has z-index: 1'})).not.toBeChecked();
  });
});

describe('why 9999 still loses', () => {
  test('should show the list’s 9999 and the card’s context beside the run that says what the reader saw', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    const part = await screen.findByRole('region', {name: 'Why 9999 still loses'});

    expect(explanation.everyCodeBeside(part, /Open Sort by\. The list has a z-index of 9999/).join())
      .toMatch(/\.sort-choices \{[^]*position: absolute[^]*z-index: 9999[^]*\.old-way-card \{[^]*position: relative[^]*\.forms-context \{[^]*z-index: 1/);
  });

  test('should show the checkbox and the class it takes away beside the run that says what the reader changed', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    const part = await screen.findByRole('region', {name: 'Why 9999 still loses'});

    expect(explanation.everyCodeBeside(part, /Uncheck Card one has z-index: 1/).join()).toMatch(/type="checkbox"[^]*Card one has z-index: 1[^]*'forms-context'/);
  });

  test('should draw the layer and the tree of contexts beside the runs that tell them', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    const part = await screen.findByRole('region', {name: 'Why 9999 still loses'});

    expect(explanation.runTelling(part, /so it forms a stacking context/)).toContainElement(within(part).getByRole('figure', {name: /^A number inside a layer\./}));
    expect(explanation.runTelling(part, /The page itself is a stacking context/)).toContainElement(within(part).getByRole('figure', {name: /^Where 9999 is compared\./}));
  });
});
