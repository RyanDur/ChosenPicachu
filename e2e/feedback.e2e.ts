import {expect, type Page} from '@playwright/test';
import {test} from './__test_support/journey';
import {clickWhereItIs, desktop, feedbackOn, github, iPadUpright, iPhone, phoneSideways, pressTab, siteFrame, twoFramesLater} from './__test_support';

const findsFeedbackWithoutScrolling = async (page: Page, path: string): Promise<void> => {
  await github(page);
  const feedback = feedbackOn(page);
  await page.goto(path);

  await expect(feedback.open).toBeInViewport();
  const toggles = await feedback.pressed();

  await expect.poll(toggles, 'the dialog\'s toggles since the press').toEqual(['open']);
  await expect(feedback.dialog).toBeVisible();
  await expect(feedback.words).toBeFocused();
};

for (const {reader, device} of [{reader: 'a desktop', device: desktop}, {reader: 'a phone held upright', device: iPhone}] as const) {
  test.describe(reader, () => {
    test.use(device);

    test('finds Feedback on the home page without scrolling and opens it onto the field', ({page}) => findsFeedbackWithoutScrolling(page, ''));

    test('finds Feedback on the accordions tab without scrolling and opens it onto the field', ({page}) =>
      findsFeedbackWithoutScrolling(page, 'demos/accordions/'));

    test('finds Feedback on the tables tab without scrolling and opens it onto the field', ({page}) => findsFeedbackWithoutScrolling(page, 'demos/tables/'));
  });
}

const closesFeedbackGivingFocusBack = async (page: Page, closing: () => Promise<void>): Promise<void> => {
  await github(page);
  const feedback = feedbackOn(page);
  await page.goto('demos/accordions/');
  await feedback.open.click();
  await expect(feedback.words).toBeFocused();

  await closing();

  await expect(feedback.dialog).toBeHidden();
  await expect(feedback.open).toBeFocused();
};

test('Escape closes Feedback and gives focus back to it', ({page}) => closesFeedbackGivingFocusBack(page, () => page.keyboard.press('Escape')));

test('Cancel closes Feedback and gives focus back to it', ({page}) => closesFeedbackGivingFocusBack(page, () => feedbackOn(page).cancel.click()));

test('a click on the veil closes Feedback and gives focus back to it', ({page}) => closesFeedbackGivingFocusBack(page, () => page.mouse.click(5, 5)));

test('Back closes Feedback and gives focus back to it', async ({page}) => {
  await github(page);
  const feedback = feedbackOn(page);
  const site = siteFrame(page);
  await page.goto('demos/accordions/');
  await site.hydrated();
  await site.home.click();
  await expect(page).toHaveURL(/\/ChosenPicachu\/$/);
  await feedback.open.click();
  await expect(feedback.words).toBeFocused();

  await page.goBack();

  await expect(page).toHaveURL(/demos\/accordions\/$/);
  await expect(feedback.dialog).toBeHidden();
  await expect(feedback.open).toBeFocused();
});

test('a click inside the dialog’s edge keeps Feedback open', async ({page}) => {
  await github(page);
  const feedback = feedbackOn(page);
  await page.goto('demos/accordions/');
  await feedback.open.click();
  const edge = await feedback.dialog.boundingBox();
  expect(edge).not.toBeNull();

  await page.mouse.click((edge?.x ?? 0) + 2, (edge?.y ?? 0) + (edge?.height ?? 0) / 2);

  await expect(feedback.dialog).toBeVisible();
});

test('Tab never lands on the page behind the open dialog', async ({page}) => {
  await github(page);
  const feedback = feedbackOn(page);
  await page.goto('demos/accordions/');
  await feedback.open.click();

  await expect(feedback.words).toBeFocused();

  for (let step = 0; step < 8; step += 1) {
    await pressTab(page);
    expect(await feedback.dialog.evaluate(dialog =>
      dialog.contains(document.activeElement) || document.activeElement === document.body)).toBe(true);
  }
});

test('an empty note is refused by the platform', async ({page}) => {
  const posted = await github(page);
  const feedback = feedbackOn(page);
  await page.goto('demos/accordions/');
  await feedback.open.click();
  await expect(feedback.words).toBeFocused();

  await page.keyboard.press('Enter');

  await expect(feedback.dialog).toBeVisible();
  expect(await feedback.words.evaluate(field => field.matches(':invalid'))).toBe(true);
  expect(posted).toHaveLength(0);
});

const enterSendsOntoSent = async (page: Page, field: 'words' | 'reach'): Promise<void> => {
  const posted = await github(page);
  const feedback = feedbackOn(page);
  await page.goto('demos/tables/');
  await expect(siteFrame(page).title).toHaveText('Demos Tables');
  await feedback.open.click();
  await feedback.words.pressSequentially('The sort menu hides behind the header.');
  await feedback.reach.pressSequentially('reader@example.test');

  await feedback[field].press('Enter');

  await expect(feedback.status).toContainText('Sent.');
  await expect(feedback.status.getByRole('link', {name: 'Read it on GitHub'})).toHaveAttribute('href', 'https://github.com/RyanDur/ChosenPicachu/discussions/9');
  expect(posted[0].variables.title).toBe('Feedback: Demos Tables (/demos/tables/)');
  expect(posted[0].variables.body).toContain('The sort menu hides behind the header.');
};

test('Enter in the note field sends, and the dialog says where the note is on GitHub', ({page}) => enterSendsOntoSent(page, 'words'));

test('Enter in the reach field sends, and the dialog says where the note is on GitHub', ({page}) => enterSendsOntoSent(page, 'reach'));

test('on a desk, the rail keeps the sent note’s link once Close shuts the dialog', async ({page}) => {
  await github(page);
  const feedback = feedbackOn(page);
  await page.goto('demos/tables/');
  await feedback.open.click();
  await feedback.words.pressSequentially('The sort menu hides behind the header.');
  await feedback.send.click();
  await expect(feedback.status).toContainText('Sent.');

  await feedback.close.click();

  await expect(feedback.dialog).toBeHidden();
  await expect(feedback.sent.getByRole('link', {name: 'Read it on GitHub'})).toHaveAttribute('href', 'https://github.com/RyanDur/ChosenPicachu/discussions/9');
});

const sentAndClosed = async (page: Page): Promise<void> => {
  await github(page);
  const feedback = feedbackOn(page);
  await page.goto('demos/tables/');
  await siteFrame(page).hydrated();
  await feedback.open.click();
  await feedback.words.pressSequentially('The sort menu hides behind the header.');
  await feedback.send.click();
  await expect(feedback.status.getByRole('link', {name: 'Read it on GitHub'})).toHaveAttribute('href', 'https://github.com/RyanDur/ChosenPicachu/discussions/9');
  await feedback.close.click();
  await expect(feedback.dialog).toBeHidden();
  await twoFramesLater(page);
};

test.describe('a phone on a page with tabs', () => {
  test.use(iPhone);

  test('reaches Feedback once the sent note’s dialog closes', async ({page}) => {
    await sentAndClosed(page);

    await clickWhereItIs(page, feedbackOn(page).open);

    await expect(feedbackOn(page).dialog).toBeVisible();
  });

  test('reaches a tab once the sent note’s dialog closes', async ({page}) => {
    await sentAndClosed(page);

    await clickWhereItIs(page, page.getByRole('navigation', {name: 'demos'}).getByRole('link', {name: 'Accordions'}));

    await expect(page).toHaveURL(/demos\/accordions\/$/);
  });

  test('reaches the site menu once the sent note’s dialog closes', async ({page}) => {
    await sentAndClosed(page);

    await clickWhereItIs(page, siteFrame(page).menu);

    await expect(siteFrame(page).nav).toBeVisible();
  });
});

const githubHoldingItsAnswer = async (page: Page): Promise<() => Promise<void>> => {
  let release = (): void => undefined;
  await github(page, {answersOnce: new Promise<void>(answered => {
    release = answered;
  })});
  return async () => {
    const answered = page.waitForResponse(response => response.url().endsWith('/feedback-graphql') && response.request().method() === 'POST');
    release();
    await answered;
  };
};

test.describe('a phone', () => {
  test.use(iPhone);

  test('reads where a note sent after Feedback closed is on GitHub once Feedback opens again', async ({page}) => {
    const answer = await githubHoldingItsAnswer(page);
    const feedback = feedbackOn(page);
    await page.goto('demos/tables/');
    await siteFrame(page).hydrated();
    await feedback.open.click();
    await feedback.words.pressSequentially('The sort menu hides behind the header.');
    await feedback.send.click();
    await expect(feedback.status).toHaveText('Sending the note to GitHub.');
    await feedback.cancel.click();
    await expect(feedback.dialog).toBeHidden();
    await answer();

    await feedback.open.click();

    await expect(feedback.status.getByRole('link', {name: 'Read it on GitHub'})).toHaveAttribute('href', 'https://github.com/RyanDur/ChosenPicachu/discussions/9');
  });

  test('reads where a note sent before Back is on GitHub once Feedback opens again', async ({page}) => {
    const answer = await githubHoldingItsAnswer(page);
    const feedback = feedbackOn(page);
    await page.goto('demos/accordions/');
    await siteFrame(page).hydrated();
    await page.getByRole('navigation', {name: 'demos'}).getByRole('link', {name: 'Tables'}).click();
    await expect(page).toHaveURL(/\/demos\/tables\/$/);
    await feedback.open.click();
    await feedback.words.pressSequentially('The sort menu hides behind the header.');
    await feedback.send.click();
    await expect(feedback.status).toHaveText('Sending the note to GitHub.');
    await page.goBack();
    await expect(page).toHaveURL(/\/demos\/accordions\/$/);
    await expect(feedback.dialog).toBeHidden();
    await answer();

    await feedback.open.click();

    await expect(feedback.status.getByRole('link', {name: 'Read it on GitHub'})).toHaveAttribute('href', 'https://github.com/RyanDur/ChosenPicachu/discussions/9');
  });
});

test('words added while a note is sending stay once GitHub has it', async ({page}) => {
  const answer = await githubHoldingItsAnswer(page);
  const feedback = feedbackOn(page);
  await page.goto('demos/tables/');
  await siteFrame(page).hydrated();
  await feedback.open.click();
  await feedback.words.pressSequentially('The sort menu hides.');
  await feedback.send.click();
  await expect(feedback.status).toHaveText('Sending the note to GitHub.');
  await feedback.words.pressSequentially(' It also flickers.');

  await answer();

  await expect(feedback.status.getByRole('link', {name: 'Read it on GitHub'})).toBeVisible();
  await expect(feedback.words).toHaveValue('The sort menu hides. It also flickers.');
});

test('a way to reach added while a note is sending stays, and the sent words leave the field, once GitHub has it', async ({page}) => {
  const answer = await githubHoldingItsAnswer(page);
  const feedback = feedbackOn(page);
  await page.goto('demos/tables/');
  await siteFrame(page).hydrated();
  await feedback.open.click();
  await feedback.words.pressSequentially('The sort menu hides.');
  await feedback.send.click();
  await expect(feedback.status).toHaveText('Sending the note to GitHub.');
  await feedback.reach.pressSequentially('reader@example.test');

  await answer();

  await expect(feedback.status.getByRole('link', {name: 'Read it on GitHub'})).toBeVisible();
  await expect(feedback.words).toHaveValue('');
  await expect(feedback.reach).toHaveValue('reader@example.test');
});

test('a note GitHub refuses stays in the open dialog, and it says so', async ({page}) => {
  await github(page, {refuse: 'Bad credentials'});
  const feedback = feedbackOn(page);
  await page.goto('demos/accordions/');
  await feedback.open.click();
  await feedback.words.pressSequentially('A step does not build.');

  await feedback.send.click();

  await expect(feedback.dialog.getByRole('status')).toHaveText('GitHub turned the request away. Your words are still here.');
  await expect(feedback.dialog).toBeVisible();
  await expect(feedback.words).toHaveValue('A step does not build.');
});

test('a second note GitHub refuses leaves no link to the first, and Cancel still reads Cancel', async ({page}) => {
  await github(page);
  const feedback = feedbackOn(page);
  await page.goto('demos/tables/');
  await feedback.open.click();
  await feedback.words.pressSequentially('The sort menu hides behind the header.');
  await feedback.send.click();
  await expect(feedback.status).toContainText('Sent.');
  await github(page, {refuse: 'Bad credentials'});
  await feedback.words.pressSequentially('It also flickers.');

  await feedback.send.click();

  await expect(feedback.status).toHaveText('GitHub turned the request away. Your words are still here.');
  await expect(feedback.cancel).toBeVisible();
  await expect(page.getByRole('link', {name: 'Read it on GitHub', includeHidden: true})).toHaveCount(0);
});

test('the first line links to the page’s own thread', async ({page}) => {
  const feedback = feedbackOn(page);
  await page.goto('demos/accordions/');

  await feedback.open.click();

  await expect(feedback.thread).toHaveAttribute('href', 'https://github.com/RyanDur/ChosenPicachu/discussions/4');
});

test('a page with no thread yet links its first line to the Discussions page', async ({page}) => {
  const feedback = feedbackOn(page);
  await page.goto('record/');
  const searched = page.waitForResponse('**/feedback-graphql');

  await feedback.open.click();

  await searched;
  await expect(feedback.thread).toHaveAttribute('href', 'https://github.com/RyanDur/ChosenPicachu/discussions');
});

for (const {reader, device} of [
  {reader: 'a phone held upright', device: iPhone},
  {reader: 'a phone held sideways', device: phoneSideways},
  {reader: 'an iPad held upright', device: iPadUpright},
  {reader: 'a desktop', device: desktop}
] as const) {
  test.describe(reader, () => {
    test.use(device);

    test('opens Feedback onto its field, with Send shown', async ({page}) => {
      await github(page);
      const feedback = feedbackOn(page);
      await page.goto('demos/accordions/');
      const toggles = await feedback.pressed();
      await expect.poll(toggles, 'the dialog\'s toggles since the press').toEqual(['open']);
      await expect(feedback.words).toBeFocused();

      await expect(feedback.send).toBeVisible();
    });
  });
}
