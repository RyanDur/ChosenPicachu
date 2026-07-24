import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithMemoryRouter} from '@test-support';
import {Games} from '@pages/Games/routes';

describe('Games', () => {
  test('can see the games page', async () => {
    renderWithMemoryRouter(Games, {path: '/games'});

    await userEvent.click(screen.getByRole('link', { name: 'Games' }));

    expect(await screen.findByText('Play Games')).toBeInTheDocument();
  });
});