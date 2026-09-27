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

  test('should close the dialog from Cancel', async () => {
    render(<TestApp at="/"/>);
    await site.pageTitled();
    await userEvent.click(screen.getByRole('button', {name: 'Feedback'}));

    await userEvent.click(within(screen.getByRole('dialog', {name: 'Feedback'})).getByRole('button', {name: 'Cancel'}));

    expect(screen.queryByRole('dialog', {name: 'Feedback'})).not.toBeInTheDocument();
  });
});

describe('Feedback without a token', () => {
  test('should offer no Feedback button when the site has no token', async () => {
    render(<TestApp at="/" env={{feedbackToken: ''}}/>);
    await site.pageTitled();

    expect(screen.queryByRole('button', {name: 'Feedback'})).not.toBeInTheDocument();
  });
});

describe('Feedback while a note is on its way', () => {
  test('should send a note once when Feedback is cancelled and reopened before GitHub answers', async () => {
    let release: () => void = () => undefined;
    const held = new Promise<void>(resolve => {
      release = () => resolve();
    });
    let notes = 0;
    server.use(http.post('https://api.github.com/graphql', async ({request}) => {
      if ((await request.text()).includes('search')) {
        return HttpResponse.json({data: {search: {nodes: []}}});
      }
      notes += 1;
      await held;
      return HttpResponse.json({data: {createDiscussion: {discussion: {id: 'D_9', url: 'https://github.test/discussions/9'}}}});
    }));
    render(<TestApp at="/"/>);
    await site.pageTitled();
    await userEvent.click(screen.getByRole('button', {name: 'Feedback'}));
    await userEvent.type(screen.getByRole('textbox', {name: 'What did you find?'}), 'The sort menu hides.{Enter}');
    await userEvent.click(screen.getByRole('button', {name: 'Cancel'}));
    await userEvent.click(screen.getByRole('button', {name: 'Feedback'}));

    await userEvent.type(screen.getByRole('textbox', {name: 'What did you find?'}), '{Enter}');
    release();

    expect(await screen.findByRole('link', {name: 'Read it on GitHub'})).toBeInTheDocument();
    expect(notes).toBe(1);
  });

  test('should keep a new note when the reply to an earlier one arrives', async () => {
    let release: () => void = () => undefined;
    const held = new Promise<void>(resolve => {
      release = () => resolve();
    });
    server.use(http.post('https://api.github.com/graphql', async ({request}) => {
      if ((await request.text()).includes('search')) {
        return HttpResponse.json({data: {search: {nodes: []}}});
      }
      await held;
      return HttpResponse.json({data: {createDiscussion: {discussion: {id: 'D_9', url: 'https://github.test/discussions/9'}}}});
    }));
    render(<TestApp at="/"/>);
    await site.pageTitled();
    await userEvent.click(screen.getByRole('button', {name: 'Feedback'}));
    await userEvent.type(screen.getByRole('textbox', {name: 'What did you find?'}), 'The first.');
    await userEvent.click(screen.getByRole('button', {name: 'Send'}));
    await userEvent.click(screen.getByRole('button', {name: 'Cancel'}));
    await userEvent.click(screen.getByRole('button', {name: 'Feedback'}));
    await userEvent.clear(screen.getByRole('textbox', {name: 'What did you find?'}));
    await userEvent.type(screen.getByRole('textbox', {name: 'What did you find?'}), 'The second.');

    release();

    expect(await screen.findByText('Read it on GitHub')).toBeInTheDocument();
    expect(screen.getByRole('textbox', {name: 'What did you find?'})).toHaveValue('The second.');
    expect(screen.getByRole('dialog', {name: 'Feedback'})).toBeVisible();
  });
});
