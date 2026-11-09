import {FC, useEffect, useState} from 'react';
import {act, render, screen} from '@testing-library/react';
import {createMemoryRouter, DataRouter, RouterProvider} from 'react-router';
import {arrival} from '../arrival';

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
</>;

const site = () => createMemoryRouter([
  {path: '/', element: <p>home</p>},
  {path: '/story', element: <Story/>},
  {path: '/other', element: <p>other</p>}
]);

const followed = (router: DataRouter): HTMLElement => {
  const {container} = render(<RouterProvider router={router}/>);
  onTestFinished(arrival.follow(router));
  return container;
};

const aFrame = 16;

// act holds React's rendering until it returns, so each frame gets its own act for a later frame to find what it drew
const afterFrames = async (milliseconds: number): Promise<void> => {
  for (let passed = 0; passed < milliseconds; passed += aFrame) {
    await act(async () => {
      await vi.advanceTimersByTimeAsync(aFrame);
    });
  }
};

const navigated = (router: DataRouter, to: string | number): Promise<void> =>
  act(() => typeof to === 'number' ? router.navigate(to) : router.navigate(to));

describe('arrival', () => {
  beforeEach(() => {
    vi.useFakeTimers({toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame']});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('a reader sent to a fragment the page draws later lands on it', async () => {
    const router = site();
    followed(router);

    await navigated(router, '/story#late');
    await afterFrames(drawnAfter + 1000);

    expect(screen.getByRole('heading', {name: 'late'})).toHaveFocus();
  });

  test('a reader who goes back is not moved by arrival', async () => {
    const router = site();
    followed(router);
    await navigated(router, '/story#here');
    await afterFrames(500);
    await navigated(router, '/other');

    await navigated(router, -1);
    await afterFrames(500);

    expect(screen.getByRole('heading', {name: 'here'})).not.toHaveFocus();
  });

  test('a reader who follows a second link before the first lands ends up only at the second', async () => {
    const router = site();
    const page = followed(router);
    const landedOn: string[] = [];
    page.addEventListener('focusin', ({target}) => {
      if (target instanceof HTMLElement) landedOn.push(target.id);
    });

    await navigated(router, '/story#late');
    await afterFrames(100);
    await navigated(router, '/story#here');
    await afterFrames(drawnAfter + 1000);

    expect(landedOn).toEqual(['here']);
  });

  test('a landing stops when arrival stops following', async () => {
    const router = site();
    render(<RouterProvider router={router}/>);
    const stopFollowing = arrival.follow(router);
    await navigated(router, '/story#late');
    await afterFrames(100);

    stopFollowing();
    await afterFrames(drawnAfter + 1000);

    expect(screen.getByRole('heading', {name: 'late'})).not.toHaveFocus();
  });
});
