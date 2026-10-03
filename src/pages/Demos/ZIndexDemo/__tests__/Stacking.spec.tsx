import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {TestApp} from '@__test_support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';

const runDrawing = (tab: HTMLElement, drawing: string): HTMLElement =>
  within(tab).getAllByRole('listitem').filter(run => within(run).queryByRole('figure', {name: new RegExp(drawing)}) !== null)[0];

const everyCodeIn = (run: HTMLElement): string => within(run).getAllByRole('code').map(code => code.textContent).join();

describe('the stacking pile', () => {
  test('should open with no card raised', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    const raised = await screen.findByRole('group', {name: 'card raised'});

    expect(within(raised).getByRole('radio', {name: 'None'})).toBeChecked();
  });

  test('should raise the card chosen, and write it into the address', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    const raised = await screen.findByRole('group', {name: 'card raised'});

    await userEvent.click(within(raised).getByRole('radio', {name: 'Second'}));

    expect(within(raised).getByRole('radio', {name: 'Second'})).toBeChecked();
    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('raised=second');
  });

  test('should open with the card the address names raised', async () => {
    render(<TestApp at={demosAt('?tab=z-index&raised=third')}/>);

    const raised = await screen.findByRole('group', {name: 'card raised'});

    expect(within(raised).getByRole('radio', {name: 'Third'})).toBeChecked();
  });

  test('should show the pile’s list and its positioning beside the drawing of the pile from the side', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    const tab = await screen.findByRole('region', {name: 'Z-Index'});

    expect(everyCodeIn(runDrawing(tab, 'The pile from the side'))).toMatch(/First[^]*Second[^]*Third[^]*\.layer \{[^]*position: relative[^]*\.closed \{[^]*position: absolute/);
  });

  test('should show the rule that raises a card beside the drawing of one card lifted', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    const tab = await screen.findByRole('region', {name: 'Z-Index'});

    expect(everyCodeIn(runDrawing(tab, 'One number lifts one card'))).toMatch(/\.raised \{[^]*z-index: 1/);
  });
});
