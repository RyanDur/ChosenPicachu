import {useState} from 'react';
import {isInaccessible, render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {not} from '@ryandur/sand';
import {Dial} from '../Dial';

type Pace = 'eager' | 'lazy';

const readings: Record<Pace, string> = {
  eager: 'The row moves as soon as it is pressed.',
  lazy: 'The row waits for the hand to travel.'
};

const PaceRow = () => {
  const [pace, setPace] = useState<Pace>('eager');
  return <ul>
    <Dial label="pace"
      name="pace"
      options={[{display: 'Eager', value: 'eager'}, {display: 'Lazy', value: 'lazy'}]}
      chosen={pace}
      onChosen={setPace}
      reading={readings[pace]}/>
  </ul>;
};

describe('a dial', () => {
  test('should say its name once to a screen reader, as the legend of its pills', () => {
    render(<PaceRow/>);

    const row = screen.getByRole('listitem');

    expect(within(row).getByRole('group', {name: 'pace'})).toBeVisible();
    expect(within(row).getAllByText('pace').filter(name => not(isInaccessible(name)))).toHaveLength(1);
  });

  test('should read the chosen pill in a status, and read the next one when it is chosen', async () => {
    render(<PaceRow/>);

    expect(screen.getByRole('status')).toHaveTextContent(readings.eager);

    await userEvent.click(screen.getByRole('radio', {name: 'Lazy'}));

    expect(screen.getByRole('status')).toHaveTextContent(readings.lazy);
  });
});
