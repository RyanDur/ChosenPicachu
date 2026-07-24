import {renderWithMemoryRouter} from '@test-support';
import {expect, test} from 'vitest';
import userEvent from '@testing-library/user-event';
import {screen, waitFor, within} from '@testing-library/react';
import {Paths} from '@pages/Paths';
import {About} from '@pages/About';

describe('The About page', () => {
  test('on initial render', async () => {
    renderWithMemoryRouter(About, {path: Paths.about});

    await waitFor(() => {
      const main = screen.getByRole('main');
      expect(within(main).getByText('Different styles of Accordions.')).toBeInTheDocument();
    });
  });

  test('when going to the z-index demo', async () => {
    renderWithMemoryRouter(About, {path: Paths.about});

    const demoTabs = await screen.findByRole('navigation', {name: 'demos'});
    await userEvent.click(within(demoTabs).getByText('Z-Index'));

    await waitFor(() => {
      const main = screen.getByRole('main');
      expect(within(main).getByText('Z-Index Demo.')).toBeInTheDocument();
    });

    expect(screen.getByTestId('header')).toHaveTextContent('About z-index');
  });
});