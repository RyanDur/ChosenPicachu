import {TestApp} from '@__test_support/TestApp';
import {render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {http, HttpResponse} from 'msw';
import {server} from '@__test_support/server';
import {site} from '@pages/__test_support';
import {githubHoldingItsAnswer} from '../__test_support/github';

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
  const opened = async () => {
    render(<TestApp at="/"/>);
    await site.pageTitled();
    await userEvent.click(screen.getByRole('button', {name: 'Feedback'}));
    return screen.getByRole('textbox', {name: 'What did you find?'});
  };

  test('should say the note is on its way and hold Send until GitHub answers', async () => {
    const github = githubHoldingItsAnswer();
    const words = await opened();

    await userEvent.type(words, 'The sort menu hides.{Enter}');

    expect(within(screen.getByRole('dialog', {name: 'Feedback'})).getByRole('status')).toHaveTextContent('Sending the note to GitHub.');
    expect(screen.getByRole('button', {name: 'Send'})).toBeDisabled();
    github.answers();
    expect(await screen.findByRole('link', {name: 'Read it on GitHub'})).toBeInTheDocument();
  });

  test('should send a note once however often Enter is pressed before GitHub answers', async () => {
    const github = githubHoldingItsAnswer();
    const words = await opened();

    await userEvent.type(words, 'The sort menu hides.{Enter}{Enter}');
    github.answers();

    expect(await screen.findByRole('link', {name: 'Read it on GitHub'})).toBeInTheDocument();
    expect(github.notes).toHaveLength(1);
  });

  test('should send a note once when Feedback is cancelled and reopened before GitHub answers', async () => {
    const github = githubHoldingItsAnswer();
    const words = await opened();
    await userEvent.type(words, 'The sort menu hides.{Enter}');
    await userEvent.click(screen.getByRole('button', {name: 'Cancel'}));
    await userEvent.click(screen.getByRole('button', {name: 'Feedback'}));

    await userEvent.type(screen.getByRole('textbox', {name: 'What did you find?'}), '{Enter}');
    github.answers();

    expect(await within(screen.getByRole('dialog', {name: 'Feedback'})).findByRole('link', {name: 'Read it on GitHub'})).toBeInTheDocument();
    expect(github.notes).toHaveLength(1);
  });

  test('should keep a new note when the reply to an earlier one arrives', async () => {
    const github = githubHoldingItsAnswer();
    const words = await opened();
    await userEvent.type(words, 'The first.{Enter}');
    await userEvent.click(screen.getByRole('button', {name: 'Cancel'}));
    await userEvent.click(screen.getByRole('button', {name: 'Feedback'}));
    await userEvent.clear(screen.getByRole('textbox', {name: 'What did you find?'}));
    await userEvent.type(screen.getByRole('textbox', {name: 'What did you find?'}), 'The second.');

    github.answers();

    expect(await within(screen.getByRole('dialog', {name: 'Feedback'})).findByRole('link', {name: 'Read it on GitHub'})).toBeInTheDocument();
    expect(screen.getByRole('textbox', {name: 'What did you find?'})).toHaveValue('The second.');
    expect(screen.getByRole('dialog', {name: 'Feedback'})).toBeVisible();
  });

  test('should free Send when the reply to a note sent before a reopening arrives', async () => {
    const github = githubHoldingItsAnswer();
    const words = await opened();
    await userEvent.type(words, 'The sort menu hides.{Enter}');
    await userEvent.click(screen.getByRole('button', {name: 'Cancel'}));
    await userEvent.click(screen.getByRole('button', {name: 'Feedback'}));

    github.answers();

    const dialog = within(screen.getByRole('dialog', {name: 'Feedback'}));
    await waitFor(() => expect(dialog.getByRole('button', {name: 'Send'})).toBeEnabled());
  });

  test('should say in the dialog that the note was sent when GitHub answers after Feedback is reopened', async () => {
    const github = githubHoldingItsAnswer();
    const words = await opened();
    await userEvent.type(words, 'The sort menu hides.{Enter}');
    await userEvent.click(screen.getByRole('button', {name: 'Cancel'}));
    await userEvent.click(screen.getByRole('button', {name: 'Feedback'}));

    github.answers();

    const status = within(screen.getByRole('dialog', {name: 'Feedback'})).getByRole('status');
    expect(await within(status).findByRole('link', {name: 'Read it on GitHub'})).toHaveAttribute('href', 'https://github.test/discussions/9');
    expect(status).toHaveTextContent(/^Sent\./);
  });

  test('should make a new line on Shift and Enter, and send nothing', async () => {
    const github = githubHoldingItsAnswer();
    const words = await opened();

    await userEvent.type(words, 'one{Shift>}{Enter}{/Shift}two');

    expect(words).toHaveValue('one\ntwo');
    expect(github.notes).toHaveLength(0);
  });
});

describe('Feedback about the page', () => {
  test('should name the page in the About line once its header names it', async () => {
    githubHoldingItsAnswer();
    render(<TestApp at="/demos/?tab=tables"/>);

    await userEvent.click(await screen.findByRole('button', {name: 'Feedback'}));

    expect(await within(screen.getByRole('dialog', {name: 'Feedback'})).findByText('About: Demos Tables')).toBeInTheDocument();
  });
});
