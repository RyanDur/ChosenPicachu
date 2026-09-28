import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {PillGlider} from '../index';

const styles = [
  {display: 'Eager', value: 'eager'},
  {display: 'Lazy', value: 'lazy'},
  {display: 'Hide Eager', value: 'hide-eager'},
  {display: 'Hide Lazy', value: 'hide-lazy'}
];

describe('the pill glider', () => {
  test('offers every style as a radio in a named group, the chosen one checked', () => {
    render(<PillGlider label="drag style" name="drag-style" options={styles}
      chosen="eager" onChosen={vi.fn()}/>);

    expect(screen.getByRole('group', {name: 'drag style'})).toBeVisible();
    for (const {display} of styles) {
      expect(screen.getByRole('radio', {name: display})).toBeVisible();
    }
    expect(screen.getByRole('radio', {name: 'Eager'})).toBeChecked();
  });

  test('choosing a pill says which was chosen', async () => {
    const onChosen = vi.fn();
    render(<PillGlider label="drag style" name="drag-style" options={styles}
      chosen="eager" onChosen={onChosen}/>);

    await userEvent.click(screen.getByRole('radio', {name: 'Hide Lazy'}));

    expect(onChosen).toHaveBeenCalledWith('hide-lazy');
  });
});
