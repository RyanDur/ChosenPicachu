import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithMemoryRouter} from './util';
import {router} from '../router';

describe('Games', () => {
  test('can see the games page', async () => {
    renderWithMemoryRouter(router, {path: '/games'});

    await userEvent.click(screen.getByRole('link', { name: 'Games' }));

    expect(await screen.findByText('Play Three in a Row')).toBeInTheDocument();
  });
});