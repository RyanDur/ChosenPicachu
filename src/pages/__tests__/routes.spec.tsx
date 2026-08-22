import {render, screen} from '@testing-library/react';
import {renderWithMemoryRouter} from '@test-support';
import {Gallery} from '@pages/Gallery';
import {Games} from '@pages/Games';
import {Users} from '@pages/Users';
import {PageError} from '@pages/PageError';
import {createMemoryRouter, RouterProvider} from 'react-router';
import {router} from '../../router';

describe('page error boundaries', () => {
  test('every page route declares one, split or not', async () => {
    const split = await Promise.all(router.children.flatMap(child => 'lazy' in child && child.lazy !== undefined ? [child.lazy()] : []));

    expect(split).toHaveLength(2);
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

describe('the root path', () => {
  test('opens the front door, which tees up the demos', async () => {
    const memory = createMemoryRouter([router], {initialEntries: ['/']});
    render(<RouterProvider router={memory}/>);

    expect(await screen.findByRole('heading', {level: 1})).toHaveTextContent('The three languages');
    expect(screen.getByRole('link', {name: /Start with the tables/})).toBeVisible();
  });
});
