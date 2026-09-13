import {TestApp} from '@test-support/TestApp';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Paths} from '@pages/Paths';
import {createMemoryRouter, Route, RouterProvider} from 'react-router';
import {router} from '../../router';

describe('page error boundaries', () => {
  test('a crashing page shows the closed room, even with no boundary of its own', async () => {
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

    expect(await screen.findByText('This room is closed.')).toBeVisible();
    expect(screen.getByRole('link', {name: 'Back to the front door'})).toHaveAttribute('href', Paths.home);
    expect(screen.getByRole('list', {name: 'errors reported'})).toHaveTextContent(/^boom$/);
    expect(caught).toEqual([boom]);
  });
});

describe('leaving a page', () => {
  test('a new page starts at the top', async () => {
    const landings: [number, number][] = [];
    Element.prototype.scrollTo = (...args: unknown[]) => {
      const [x, y] = args;
      if (typeof x === 'number' && typeof y === 'number') {
        landings.push([x, y]);
      }
    };
    const memory = createMemoryRouter([router], {initialEntries: ['/']});
    render(<RouterProvider router={memory}/>);
    await screen.findByRole('heading', {level: 1});

    await userEvent.click(screen.getByRole('link', {name: /Start where the demos start/}));

    await screen.findByRole('navigation', {name: 'demos'});
    expect(landings).toContainEqual([0, 0]);
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
