import {screen} from '@testing-library/react';
import {renderWithMemoryRouter} from '@test-support';
import {About, Gallery, Games, Home, Users} from '@pages/index';
import {PageError} from '@pages/PageError';

describe('page error boundaries', () => {
  test('every page route declares one', () => {
    [Home, About, Users, Gallery, Games].forEach(route =>
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
