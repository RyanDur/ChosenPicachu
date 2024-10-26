import {renderWithRouter} from '../../../__tests__/util';
import {expect, test} from 'vitest';
import userEvent from '@testing-library/user-event';
import {screen, waitFor, within} from '@testing-library/react';
import {Paths} from '../../../routes/Paths';
import {AboutPage} from '../component';

describe('The About page', () => {
  test('on initial render', async () => {
    const options = {initialRoute: Paths.about, path: Paths.about};
    renderWithRouter(<AboutPage/>, options);

    await waitFor(() => {
      const main = screen.getByRole('main');
      expect(within(main).getByText('Different styles of Accordions.')).toBeInTheDocument();
    });
  });

  test('when going to the z-index demo', async () => {
    renderWithRouter(<AboutPage/>, {initialRoute: Paths.about, path: Paths.about});

    const demoTabs = screen.getByRole('demo-tabs');
    await userEvent.click(within(demoTabs).getByText('Z-Index'));

    await waitFor(() => {
      const main = screen.getByRole('main');
      expect(within(main).getByText('Z-Index Demo.')).toBeInTheDocument();
    });

    expect(screen.getByTestId('subject-url-search')).toHaveTextContent('tab=z-index');
  });
});