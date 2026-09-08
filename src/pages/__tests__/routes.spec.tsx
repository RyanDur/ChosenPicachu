import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithMemoryRouter} from '@test-support';
import {Gallery} from '@pages/Gallery';
import {Games} from '@pages/Games';
import {Users} from '@pages/Users';
import {PageError} from '@pages/PageError';
import {createMemoryRouter, RouterProvider} from 'react-router';
import {RouteObject} from 'react-router';
import {router} from '../../router';

describe('page error boundaries', () => {
  test('every page route declares one, split or not', async () => {
    const lazily = (routes: readonly RouteObject[]): Promise<Omit<RouteObject, 'path'>>[] =>
      routes.flatMap(route => [
        ...(route.lazy !== undefined && typeof route.lazy === 'function' ? [route.lazy()] : []),
        ...(route.children !== undefined ? lazily(route.children) : [])
      ]);
    const split = await Promise.all(lazily(router.children));

    expect(split).toHaveLength(3);
    [...split, Users, Gallery, Games].forEach(route => {
      expect(route.errorElement).toBeDefined();
      expect(route.element).toBeDefined();
    });
  });

  test('a crashing page shows the closed-room message instead of dying', async () => {
    const Boom = () => {
      throw new Error('boom');
    };
    renderWithMemoryRouter({path: '/', element: <Boom/>, errorElement: <PageError/>}, {path: '/'});

    expect(await screen.findByText('This room is closed.')).toBeVisible();
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
