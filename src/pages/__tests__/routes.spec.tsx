import {render, screen} from '@testing-library/react';
import {renderWithMemoryRouter} from '@test-support';
import {Demos, Gallery, Games, Users} from '@pages/index';
import {PageError} from '@pages/PageError';
import {createMemoryRouter, RouterProvider} from 'react-router';
import {router} from '../../router';

describe('page error boundaries', () => {
  test('every page route declares one', () => {
    [Demos, Users, Gallery, Games].forEach(route =>
      expect(route.errorElement).toBeDefined());
  });

  test('a crashing page shows the closed-room message instead of dying', async () => {
    const Boom = () => {
      throw new Error('boom');
    };
    renderWithMemoryRouter({path: '/', element: <Boom/>, errorElement: <PageError/>}, {path: '/'});

    expect(await screen.findByTestId('page-error')).toHaveTextContent('This room is closed.');
  });
});

describe('the root path', () => {
  test('lands the user on the demos', async () => {
    const memory = createMemoryRouter([router], {initialEntries: ['/']});
    render(<RouterProvider router={memory}/>);

    expect(await screen.findByRole('navigation', {name: 'demos'})).toBeVisible();
  });
});
