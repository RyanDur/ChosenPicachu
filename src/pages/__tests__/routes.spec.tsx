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
});

describe('a room still loading', () => {
  const loading = (at = '/') => render(<TestApp at={at}><Route path={at} lazy={() => new Promise(() => undefined)}/></TestApp>);

  test('stands in the site under the site’s own name, and is not called closed', async () => {
    loading();

    expect(await appAddress.drawn()).toBe('/');
    expect(await site.titled('Chosen Picachu')).toBeVisible();
    expect(site.room()).toBeInTheDocument();
    expect(site.closedRoomIfAny()).not.toBeInTheDocument();
  });

  const anUnmarkedRail: null[] = Array.from({length: 8}, () => null);
  const railMarksWhileLoadingAt = async (at: string): Promise<(string | null)[]> => {
    loading(at);
    return (await site.railLinks()).map(link => link.getAttribute('aria-current'));
  };

  test('leaves every page on the rail unmarked at Home', async () => {
    expect(await railMarksWhileLoadingAt(Paths.home)).toEqual(anUnmarkedRail);
  });

  test('leaves every page on the rail unmarked at a Demos tab', async () => {
    expect(await railMarksWhileLoadingAt(demosAt('tables'))).toEqual(anUnmarkedRail);
  });

  test('leaves every page on the rail unmarked at a Practice tab', async () => {
    expect(await railMarksWhileLoadingAt(practiceAt('behavior'))).toEqual(anUnmarkedRail);
  });

  test('leaves every page on the rail unmarked at Games', async () => {
    expect(await railMarksWhileLoadingAt(Paths.games)).toEqual(anUnmarkedRail);
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
  test('should link Demos to its Accordions tab', async () => {
    render(<TestApp at={Paths.home}/>);

    expect(within(await site.nav()).getByRole('link', {name: 'Demos'})).toHaveAttribute('href', demosAt('accordions'));
  });

  test('should link Practice to its Structure tab', async () => {
    render(<TestApp at={Paths.home}/>);

    expect(within(await site.nav()).getByRole('link', {name: 'Practice'})).toHaveAttribute('href', practiceAt('structure'));
  });
});

describe('the rail says which page the reader is on', () => {
  const currentPagesAt = async (path: string): Promise<(string | null)[]> => {
    render(<TestApp at={path}/>);
    return within(await site.nav()).getAllByRole('link', {current: 'page'}).map(link => link.textContent);
  };

  test('should announce Home as the current page, and no other', async () => {
    expect(await currentPagesAt(Paths.home)).toEqual(['Home']);
  });

  test('should announce Demos as the current page, and no other', async () => {
    expect(await currentPagesAt(Paths.demos)).toEqual(['Demos']);
  });

  test('should announce Demos as the current page on a Demos tab, and no other', async () => {
    expect(await currentPagesAt(demosAt('tables'))).toEqual(['Demos']);
  });

  test('should announce Users as the current page, and no other', async () => {
    expect(await currentPagesAt(Paths.users)).toEqual(['Users']);
  });

  test('should announce Gallery as the current page on a page of a museum, and no other', async () => {
    expect(await currentPagesAt(`${Paths.artGallery}?page=3&size=8&tab=aic`)).toEqual(['Gallery']);
  });

  test('should announce Games as the current page, and no other', async () => {
    expect(await currentPagesAt(Paths.games)).toEqual(['Games']);
  });

  test('should announce Record as the current page, and no other', async () => {
    expect(await currentPagesAt(Paths.record)).toEqual(['Record']);
  });

  test('should announce Practice as the current page, and no other', async () => {
    expect(await currentPagesAt(Paths.practice)).toEqual(['Practice']);
  });

  test('should announce Practice as the current page on a Practice tab, and no other', async () => {
    expect(await currentPagesAt(practiceAt('presentation'))).toEqual(['Practice']);
  });

  test('should announce Demos as the current page on a chart page, and no other', async () => {
    expect(await currentPagesAt(chartPageAt('price'))).toEqual(['Demos']);
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

  test('switching Demos tabs keeps the reader where they were on the page', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await demoTabs.arrivedOn('Accordions');
    const landings = scrolling.recordLandings();

    await demoTabs.open('Charts');

    await site.titled('Demos Charts');
    expect(landings).toEqual([]);
  });

  test('switching Practice tabs keeps the reader where they were on the page', async () => {
    render(<TestApp at={practiceAt('structure')}/>);
    await practicePage.arrivedOn('Structure');
    const landings = scrolling.recordLandings();

    await practicePage.pickTab('Behavior');

    await site.titled('Practice Behavior');
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
