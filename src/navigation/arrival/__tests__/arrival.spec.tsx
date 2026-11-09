import {FC, useEffect, useState} from 'react';
import {render} from '@testing-library/react';
import {createMemoryRouter, DataRouter, Link, Outlet, RouterProvider, useNavigate} from 'react-router';
import {arrival} from '../arrival';
import {arrivingReader} from '../__test_support/reader';

const drawnAfter = 3000;

const DrawnLater: FC<{id: string}> = ({id}) => {
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const drawing = setTimeout(() => setDrawn(true), drawnAfter);
    return () => clearTimeout(drawing);
  }, []);
  return drawn && <h2 id={id} tabIndex={-1}>{id}</h2>;
};

const Story: FC = () => <>
  <h2 id="here" tabIndex={-1}>here</h2>
  <DrawnLater id="late"/>
  <details>
    <summary>fold</summary>
    <DrawnLater id="folded"/>
  </details>
</>;

const Links: FC = () => {
  const navigate = useNavigate();
  return <nav>
    {['/story#late', '/story#here', '/story#folded', '/other'].map(to => <Link key={to} to={to}>{to}</Link>)}
    <button type="button" onClick={() => navigate(-1)}>back</button>
  </nav>;
};

const site = (): DataRouter => createMemoryRouter([{
  element: <><Links/><Outlet/></>,
  children: [
    {path: '/', element: <p>home</p>},
    {path: '/story', element: <Story/>},
    {path: '/other', element: <p>other</p>}
  ]
}]);

const siteFollowed = (): (() => void) => {
  const router = site();
  render(<RouterProvider router={router}/>);
  const stopFollowing = arrival.follow(router);
  onTestFinished(stopFollowing);
  return stopFollowing;
};

describe('arrival', () => {
  beforeEach(() => {
    vi.useFakeTimers({toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'], shouldAdvanceTime: true});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('a reader sent to a fragment the page draws later lands on it', async () => {
    siteFollowed();
    const reader = arrivingReader();

    await reader.follows('/story#late');
    await reader.waits(drawnAfter + 1000);

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
    siteFollowed();
    const reader = arrivingReader();

    await reader.follows('/story#late');
    await reader.waits(100);
    await reader.follows('/story#here');
    await reader.waits(drawnAfter + 1000);

    expect(reader.headingsFocused()).toEqual(['here']);
  });

  test('a reader who follows a second link before the first lands leaves the first one’s fold shut', async () => {
    siteFollowed();
    const reader = arrivingReader();

    await reader.follows('/story#folded');
    await reader.waits(100);
    await reader.follows('/story#here');
    await reader.waits(drawnAfter + 1000);

    expect(reader.fold()).not.toHaveAttribute('open');
  });

  test('a reader who goes back to the entry still being landed on is not moved', async () => {
    siteFollowed();
    const reader = arrivingReader();
    await reader.follows('/story#late');
    await reader.waits(100);
    await reader.follows('/story#here');
    await reader.waits(100);

    await reader.goesBack();
    await reader.waits(drawnAfter + 1000);

    expect(reader.heading('late')).not.toHaveFocus();
  });

  test('a landing stops when arrival stops following', async () => {
    const stopFollowing = siteFollowed();
    const reader = arrivingReader();
    await reader.follows('/story#late');
    await reader.waits(100);

    stopFollowing();
    await reader.waits(drawnAfter + 1000);

    expect(reader.heading('late')).not.toHaveFocus();
  });
});
