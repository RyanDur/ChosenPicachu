import {TestApp} from '@test-support/TestApp';
import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Paths} from '@pages/Paths';
import {createMemoryRouter, Route, RouterProvider} from 'react-router';
import {router} from '../../router';

describe('page error boundaries', () => {
  test('a crashing page shows the closed room inside the site, even with no boundary of its own', async () => {
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

    expect(await within(screen.getByRole('main')).findByText('This room is closed.')).toBeVisible();
    expect(screen.getByRole('navigation', {name: 'site'})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Back to the front door'})).toHaveAttribute('href', Paths.home);
    expect(screen.getByRole('list', {name: 'errors reported'})).toHaveTextContent(/^boom$/);
    expect(caught).toEqual([boom]);
  });

  test('an address the site does not know shows the closed room inside the site', async () => {
    const memory = createMemoryRouter([router], {initialEntries: ['/nowhere/']});
    render(<RouterProvider router={memory}/>);

    expect(await within(screen.getByRole('main')).findByText('This room is closed.')).toBeVisible();
    expect(screen.getByRole('navigation', {name: 'site'})).toBeInTheDocument();
  });
});

const recordingLandings = async (arrive: () => Promise<void>): Promise<[number, number][]> => {
  const landings: [number, number][] = [];
  const recorder = vi.spyOn(Element.prototype, 'scrollTo').mockImplementation((...args: unknown[]) => {
    const [x, y] = args;
    if (typeof x === 'number' && typeof y === 'number') {
      landings.push([x, y]);
    }
  });
  try {
    await arrive();
  } finally {
    recorder.mockRestore();
  }
  return landings;
};

describe('leaving a page', () => {
  test('a new page starts at the top', async () => {
    const landings = await recordingLandings(async () => {
      const memory = createMemoryRouter([router], {initialEntries: ['/']});
      render(<RouterProvider router={memory}/>);
      await screen.findByRole('heading', {level: 1});

      await userEvent.click(screen.getByRole('link', {name: /Start where the demos start/}));

      await screen.findByRole('navigation', {name: 'demos'});
    });

    expect(landings).toContainEqual([0, 0]);
  });

  test('arriving at a place on the page keeps that place', async () => {
    const landings = await recordingLandings(async () => {
      const memory = createMemoryRouter([router], {initialEntries: ['/#record']});
      render(<RouterProvider router={memory}/>);
      await screen.findByRole('heading', {level: 1});
    });

    expect(landings).toEqual([]);
  });
});

describe('the root path', () => {
  test('opens the front door, which tees up the demos', async () => {
    const memory = createMemoryRouter([router], {initialEntries: ['/']});
    render(<RouterProvider router={memory}/>);

    expect(await screen.findByRole('heading', {level: 1})).toHaveTextContent('The three languages');
    expect(screen.getByRole('link', {name: /Start where the demos start/})).toBeVisible();
  });
});
