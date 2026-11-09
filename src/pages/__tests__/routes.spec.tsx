import {TestApp} from '@__test_support/TestApp';
import {render, waitFor} from '@testing-library/react';
import {Paths} from '@navigation';
import {createMemoryRouter, Route, RouterProvider} from 'react-router';
import {scrolling} from '@components/__test_support/scrolling';
import {site} from '../__test_support';
import {chartPageAt, demosAt, demoTabs} from '@pages/Demos/__test_support';
import {practiceAt, practicePage} from '@pages/Practice/__test_support/practice';
import {appAddress} from '@__test_support/address';
import {homePage} from '@pages/Home/__test_support/home';
import {ErrorBoundary as DemosLayoutBoundary, Room as DemosLayout} from '@pages/Demos/route';
import {ErrorBoundary as PracticeBoundary} from '@pages/Practice/route';
import {Environment, environment} from '@transport';
import {SiteProviders} from '../../SiteProviders';
import {FallbackPage} from '@page';
import {siteHolding} from '../../routes';

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

  test('a tab that crashes says the room is closed under its own Demos header', async () => {
    const Boom = () => {
      throw new Error('boom');
    };
    render(
      <TestApp at={demosAt('charts')}>
        <Route Component={DemosLayout} ErrorBoundary={DemosLayoutBoundary}>
          <Route path={demosAt('charts')} element={<Boom/>}/>
        </Route>
      </TestApp>,
      {onCaughtError: () => undefined}
    );

    expect(await site.roomSays('This room is closed.')).toBeVisible();
    expect(site.pageTitle()).toHaveTextContent('Demos Charts');
  });

  test('a tutorial that crashes says the room is closed under its own Demos Tables header', async () => {
    const Boom = () => {
      throw new Error('boom');
    };
    render(
      <TestApp at={demosAt('tables/menu')}>
        <Route Component={DemosLayout} ErrorBoundary={DemosLayoutBoundary}>
          <Route path={demosAt('tables/menu')} element={<Boom/>}/>
        </Route>
      </TestApp>,
      {onCaughtError: () => undefined}
    );

    expect(await site.roomSays('This room is closed.')).toBeVisible();
    expect(site.pageTitle()).toHaveTextContent('Demos Tables · Sort menu');
  });

  test('keeps the site nav beside a closed room', async () => {
    const Boom = () => {
      throw new Error('boom');
    };
    render(
      <TestApp at={demosAt('charts')}>
        <Route Component={DemosLayout} ErrorBoundary={DemosLayoutBoundary}>
          <Route path={demosAt('charts')} element={<Boom/>}/>
        </Route>
      </TestApp>,
      {onCaughtError: () => undefined}
    );
    await site.roomSays('This room is closed.');

    expect(await site.nav()).toBeInTheDocument();
  });

  test('a Practice tab that crashes says the room is closed under its own Practice header', async () => {
    const Boom = () => {
      throw new Error('boom');
    };
    render(
      <TestApp at={practiceAt('structure')}>
        <Route path={Paths.practiceTab} element={<Boom/>} ErrorBoundary={PracticeBoundary}/>
      </TestApp>,
      {onCaughtError: () => undefined}
    );

    expect(await site.roomSays('This room is closed.')).toBeVisible();
    expect(site.pageTitle()).toHaveTextContent('Practice Structure');
  });

  test('a crash in the frame around every page still says the room is closed, under the site’s own name, with the way home', async () => {
    const feedbackThatCrashes: Environment = {
      ...environment,
      get feedbackToken(): string {
        throw new Error('boom');
      }
    };
    render(
      <SiteProviders environment={feedbackThatCrashes}>
        <RouterProvider router={createMemoryRouter([siteHolding([])])}/>
      </SiteProviders>,
      {onCaughtError: () => undefined}
    );

    expect(await site.roomSays('This room is closed.')).toBeVisible();
    expect(site.pageTitle()).toHaveTextContent('Chosen Picachu');
    expect(site.frontDoor()).toHaveAttribute('href', Paths.home);
  });

  test('a crash in the frame around every page is announced', async () => {
    const feedbackThatCrashes: Environment = {
      ...environment,
      get feedbackToken(): string {
        throw new Error('boom');
      }
    };
    render(
      <SiteProviders environment={feedbackThatCrashes}>
        <RouterProvider router={createMemoryRouter([siteHolding([])])}/>
      </SiteProviders>,
      {onCaughtError: () => undefined}
    );

    await site.roomSays('This room is closed.');
    expect(site.announced('This room is closed.')).toBeInTheDocument();
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
    expect(site.errorsReported()).toHaveTextContent(/^boom$/);
    expect(caught).toEqual([boom]);
    expect(site.announced('This room is closed.')).toBeInTheDocument();
  });

  test('takes the closed room\'s banner down once the reader leaves the room by the rail', async () => {
    const Boom = () => {
      throw new Error('boom');
    };
    render(
      <TestApp at={Paths.games}>
        <Route path={Paths.home} element={<p>home</p>}/>
        <Route path={Paths.games} element={<Boom/>}/>
      </TestApp>,
      {onCaughtError: () => undefined}
    );
    await site.roomSays('This room is closed.');

    await site.followRail('Home');

    await waitFor(() => expect(site.railLink('Home')).toHaveAttribute('aria-current', 'page'));
    expect(site.announcedIfAny('This room is closed.')).not.toBeInTheDocument();
  });

  test('announces a second crash after the reader leaves the first closed room', async () => {
    const Boom = () => {
      throw new Error('boom');
    };
    render(
      <TestApp at={Paths.games}>
        <Route path={Paths.home} element={<p>home</p>}/>
        <Route path={Paths.games} element={<Boom/>}/>
        <Route path={Paths.record} element={<Boom/>}/>
      </TestApp>,
      {onCaughtError: () => undefined}
    );
    await site.roomSays('This room is closed.');
    await site.followRail('Home');
    await waitFor(() => expect(site.railLink('Home')).toHaveAttribute('aria-current', 'page'));

    await site.followRail('Record');

    await site.roomSays('This room is closed.');
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

  test('marks the page whose room is still loading', async () => {
    loading(demosAt('tables'));

    expect(await site.currentPages()).toEqual(['Demos']);
  });

  test('the fallback page the server draws leaves every page on the rail unmarked', async () => {
    render(<SiteProviders environment={environment}>
      <RouterProvider router={createMemoryRouter([{path: '*', Component: FallbackPage}], {initialEntries: [Paths.games]})}/>
    </SiteProviders>);

    expect((await site.railLinks()).filter(link => link.hasAttribute('aria-current'))).toEqual([]);
  });
});

describe('the skeleton', () => {
  test('the site nav stands on its own and comes before the main content', async () => {
    render(<TestApp at="/"/>);
    await site.pageTitled();

    const nav = await site.nav();
    expect(site.asideIfAny()).not.toBeInTheDocument();
    expect(nav.compareDocumentPosition(site.main())).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  test('the site nav and Feedback sit together in a region named for what it holds', async () => {
    render(<TestApp at="/"/>);
    await site.pageTitled();

    expect(await site.railHoldsTheNav()).toBeInTheDocument();
    expect(await site.railHoldsFeedback()).toBeInTheDocument();
  });
});

describe('the rail lists the site’s pages', () => {
  test('should list Home, Record, Practice, Demos, Users, Gallery, Games and Repo, in that order', async () => {
    render(<TestApp at={Paths.users}/>);

    expect(await site.railNames()).toEqual(['Home', 'Record', 'Practice', 'Demos', 'Users', 'Gallery', 'Games', 'Repo']);
  });

  test('should take the reader to the record from the rail', async () => {
    render(<TestApp at={Paths.users}/>);

    await site.followRail('Record');

    expect(await site.titled('The record')).toBeInTheDocument();
    expect(await site.currentPages()).toEqual(['Record']);
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

    await site.followRail('Practice');

    expect(await site.titled('Practice Structure')).toBeInTheDocument();
    expect(await site.currentPages()).toEqual(['Practice']);
  });
});

describe('the rail goes straight to the first tab', () => {
  test('should link Demos to its Accordions tab', async () => {
    render(<TestApp at={Paths.home}/>);

    await site.nav();

    expect(site.railLink('Demos')).toHaveAttribute('href', demosAt('accordions'));
  });

  test('should link Practice to its Structure tab', async () => {
    render(<TestApp at={Paths.home}/>);

    await site.nav();

    expect(site.railLink('Practice')).toHaveAttribute('href', practiceAt('structure'));
  });

  test('should link Gallery to the Art Institute\'s first page of eight works', async () => {
    render(<TestApp at={Paths.home}/>);

    await site.nav();

    expect(site.railLink('Gallery')).toHaveAttribute('href', `${Paths.artGallery}?page=1&size=8&tab=aic`);
  });
});

describe('the rail says which page the reader is on', () => {
  test('should announce Home as the current page, and no other', async () => {
    render(<TestApp at={Paths.home}/>);

    expect(await site.currentPages()).toEqual(['Home']);
  });

  test('should announce Demos as the current page, and no other', async () => {
    render(<TestApp at={Paths.demos}/>);

    expect(await site.currentPages()).toEqual(['Demos']);
  });

  test('should announce Demos as the current page on a Demos tab, and no other', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    expect(await site.currentPages()).toEqual(['Demos']);
  });

  test('should announce Users as the current page, and no other', async () => {
    render(<TestApp at={Paths.users}/>);

    expect(await site.currentPages()).toEqual(['Users']);
  });

  test('should announce Gallery as the current page on a page of a museum, and no other', async () => {
    render(<TestApp at={`${Paths.artGallery}?page=3&size=8&tab=aic`}/>);

    expect(await site.currentPages()).toEqual(['Gallery']);
  });

  test('should announce Games as the current page, and no other', async () => {
    render(<TestApp at={Paths.games}/>);

    expect(await site.currentPages()).toEqual(['Games']);
  });

  test('should announce Record as the current page, and no other', async () => {
    render(<TestApp at={Paths.record}/>);

    expect(await site.currentPages()).toEqual(['Record']);
  });

  test('should announce Practice as the current page, and no other', async () => {
    render(<TestApp at={Paths.practice}/>);

    expect(await site.currentPages()).toEqual(['Practice']);
  });

  test('should announce Practice as the current page on a Practice tab, and no other', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);

    expect(await site.currentPages()).toEqual(['Practice']);
  });

  test('should announce Demos as the current page on a chart page, and no other', async () => {
    render(<TestApp at={chartPageAt('price')}/>);

    expect(await site.currentPages()).toEqual(['Demos']);
  });

  test('should move the mark to the page the reader follows, and keep the reader on it', async () => {
    render(<TestApp at={Paths.home}/>);

    await site.followRail('Demos');

    await waitFor(() => expect(site.railLink('Demos')).toHaveAttribute('aria-current', 'page'));
    expect(site.railLink('Demos')).toHaveFocus();
    expect(site.railLink('Home')).not.toHaveAttribute('aria-current');
  });

  test('should keep the reader on the rail link they follow out of a closed room', async () => {
    const Boom = () => {
      throw new Error('boom');
    };
    render(
      <TestApp at={Paths.games}><Route path={Paths.games} element={<Boom/>}/></TestApp>,
      {onCaughtError: () => undefined}
    );
    await site.roomSays('This room is closed.');

    await site.followRail('Home');

    await waitFor(() => expect(site.railLink('Home')).toHaveAttribute('aria-current', 'page'));
    expect(site.railLink('Home')).toHaveFocus();
  });

  test('should leave focus to the platform after a link followed from the page itself', async () => {
    render(<TestApp at={Paths.home}/>);
    await homePage.arrived();

    await homePage.followOpenerLink('the Structure story');

    await waitFor(() => expect(site.railLink('Record')).toHaveAttribute('aria-current', 'page'));
    expect(site.railLink('Record')).not.toHaveFocus();
  });
});

describe('leaving a page', () => {
  test('a new page starts at the top', async () => {
    render(<TestApp at="/"/>);
    await site.pageTitled();
    const landings = scrolling.recordLandings();

    await site.followRail('Record');

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
