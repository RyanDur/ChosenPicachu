import {TestApp} from '@__test_support/TestApp';
import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {http, HttpResponse} from 'msw';
import {server} from '@__test_support/server';
import {site} from '@pages/__test_support';

describe('Feedback in a browser without invoker commands', () => {
  beforeEach(() => {
    server.use(http.post('https://api.github.com/graphql', () => HttpResponse.json({data: {search: {nodes: []}}})));
  });

  test('should open the dialog from the Feedback button', async () => {
    render(<TestApp at="/"/>);
    await site.pageTitled();

    await userEvent.click(screen.getByRole('button', {name: 'Feedback'}));

    expect(screen.getByRole('dialog', {name: 'Feedback'})).toBeVisible();
  });

  for (const way of ['Cancel', 'Close']) {
    test(`should close the dialog from ${way}`, async () => {
      render(<TestApp at="/"/>);
      await site.pageTitled();
      await userEvent.click(screen.getByRole('button', {name: 'Feedback'}));

      await userEvent.click(within(screen.getByRole('dialog', {name: 'Feedback'})).getByRole('button', {name: way}));

      expect(screen.queryByRole('dialog', {name: 'Feedback'})).not.toBeInTheDocument();
    });
  }
});
