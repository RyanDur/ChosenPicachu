import {TestApp} from '@__test_support/TestApp';
import {render, screen, waitFor, within} from '@testing-library/react';
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
    expect(await site.nav()).toBeInTheDocument();
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
    expect(await site.nav()).toBeInTheDocument();
    expect(site.announced('There is no room at this address.')).toBeInTheDocument();
  });

  test('an unknown address under the games is no room either', async () => {
    render(<TestApp at="/games/nowhere/"/>);

    expect(await site.roomSays('There is no room at this address.')).toBeVisible();
    expect(site.pageTitle()).toHaveTextContent('No such room');
  });

  test('a room still loading is not called closed', async () => {
    render(<TestApp><Route path="/" lazy={() => new Promise(() => undefined)}/></TestApp>);

    await site.nav();
    expect(screen.queryByRole('heading', {level: 1})).not.toBeInTheDocument();
    expect(screen.queryByText('This room is closed.')).not.toBeInTheDocument();
  });
});

describe('the skeleton', () => {
  test('the site nav stands on its own and comes before the main content', async () => {
    render(<TestApp at="/"/>);
    await site.pageTitled();

    const nav = screen.getByRole('navigation', {name: 'site'});
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
    expect(nav.compareDocumentPosition(screen.getByRole('main'))).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  test('the site nav and Feedback sit together in a region named for what it holds', async () => {
    render(<TestApp at="/"/>);
    await site.pageTitled();

    const rail = await site.rail();

    expect(within(rail).getByRole('navigation', {name: 'site'})).toBeInTheDocument();
    expect(within(rail).getByRole('button', {name: 'Feedback'})).toBeInTheDocument();
  });
});

describe('the rail says which page the reader is on', () => {
  test.each([
    ['Home', Paths.home],
    ['Demos', Paths.demos],
    ['Users', Paths.users],
    ['Games', Paths.games]
  ])('should announce %s as the current page, and no other', async (name, path) => {
    render(<TestApp at={path}/>);
    const nav = await site.nav();

    expect(within(nav).getByRole('link', {name, current: 'page'})).toBeInTheDocument();
    expect(within(nav).getAllByRole('link', {current: 'page'})).toHaveLength(1);
  });

  test('should move the mark to the page the reader follows', async () => {
    render(<TestApp at={Paths.home}/>);
    const nav = await site.nav();

    await userEvent.click(within(nav).getByRole('link', {name: 'Demos'}));

    expect(await within(nav).findByRole('link', {name: 'Demos', current: 'page'})).toBeInTheDocument();
    expect(within(nav).getByRole('link', {name: 'Home', current: false})).toBeInTheDocument();
  });
});

describe('leaving a page', () => {
  test('a new page starts at the top', async () => {
    render(<TestApp at="/"/>);
    await site.pageTitled();
    const landings = scrolling.recordLandings();

    await userEvent.click(site.signpost(/Start where the demos start/));

    await waitFor(() => expect(landings).toContainEqual(scrolling.atTheTop('page')));
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
