import {TestApp} from '@test-support/TestApp';
import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Paths} from '@pages/Paths';
import {Route} from 'react-router';

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
    expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('Closed room');
    expect(screen.getByRole('navigation', {name: 'site'})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Back to the front door'})).toHaveAttribute('href', Paths.home);
    expect(screen.getByRole('list', {name: 'errors reported'})).toHaveTextContent(/^boom$/);
    expect(caught).toEqual([boom]);
  });

  test('an address the site does not know says so, inside the site', async () => {
    render(<TestApp at="/nowhere/"/>);

    expect(await within(screen.getByRole('main')).findByText('There is no room at this address.')).toBeVisible();
    expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('No such room');
    expect(screen.getByRole('link', {name: 'Back to the front door'})).toHaveAttribute('href', Paths.home);
    expect(screen.getByRole('navigation', {name: 'site'})).toBeInTheDocument();
  });
});

const recordingLandings = async (act: () => Promise<void>): Promise<[number, number][]> => {
  const landings: [number, number][] = [];
  const recorder = vi.spyOn(Element.prototype, 'scrollTo').mockImplementation((...args: unknown[]) => {
    const [x, y] = args;
    if (typeof x === 'number' && typeof y === 'number') {
      landings.push([x, y]);
    }
  });
  try {
    await act();
  } finally {
    recorder.mockRestore();
  }
  return landings;
};

describe('leaving a page', () => {
  test('a new page starts at the top', async () => {
    render(<TestApp at="/"/>);
    await screen.findByRole('heading', {level: 1});

    const landings = await recordingLandings(async () => {
      await userEvent.click(screen.getByRole('link', {name: /Start where the demos start/}));
      await screen.findByRole('navigation', {name: 'demos'});
    });

    expect(landings).toEqual([[0, 0]]);
  });

  test('arriving at a place on the page keeps that place', async () => {
    const landings = await recordingLandings(async () => {
      render(<TestApp at="/#the-record"/>);
      await screen.findByRole('heading', {level: 1});
    });

    expect(landings).toEqual([]);
  });
});

describe('the root path', () => {
  test('opens the front door, which tees up the demos', async () => {
    render(<TestApp at="/"/>);

    expect(await screen.findByRole('heading', {level: 1})).toHaveTextContent('The three languages');
    expect(screen.getByRole('link', {name: /Start where the demos start/})).toBeVisible();
  });
});
