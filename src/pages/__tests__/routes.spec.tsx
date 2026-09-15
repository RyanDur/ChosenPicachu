import {TestApp} from '@__test_support/TestApp';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Paths} from '@pages/Paths';
import {Route} from 'react-router';
import {atTheTop, landingsDuring} from '@__test_support/landings';
import {announced, followSignpost, frontDoor, pageTitle, pageTitled, roomSays, siteRail} from '../__test_support';

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

    expect(await roomSays('This room is closed.')).toBeVisible();
    expect(pageTitle()).toHaveTextContent('Closed room');
    expect(await siteRail()).toBeInTheDocument();
    expect(frontDoor()).toHaveAttribute('href', Paths.home);
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

    await roomSays('This room is closed.');
    expect(screen.getByRole('list', {name: 'errors reported'})).toHaveTextContent(/^boom$/);
    expect(caught).toEqual([boom]);
    expect(announced('This room is closed.')).toBeInTheDocument();
  });

  test('an address the site does not know says so, inside the site', async () => {
    render(<TestApp at="/nowhere/"/>);

    expect(await roomSays('There is no room at this address.')).toBeVisible();
    expect(pageTitle()).toHaveTextContent('No such room');
    expect(frontDoor()).toHaveAttribute('href', Paths.home);
    expect(await siteRail()).toBeInTheDocument();
    expect(announced('There is no room at this address.')).toBeInTheDocument();
  });

  test('an unknown address under the games is no room either', async () => {
    render(<TestApp at="/games/nowhere/"/>);

    expect(await roomSays('There is no room at this address.')).toBeVisible();
    expect(pageTitle()).toHaveTextContent('No such room');
  });

  test('a room still loading is not called closed', async () => {
    render(<TestApp><Route path="/" lazy={() => new Promise(() => undefined)}/></TestApp>);

    await siteRail();
    expect(screen.queryByRole('heading', {level: 1})).not.toBeInTheDocument();
    expect(screen.queryByText('This room is closed.')).not.toBeInTheDocument();
  });
});

describe('leaving a page', () => {
  test('a new page starts at the top', async () => {
    render(<TestApp at="/"/>);
    await pageTitled();

    const landings = await landingsDuring(async () => {
      await userEvent.click(followSignpost(/Start where the demos start/));
      await screen.findByRole('navigation', {name: 'demos'});
    });

    expect(landings).toContainEqual(atTheTop('main'));
  });

  test('arriving at a place on the page keeps that place', async () => {
    const landings = await landingsDuring(async () => {
      render(<TestApp at="/#the-record"/>);
      await pageTitled();
    });

    expect(landings).toEqual([]);
  });
});

describe('the root path', () => {
  test('opens the front door, which tees up the demos', async () => {
    render(<TestApp at="/"/>);

    expect(await pageTitled()).toHaveTextContent('The three languages');
    expect(followSignpost(/Start where the demos start/)).toBeVisible();
  });
});
