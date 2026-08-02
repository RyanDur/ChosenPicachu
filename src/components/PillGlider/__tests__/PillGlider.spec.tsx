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
  test('offers every style as a radio in a named group', () => {
    render(<PillGlider label="drag style" name="drag-style" options={styles}
                       chosen="eager" onChoose={vi.fn()}/>);

    expect(screen.getByRole('group', {name: 'drag style'})).toBeVisible();
    for (const {display} of styles) {
      expect(screen.getByRole('radio', {name: display})).toBeVisible();
    }
    expect(screen.getByRole('radio', {name: 'Eager'})).toBeChecked();
  });

  test('choosing a pill reports the value', async () => {
    const onChoose = vi.fn();
    render(<PillGlider label="drag style" name="drag-style" options={styles}
                       chosen="eager" onChoose={onChoose}/>);

    await userEvent.click(screen.getByRole('radio', {name: 'Hide Lazy'}));

    expect(onChoose).toHaveBeenCalledWith('hide-lazy');
  });

  test('the glider slides to the chosen pill', () => {
    const {container} = render(<PillGlider label="drag style" name="drag-style" options={styles}
                                           chosen="hide-eager" onChoose={vi.fn()}/>);

    expect(container.querySelector('.glider')).toHaveStyle({transform: 'translateX(200%)'});
  });
});
