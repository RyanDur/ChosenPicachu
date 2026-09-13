import {Paths} from '@pages/Paths';
import {TestApp} from '@test-support/TestApp';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Games', () => {
  test('can see the games page', async () => {
    render(<TestApp at={Paths.games}/>);

    expect(await screen.findByText('Play Games')).toBeInTheDocument();
  });

  test('arriving at the games offers the one game, and the link leads to it', async () => {
    render(<TestApp at={Paths.games}/>);

    await userEvent.click(await screen.findByRole('link', {name: 'Three in a row'}));

    expect(screen.getByRole('status', {name: 'url path'})).toHaveTextContent(`${Paths.games}colorGame`);
  });
});
