import {Paths} from '@pages/Paths';
import {TestApp} from '@__test_support/TestApp';
import {render} from '@testing-library/react';
import {site} from '@pages/__test_support';

describe('Games', () => {
  test('the games page invites you to play games', async () => {
    render(<TestApp at={Paths.games}/>);

    expect(await site.titled('Play Games')).toBeInTheDocument();
  });

  test('the games page says there is no game yet, and leads nowhere', async () => {
    render(<TestApp at={Paths.games}/>);

    expect(await site.roomSays('No game yet. The first will be three in a row.')).toBeVisible();
    expect(site.roomLinks()).toHaveLength(0);
  });

  test('the old address of the game is no room, with Games still current', async () => {
    render(<TestApp at={`${Paths.games}colorGame`}/>);

    expect(await site.roomSays('There is no room at this address.')).toBeVisible();
    expect(site.railLink('Games')).toHaveAttribute('aria-current', 'page');
  });
});
