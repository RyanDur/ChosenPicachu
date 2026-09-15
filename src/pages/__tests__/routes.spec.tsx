import {TestApp} from '@__test_support/TestApp';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Paths} from '@pages/Paths';
import {Route} from 'react-router';
import {scrolling} from '@components/__test_support/scrolling';
import {site} from '../__test_support';

describe('page error boundaries', () => {
  test('a crashing page shows the closed room inside the site, even with no boundary of its own', async () => {
    const Boom = () => {
      throw new Error('boom');
    };
    render(
      <TestApp>
        <Route path="/" element={<Boom/>}/>
      </TestApp>,
      {onCaughtError: () => undefined}
    );

    expect(await site.roomSays('This room is closed.')).toBeVisible();
    expect(site.pageTitle()).toHaveTextContent('Closed room');
    expect(await site.rail()).toBeInTheDocument();
    expect(site.frontDoor()).toHaveAttribute('href', Paths.home);
  });

  test('a crash no page catches is reported and announced', async () => {
    const boom = new Error('boom');
    const Boom = () => {
      throw boom;
    };
    const caught: unknown[] = [];
    render(
      <TestApp>
        <Route path="/" element={<Boom/>}/>
      </TestApp>,
      {onCaughtError: error => caught.push(error)}
    );

    await site.roomSays('This room is closed.');
    expect(screen.getByRole('list', {name: 'errors reported'})).toHaveTextContent(/^boom$/);
    expect(caught).toEqual([boom]);
    expect(site.announced('This room is closed.')).toBeInTheDocument();
  });

  test('an address the site does not know says so, inside the site', async () => {
    render(<TestApp at="/nowhere/"/>);

    expect(await site.roomSays('There is no room at this address.')).toBeVisible();
    expect(site.pageTitle()).toHaveTextContent('No such room');
    expect(site.frontDoor()).toHaveAttribute('href', Paths.home);
    expect(await site.rail()).toBeInTheDocument();
    expect(site.announced('There is no room at this address.')).toBeInTheDocument();
  });

  test('an unknown address under the games is no room either', async () => {
    render(<TestApp at="/games/nowhere/"/>);

    expect(await site.roomSays('There is no room at this address.')).toBeVisible();
    expect(site.pageTitle()).toHaveTextContent('No such room');
  });

  test('a room still loading is not called closed', async () => {
    render(<TestApp><Route path="/" lazy={() => new Promise(() => undefined)}/></TestApp>);

    await site.rail();
    expect(screen.queryByRole('heading', {level: 1})).not.toBeInTheDocument();
    expect(screen.queryByText('This room is closed.')).not.toBeInTheDocument();
  });
});

describe('leaving a page', () => {
  test('a new page starts at the top', async () => {
    render(<TestApp at="/"/>);
    await site.pageTitled();
    const landings = scrolling.recordLandings();

    await userEvent.click(site.signpost(/Start where the demos start/));

    await waitFor(() => expect(landings).toContainEqual(scrolling.atTheTop('main')));
  });

  test('arriving at a place on the page keeps that place', async () => {
    const landings = scrolling.recordLandings();

    render(<TestApp at="/#the-record"/>);
    await site.pageTitled();

    expect(landings).toEqual([]);
  });
});

describe('the root path', () => {
  test('opens the front door, which tees up the demos', async () => {
    render(<TestApp at="/"/>);

    expect(await site.pageTitled()).toHaveTextContent('The three languages');
    expect(site.signpost(/Start where the demos start/)).toBeVisible();
  });
});
