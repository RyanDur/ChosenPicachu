import {render} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';
import {oldWayMenu} from '@pages/Demos/ZIndexDemo/__test_support';

describe('the menu built the old way', () => {
  test('should open from a press, with its first choice in focus', async () => {
    render(<TestApp at={demosAt('z-index/what-else-forms-a-stacking-context')}/>);
    const sortBy = await oldWayMenu.findButton();
    expect(sortBy).toHaveAttribute('aria-expanded', 'false');

    await oldWayMenu.open();

    expect(sortBy).toHaveAttribute('aria-expanded', 'true');
    expect(oldWayMenu.choices()).toEqual(['name', 'date', 'size']);
    expect(oldWayMenu.choice('name')).toHaveFocus();
  });

  test('should move through its choices by arrow, Home and End, and wrap at either end', async () => {
    render(<TestApp at={demosAt('z-index/what-else-forms-a-stacking-context')}/>);
    await oldWayMenu.focusButton();

    await oldWayMenu.openWithEnter();
    await oldWayMenu.next();
    expect(oldWayMenu.choice('date')).toHaveFocus();
    await oldWayMenu.last();
    expect(oldWayMenu.choice('size')).toHaveFocus();
    await oldWayMenu.next();
    expect(oldWayMenu.choice('name')).toHaveFocus();
    await oldWayMenu.previous();
    expect(oldWayMenu.choice('size')).toHaveFocus();
    await oldWayMenu.first();
    expect(oldWayMenu.choice('name')).toHaveFocus();
  });

  test('should take the choice pressed, close, and give focus back to its button', async () => {
    render(<TestApp at={demosAt('z-index/what-else-forms-a-stacking-context')}/>);
    await oldWayMenu.focusButton();

    await oldWayMenu.openWithEnter();
    await oldWayMenu.next();
    await oldWayMenu.takeByKeyboard();

    expect(oldWayMenu.queryMenu()).not.toBeInTheDocument();
    expect(oldWayMenu.button('Sort by: date, the old way')).toHaveFocus();
  });

  test('should mark the choice taken as current when it opens again', async () => {
    render(<TestApp at={demosAt('z-index/what-else-forms-a-stacking-context')}/>);
    await oldWayMenu.open();
    await oldWayMenu.choose('date');

    await oldWayMenu.open('Sort by: date, the old way');

    expect(oldWayMenu.currentChoice()).toHaveTextContent('date');
  });

  test('should close on Escape, and give focus back to its button', async () => {
    render(<TestApp at={demosAt('z-index/what-else-forms-a-stacking-context')}/>);
    await oldWayMenu.open();

    await oldWayMenu.close();

    expect(oldWayMenu.queryMenu()).not.toBeInTheDocument();
    expect(oldWayMenu.button()).toHaveFocus();
  });

  test('should open from ArrowDown on its button, with its first choice in focus', async () => {
    render(<TestApp at={demosAt('z-index/what-else-forms-a-stacking-context')}/>);
    await oldWayMenu.focusButton();

    await oldWayMenu.openWithArrowDown();

    expect(oldWayMenu.choice('name')).toHaveFocus();
  });

  test('should close when focus leaves it', async () => {
    render(<TestApp at={demosAt('z-index/what-else-forms-a-stacking-context')}/>);
    await oldWayMenu.open();

    await oldWayMenu.tabAway();

    expect(oldWayMenu.queryMenu()).not.toBeInTheDocument();
  });
});
