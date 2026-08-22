import {renderWithMemoryRouter} from '@test-support';
import {expect, test} from 'vitest';
import userEvent from '@testing-library/user-event';
import {screen, waitFor, within} from '@testing-library/react';
import {Paths} from '@pages/Paths';
import {Demos} from '@pages/Demos';

describe('The Demos page', () => {
  test('on initial render', async () => {
    renderWithMemoryRouter(Demos, {path: Paths.demos});

    await waitFor(() => {
      const main = screen.getByRole('main');
      expect(within(main).getByText('Different styles of Accordions.')).toBeInTheDocument();
    });
  });

  test('when going to the z-index demo', async () => {
    renderWithMemoryRouter(Demos, {path: Paths.demos});

    const demoTabs = await screen.findByRole('navigation', {name: 'demos'});
    await userEvent.click(within(demoTabs).getByText('Z-Index'));

    await waitFor(() => {
      const main = screen.getByRole('main');
      expect(within(main).getByText('Z-Index Demo.')).toBeInTheDocument();
    });

    expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('Demos z-index');
  });
});