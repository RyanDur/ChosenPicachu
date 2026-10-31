import {TestApp} from '@__test_support/TestApp';
import {render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Paths} from '@pages/Paths';
import {Route} from 'react-router';
import {scrolling} from '@components/__test_support/scrolling';
import {site} from '../__test_support';
import {chartPageAt, demosAt, demoTabs} from '@pages/Demos/__test_support';
import {practiceAt, practicePage} from '@pages/Practice/__test_support/practice';
import {appAddress} from '@__test_support/address';
import {homePage} from '@pages/Home/__test_support/home';

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

  test('a page that crashes inside the gallery says the room is closed under the gallery\'s own header', async () => {
    const Boom = () => {
      throw new Error('boom');
    };
    render(<TestApp at={Paths.artGallery}><Boom/></TestApp>, {onCaughtError: () => undefined});

    expect(await site.roomSays('This room is closed.')).toBeVisible();
    expect(site.pageTitle()).toHaveTextContent('Gallery');
    expect(await site.nav()).toBeInTheDocument();
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

  test('the old address of the game that was never built is no room, with Games still current', async () => {
    render(<TestApp at={`${Paths.games}colorGame`}/>);

    expect(await site.roomSays('There is no room at this address.')).toBeVisible();
    expect(site.pageTitle()).toHaveTextContent('No such room');
    expect(site.railLink('Games')).toHaveAttribute('aria-current', 'page');
  });

  test('a room still loading is not called closed', async () => {
    render(<TestApp><Route path="/" lazy={() => new Promise(() => undefined)}/></TestApp>);

    expect(await appAddress.drawn()).toBe('/');
    expect(site.pageTitleIfAny()).not.toBeInTheDocument();
    expect(site.closedRoomIfAny()).not.toBeInTheDocument();
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

describe('the rail lists the site’s pages', () => {
  test('should list Home, Record, Practice, Demos, Users, Gallery, Games and Repo, in that order', async () => {
    render(<TestApp at={Paths.users}/>);

    const nav = await site.nav();

    expect(within(nav).getAllByRole('link').map(link => link.textContent)).toEqual(['Home', 'Record', 'Practice', 'Demos', 'Users', 'Gallery', 'Games', 'Repo']);
  });

  test('should take the reader to the record from the rail', async () => {
    render(<TestApp at={Paths.users}/>);
    const nav = await site.nav();

    await userEvent.click(within(nav).getByRole('link', {name: 'Record'}));

    expect(await within(await site.nav()).findByRole('link', {name: 'Record', current: 'page'})).toBeInTheDocument();
    expect(await screen.findByRole('heading', {name: 'The record', level: 1})).toBeInTheDocument();
  });
});

describe('a link saved to the old Development address', () => {
  test('should land on the Practice page, on the tab it named', async () => {
    render(<TestApp at="/development/?tab=presentation"/>);

    expect(await appAddress.movedOnFrom('/development/?tab=presentation')).toBe(practiceAt('presentation'));
    expect(site.pageTitle()).toHaveTextContent('Practice Presentation');
  });

  test('should land a former tab name on the tab it became', async () => {
    render(<TestApp at="/development/?tab=dynamic"/>);

    expect(await appAddress.movedOnFrom('/development/?tab=dynamic')).toBe(practiceAt('behavior'));
    expect(site.pageTitle()).toHaveTextContent('Practice Behavior');
  });
});

describe('the rail takes the reader to Practice', () => {
  test('should land on the Structure tab', async () => {
    render(<TestApp at={Paths.users}/>);

    await userEvent.click(within(await site.nav()).getByRole('link', {name: 'Practice'}));

    expect(await within(await site.nav()).findByRole('link', {name: 'Practice', current: 'page'})).toBeInTheDocument();
    expect(await screen.findByRole('heading', {name: 'Practice Structure', level: 1})).toBeInTheDocument();
  });
});

describe('the rail goes straight to the first tab', () => {
  test.each([
    ['Demos', demosAt('accordions')],
    ['Practice', practiceAt('structure')]
  ])('should link %s to %s', async (name, address) => {
    render(<TestApp at={Paths.home}/>);

    expect(within(await site.nav()).getByRole('link', {name})).toHaveAttribute('href', address);
  });
});

describe('the rail says which page the reader is on', () => {
  test.each([
    ['Home', Paths.home],
    ['Demos', Paths.demos],
    ['Demos', demosAt('tables')],
    ['Users', Paths.users],
    ['Gallery', `${Paths.artGallery}?page=3&size=8&tab=aic`],
    ['Games', Paths.games],
    ['Record', Paths.record],
    ['Practice', Paths.practice],
    ['Practice', practiceAt('presentation')],
    ['Demos', chartPageAt('price')]
  ])('should announce %s as the current page, and no other', async (name, path) => {
    render(<TestApp at={path}/>);
    const nav = await site.nav();

    expect(within(nav).getByRole('link', {name, current: 'page'})).toBeInTheDocument();
    expect(within(nav).getAllByRole('link', {current: 'page'})).toHaveLength(1);
  });

  test('should move the mark to the page the reader follows, and keep the reader on it', async () => {
    render(<TestApp at={Paths.home}/>);

    await site.followRail('Demos');

    await waitFor(() => expect(site.railLink('Demos')).toHaveAttribute('aria-current', 'page'));
    expect(site.railLink('Demos')).toHaveFocus();
    expect(site.railLink('Home')).not.toHaveAttribute('aria-current');
  });

  test('should leave focus to the platform after a link followed from the page itself', async () => {
    render(<TestApp at={Paths.home}/>);
    await homePage.arrived();

    await homePage.followStorySignpost('Structure');

    await waitFor(() => expect(site.railLink('Record')).toHaveAttribute('aria-current', 'page'));
    expect(site.railLink('Record')).not.toHaveFocus();
  });
});

describe('leaving a page', () => {
  test('a new page starts at the top', async () => {
    render(<TestApp at="/"/>);
    await site.pageTitled();
    const landings = scrolling.recordLandings();

    await userEvent.click(within(await site.rail()).getByRole('link', {name: 'Record'}));

    await waitFor(() => expect(landings).toContainEqual(scrolling.atTheTop('page')));
  });

  test.each([
    {page: 'Demos', at: demosAt('accordions'), arrived: () => demoTabs.arrivedOn('Accordions'), switchTab: () => demoTabs.open('Charts'), title: 'Demos Charts'},
    {page: 'Practice', at: practiceAt('structure'), arrived: () => practicePage.arrivedOn('Structure'), switchTab: () => practicePage.pickTab('Behavior'), title: 'Practice Behavior'}
  ])('switching $page tabs keeps the reader where they were on the page', async ({at, arrived, switchTab, title}) => {
    render(<TestApp at={at}/>);
    await arrived();
    const landings = scrolling.recordLandings();

    await switchTab();

    await site.titled(title);
    expect(landings).toEqual([]);
  });

  test('arriving at a place on the page keeps that place', async () => {
    const landings = scrolling.recordLandings();

    render(<TestApp at={`${Paths.record}#the-record`}/>);
    await site.pageTitled();

    expect(landings).toEqual([]);
  });
});

describe('the root path', () => {
  test('opens the front door', async () => {
    render(<TestApp at="/"/>);

    expect(await site.pageTitled()).toHaveTextContent('The three languages');
  });
});
