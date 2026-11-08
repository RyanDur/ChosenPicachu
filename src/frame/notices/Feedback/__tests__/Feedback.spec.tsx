import {TestApp} from '@__test_support/TestApp';
import {render, waitFor} from '@testing-library/react';
import {site} from '@pages/__test_support';
import {demosAt} from '@pages/Demos/__test_support';
import {
  githubFindingNoThread,
  githubHoldingAThread,
  githubHoldingItsAnswer,
  githubLosingThePageThread
} from '../__test_support/github';
import {feedback} from '../__test_support/feedback';
import {setupAICAllArtResponse} from '@pages/Gallery/__test_support';
import {aicArtResponse} from '@pages/Gallery/__test_support/fixtures';

describe('Feedback in a browser without invoker commands', () => {
  beforeEach(() => {
    githubFindingNoThread();
  });

  test('should open the dialog from the Feedback button', async () => {
    render(<TestApp at="/"/>);
    await site.pageTitled();

    await feedback.open();

    expect(feedback.dialog()).toBeVisible();
  });

  test('should keep the words a reader wrote after they follow the rail to the gallery', async () => {
    setupAICAllArtResponse(aicArtResponse);
    render(<TestApp at="/"/>);
    await site.pageTitled();
    await feedback.open();
    await feedback.write('The rail moved.');
    await feedback.cancel();
    await site.followRail('Gallery');
    await site.arrivedAt('Gallery');

    await feedback.open();

    expect(feedback.note()).toHaveValue('The rail moved.');
  });

  test('should close the dialog from Cancel', async () => {
    render(<TestApp at="/"/>);
    await site.pageTitled();
    await feedback.open();

    await feedback.cancel();

    expect(feedback.dialogIfAny()).not.toBeInTheDocument();
  });
});

describe('Feedback without a token', () => {
  test('should offer no Feedback button when the site has no token', async () => {
    render(<TestApp at="/" env={{feedbackToken: ''}}/>);
    await site.pageTitled();

    expect(feedback.offeredIfAny()).not.toBeInTheDocument();
  });
});

describe('Feedback while a note is on its way', () => {
  test('should say the note is on its way and hold Send until GitHub answers', async () => {
    const github = githubHoldingItsAnswer();
    render(<TestApp at="/"/>);
    await site.pageTitled();
    await feedback.open();

    await feedback.write('The sort menu hides.');
    await feedback.send();

    expect(feedback.status()).toHaveTextContent('Sending the note to GitHub.');
    expect(feedback.sendControl()).toBeDisabled();
    github.answers();
    expect(await feedback.noteOnGitHub()).toBeInTheDocument();
  });

  test('should say in the note the live page it was sent from', async () => {
    const github = githubHoldingItsAnswer();
    render(<TestApp at="/record/?moment=concert"/>);
    await site.pageTitled();
    await feedback.open();

    await feedback.write('The timeline skips.');
    await feedback.send();

    await waitFor(() => expect(github.notes).toHaveLength(1));
    expect(github.notes[0]).toContain('Sent from https://ryandur.github.io/record/?moment=concert');
  });

  test('should send a note once however often Enter is pressed before GitHub answers', async () => {
    const github = githubHoldingItsAnswer();
    render(<TestApp at="/"/>);
    await site.pageTitled();
    await feedback.open();

    await feedback.write('The sort menu hides.');
    await feedback.send();
    await feedback.send();
    github.answers();

    expect(await feedback.noteOnGitHub()).toBeInTheDocument();
    expect(github.notes).toHaveLength(1);
  });

  test('should send a note once when Feedback is canceled and reopened before GitHub answers', async () => {
    const github = githubHoldingItsAnswer();
    render(<TestApp at="/"/>);
    await site.pageTitled();
    await feedback.open();
    await feedback.write('The sort menu hides.');
    await feedback.send();
    await feedback.cancel();
    await feedback.open();

    await feedback.send();
    github.answers();

    expect(await feedback.noteOnGitHubFromTheDialog()).toBeInTheDocument();
    expect(github.notes).toHaveLength(1);
  });

  test('should keep a new note when the reply to an earlier one arrives', async () => {
    const github = githubHoldingItsAnswer();
    render(<TestApp at="/"/>);
    await site.pageTitled();
    await feedback.open();
    await feedback.write('The first.');
    await feedback.send();
    await feedback.cancel();
    await feedback.open();
    await feedback.rewrite('The second.');

    github.answers();

    expect(await feedback.noteOnGitHubFromTheDialog()).toBeInTheDocument();
    expect(feedback.note()).toHaveValue('The second.');
    expect(feedback.dialog()).toBeVisible();
  });

  test('should free Send when the reply to a note sent before a reopening arrives', async () => {
    const github = githubHoldingItsAnswer();
    render(<TestApp at="/"/>);
    await site.pageTitled();
    await feedback.open();
    await feedback.write('The sort menu hides.');
    await feedback.send();
    await feedback.cancel();
    await feedback.open();

    github.answers();

    await waitFor(() => expect(feedback.sendControl()).toBeEnabled());
  });

  test('should say in the dialog that the note was sent when GitHub answers after Feedback is reopened', async () => {
    const github = githubHoldingItsAnswer();
    render(<TestApp at="/"/>);
    await site.pageTitled();
    await feedback.open();
    await feedback.write('The sort menu hides.');
    await feedback.send();
    await feedback.cancel();
    await feedback.open();

    github.answers();

    expect(await feedback.noteOnGitHubFromTheDialog()).toHaveAttribute('href', 'https://github.test/discussions/9');
    expect(feedback.status()).toHaveTextContent(/^Sent\./);
  });

  test('should clear the sent note from the field when GitHub answers after Feedback is reopened', async () => {
    const github = githubHoldingItsAnswer();
    render(<TestApp at="/"/>);
    await site.pageTitled();
    await feedback.open();
    await feedback.write('The sort menu hides.');
    await feedback.send();
    await feedback.cancel();
    await feedback.open();

    github.answers();

    expect(await feedback.noteOnGitHubFromTheDialog()).toBeInTheDocument();
    expect(feedback.note()).toHaveValue('');
  });

  test('should keep a changed way to reach the reader when the reply to an earlier note arrives', async () => {
    const github = githubHoldingItsAnswer();
    render(<TestApp at="/"/>);
    await site.pageTitled();
    await feedback.open();
    await feedback.leaveAWayToReach('reader@example.test');
    await feedback.write('The sort menu hides.');
    await feedback.send();
    await feedback.cancel();
    await feedback.open();
    await feedback.changeTheWayToReach('another@example.test');

    github.answers();

    expect(await feedback.noteOnGitHubFromTheDialog()).toBeInTheDocument();
    expect(feedback.wayToReach()).toHaveValue('another@example.test');
    expect(feedback.note()).toHaveValue('The sort menu hides.');
  });

  test('should clear the way to reach the reader with the sent note when GitHub answers after Feedback is reopened', async () => {
    const github = githubHoldingItsAnswer();
    render(<TestApp at="/"/>);
    await site.pageTitled();
    await feedback.open();
    await feedback.leaveAWayToReach('reader@example.test');
    await feedback.write('The sort menu hides.');
    await feedback.send();
    await feedback.cancel();
    await feedback.open();

    github.answers();

    expect(await feedback.noteOnGitHubFromTheDialog()).toBeInTheDocument();
    expect(feedback.wayToReach()).toHaveValue('');
  });

  test('should make a new line on Shift and Enter, and send nothing', async () => {
    const github = githubHoldingItsAnswer();
    render(<TestApp at="/"/>);
    await site.pageTitled();
    await feedback.open();

    await feedback.write('one');
    await feedback.startNewLine();
    await feedback.write('two');

    expect(feedback.note()).toHaveValue('one\ntwo');
    expect(github.notes).toHaveLength(0);
  });
});

describe('Feedback about the page', () => {
  test('should name the page in the About line once its header names it', async () => {
    githubFindingNoThread();
    render(<TestApp at={demosAt('tables')}/>);

    await feedback.open();

    expect(await feedback.says('About: Demos Tables')).toBeInTheDocument();
  });

  test('should find the thread a demos tab already has, kept under the tab\'s own address', async () => {
    githubHoldingAThread('Feedback: Demos Tables (/demos/tables/)');
    render(<TestApp at={demosAt('tables')}/>);

    await feedback.open();

    expect(await feedback.pageThread()).toHaveAttribute('href', 'https://github.test/discussions/9');
  });
});

describe('Feedback when GitHub refuses', () => {
  test('should say GitHub has nothing at that address when the page’s thread is gone, and keep the words', async () => {
    githubLosingThePageThread();
    render(<TestApp at="/"/>);
    await site.pageTitled();
    await feedback.open();

    await feedback.write('The sort menu hides.');
    await feedback.send();

    expect(await feedback.says('GitHub has nothing at that address. Your words are still here.')).toBeInTheDocument();
    expect(feedback.note()).toHaveValue('The sort menu hides.');
  });
});
