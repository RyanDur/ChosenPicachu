import {FC, useSyncExternalStore} from 'react';
import {render} from '@testing-library/react';
import {createMemoryRouter, DataRouter, Link, Outlet, RouterProvider, useNavigate} from 'react-router';
import {arrival} from '../arrival';
import {arrivingReader} from '../__test_support/reader';

type LateTargets = {
  readonly draw: (id: string) => void;
  readonly drawn: (id: string) => boolean;
  readonly subscribe: (listener: () => void) => () => void;
};

const lateTargets = (): LateTargets => {
  const drawn = new Set<string>();
  const listeners = new Set<() => void>();
  return {
    draw: id => {
      drawn.add(id);
      queueMicrotask(() => listeners.forEach(listener => listener()));
    },
    drawn: id => drawn.has(id),
    subscribe: listener => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
};

const DrawnLater: FC<{id: string; late: LateTargets}> = ({id, late}) =>
  useSyncExternalStore(late.subscribe, () => late.drawn(id)) && <h2 id={id} tabIndex={-1}>{id}</h2>;

const Story: FC<{late: LateTargets}> = ({late}) => <>
  <h2 id="here" tabIndex={-1}>here</h2>
  <DrawnLater id="late" late={late}/>
  <details>
    <summary>fold</summary>
    <DrawnLater id="folded" late={late}/>
  </details>
</>;

const Links: FC = () => {
  const navigate = useNavigate();
  return <nav>
    {['/story#late', '/story#here', '/story#folded', '/other', '/later'].map(to => <Link key={to} to={to}>{to}</Link>)}
    <button type="button" onClick={() => navigate(-1)}>back</button>
  </nav>;
};

type LaterPage = {readonly loaded: Promise<void>; readonly loads: () => void};

const laterPage = (): LaterPage => {
  let loads = (): void => undefined;
  const loaded = new Promise<void>(resolve => {
    loads = resolve;
  });
  return {loaded, loads};
};

const site = (late: LateTargets, later: LaterPage, opened: string): DataRouter => createMemoryRouter([{
  element: <><Links/><Outlet/></>,
  hydrateFallbackElement: <p>loading</p>,
  children: [
    {path: '/', element: <p>home</p>},
    {path: '/story', element: <Story late={late}/>},
    {path: '/other', element: <p>other</p>},
    {path: '/later', lazy: async () => later.loaded.then(() => ({element: <Story late={late}/>}))}
  ]
}], {initialEntries: [opened]});

type FollowedSite = {
  readonly draws: (id: string) => void;
  readonly loadsTheLaterPage: () => void;
  readonly stopFollowing: () => void;
};

const siteFollowed = (opened = '/'): FollowedSite => {
  const late = lateTargets();
  const later = laterPage();
  const router = site(late, later, opened);
  render(<RouterProvider router={router}/>);
  const stopFollowing = arrival.follow(router);
  onTestFinished(stopFollowing);
  return {draws: late.draw, loadsTheLaterPage: later.loads, stopFollowing};
};

describe('arrival', () => {
  beforeEach(() => {
    vi.useFakeTimers({toFake: ['requestAnimationFrame', 'cancelAnimationFrame']});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('a reader sent to a fragment the page draws later lands on it', async () => {
    const site = siteFollowed();
    const reader = arrivingReader();
    await reader.follows('/story#late');
    await reader.waits(100);

    site.draws('late');

    await reader.sees('late');
    await reader.waits(500);

    expect(reader.heading('late')).toHaveFocus();
  });

  test('a reader who goes back is not moved by arrival', async () => {
    siteFollowed();
    const reader = arrivingReader();
    await reader.follows('/story#here');
    await reader.waits(500);
    await reader.follows('/other');

    await reader.goesBack();
    await reader.waits(500);

    expect(reader.heading('here')).not.toHaveFocus();
  });

  test('a reader who follows a second link before the first lands ends up only at the second', async () => {
    const site = siteFollowed();
    const reader = arrivingReader();
    await reader.follows('/story#late');
    await reader.waits(100);

    await reader.follows('/story#here');
    site.draws('late');
    await reader.sees('late');
    await reader.waits(500);

    expect(reader.headingsFocused()).toEqual(['here']);
  });

  test('a reader who follows a second link before the first lands leaves the first one’s fold shut', async () => {
    const site = siteFollowed();
    const reader = arrivingReader();
    await reader.follows('/story#folded');
    await reader.waits(100);

    await reader.follows('/story#here');
    site.draws('folded');
    await reader.sees('folded');
    await reader.waits(500);

    expect(reader.fold()).not.toHaveAttribute('open');
  });

  test('a reader who goes back to the entry still being landed on is not moved', async () => {
    const site = siteFollowed();
    const reader = arrivingReader();
    await reader.follows('/story#late');
    await reader.waits(100);
    await reader.follows('/story#here');
    await reader.waits(100);

    await reader.goesBack();
    site.draws('late');
    await reader.sees('late');
    await reader.waits(500);

    expect(reader.heading('late')).not.toHaveFocus();
  });

  test('a reader who opens an address whose page loads later lands on its fragment', async () => {
    const site = siteFollowed('/later#here');
    const reader = arrivingReader();
    await reader.waits(11000);

    site.loadsTheLaterPage();
    await reader.sees('here');
    await reader.waits(500);

    expect(reader.heading('here')).toHaveFocus();
  });

  test('a reader who leaves for a page that loads later is not moved on the page they left', async () => {
    const site = siteFollowed();
    const reader = arrivingReader();
    await reader.follows('/story#late');
    await reader.waits(100);
    site.draws('late');
    await reader.sees('late');

    await reader.follows('/later');
    await reader.waits(500);

    expect(reader.heading('late')).not.toHaveFocus();
  });

  test('a landing stops when arrival stops following', async () => {
    const site = siteFollowed();
    const reader = arrivingReader();
    await reader.follows('/story#late');
    await reader.waits(100);

    site.stopFollowing();
    site.draws('late');
    await reader.sees('late');
    await reader.waits(500);

    expect(reader.heading('late')).not.toHaveFocus();
  });
});
