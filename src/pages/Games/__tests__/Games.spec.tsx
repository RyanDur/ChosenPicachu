import {Paths} from '@pages/Paths';
import {TestApp} from '@test-support/TestApp';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Games', () => {
  test('the games page invites you to play games', async () => {
    render(<TestApp at={Paths.games}/>);

    expect(await screen.findByText('Play Games')).toBeInTheDocument();
  });

  test('the games page offers the one game there is', async () => {
    render(<TestApp at={Paths.games}/>);

    expect(await screen.findByRole('link', {name: 'Three in a row'})).toBeVisible();
  });

  test("following the game's link opens the colour game", async () => {
    render(<TestApp at={Paths.games}/>);

    await userEvent.click(await screen.findByRole('link', {name: 'Three in a row'}));

    expect(screen.getByRole('status', {name: 'url path'})).toHaveTextContent(`${Paths.games}colorGame`);
  });
});
