import {renderWithRouter} from './util';
import {expect, test} from 'vitest';
import {screen, waitFor, within} from '@testing-library/react';
import {Paths} from '../routes/Paths';
import userEvent from '@testing-library/user-event';
import {AboutPage} from '../components';

describe('The About page', () => {
  test('on initial render', async () => {
    renderWithRouter(<AboutPage/>, {initialRoute: Paths.about, path: Paths.about});

    await waitFor(() => {
      const main = screen.getByRole('main');
      expect(within(main).getByText('Different styles of Accordions.')).toBeInTheDocument();
    });
  });

  test('when going to the z-index demo', async () => {
    const rendered = renderWithRouter(<AboutPage/>, {initialRoute: Paths.about, path: Paths.about});

    const demoTabs = screen.getByRole('demo-tabs');
    await userEvent.click(within(demoTabs).getByText('Z-Index'));

    await waitFor(() => {
      const main = screen.getByRole('main');
      expect(within(main).getByText('Z-Index Demo.')).toBeInTheDocument();
    });

    expect(rendered().testLocation?.search).toEqual('?tab=z-index');
  });
});