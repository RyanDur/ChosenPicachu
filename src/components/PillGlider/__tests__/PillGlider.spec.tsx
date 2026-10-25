import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {FC, useState} from 'react';
import {PillGlider} from '../index';

const styles = [
  {display: 'Eager', value: 'eager'},
  {display: 'Lazy', value: 'lazy'},
  {display: 'Hide Eager', value: 'hide-eager'},
  {display: 'Hide Lazy', value: 'hide-lazy'}
];

const Choosing: FC = () => {
  const [chosen, choose] = useState('eager');
  return <PillGlider label="drag style" name="drag-style" options={styles} chosen={chosen} onChosen={choose}/>;
};

describe('the pill glider', () => {
  test('offers every style as a radio in a named group, the chosen one checked', () => {
    render(<PillGlider label="drag style" name="drag-style" options={styles}
      chosen="eager" onChosen={() => undefined}/>);

    expect(screen.getByRole('group', {name: 'drag style'})).toBeVisible();
    for (const {display} of styles) {
      expect(screen.getByRole('radio', {name: display})).toBeVisible();
    }
    expect(screen.getByRole('radio', {name: 'Eager'})).toBeChecked();
  });

  test('choosing a pill makes it the chosen one', async () => {
    render(<Choosing/>);

    await userEvent.click(screen.getByRole('radio', {name: 'Hide Lazy'}));

    expect(screen.getByRole('radio', {name: 'Hide Lazy'})).toBeChecked();
    expect(screen.getByRole('radio', {name: 'Eager'})).not.toBeChecked();
  });
});
