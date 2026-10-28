import {Paths} from '@pages/Paths';
import {TestApp} from '@__test_support/TestApp';
import {render, screen, waitFor, within} from '@testing-library/react';
import {site} from '@pages/__test_support';

const described = (): string | null => document.head.querySelector('meta[name="description"]')?.getAttribute('content') ?? null;

describe('Games', () => {
  test('the games page invites you to play games', async () => {
    render(<TestApp at={Paths.games}/>);

    expect(await screen.findByText('Play Games')).toBeInTheDocument();
  });

  test('the games page says there is no game yet, and leads nowhere', async () => {
    render(<TestApp at={Paths.games}/>);

    expect(await screen.findByText('No game yet. The first will be three in a row.')).toBeVisible();
    expect(within(screen.getByRole('main')).queryAllByRole('link')).toHaveLength(0);
  });

  test('the games page is described as having no game yet', async () => {
    render(<TestApp at={Paths.games}/>);

    await waitFor(() => expect(described()).toBe('No game yet.'));
  });

  test('the old address of the game is no room, with Games still current', async () => {
    render(<TestApp at={`${Paths.games}colorGame`}/>);

    expect(await site.roomSays('There is no room at this address.')).toBeVisible();
    expect(site.railLink('Games')).toHaveAttribute('aria-current', 'page');
  });
});
