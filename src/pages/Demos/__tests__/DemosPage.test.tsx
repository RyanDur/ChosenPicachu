import {TestApp} from '@test-support/TestApp';
import {demosAt} from '@pages/Demos/__test_support/demos';
import {expect, test} from 'vitest';
import userEvent from '@testing-library/user-event';
import {render, screen, waitFor, within} from '@testing-library/react';

describe('The Demos page', () => {
  test('on initial render', async () => {
    render(<TestApp at={demosAt()}/>);

    await waitFor(() => {
      const main = screen.getByRole('main');
      expect(within(main).getByText('Different styles of Accordions.')).toBeInTheDocument();
    });
  });

  test('when going to the z-index demo', async () => {
    render(<TestApp at={demosAt()}/>);

    const demoTabs = await screen.findByRole('navigation', {name: 'demos'});
    await userEvent.click(within(demoTabs).getByText('Z-Index'));

    await waitFor(() => {
      const main = screen.getByRole('main');
      expect(within(main).getByText('Z-Index Demo.')).toBeInTheDocument();
    });

    expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('Demos z-index');
  });
});