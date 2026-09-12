import {Paths} from '@pages/Paths';
import {TestApp} from '@test-support/TestApp';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Games', () => {
  test('can see the games page', async () => {
    render(<TestApp at={Paths.games}/>);

    await userEvent.click(screen.getByRole('link', { name: 'Games' }));

    expect(await screen.findByText('Play Games')).toBeInTheDocument();
  });
});