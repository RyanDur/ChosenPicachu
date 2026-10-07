import {expect, test} from '@playwright/test';
import {desktop, feedbackOn, github, iPadUpright, iPhone, phoneSideways, pressTab, scriptedMarket, siteFrame} from './__test_support';

for (const {reader, device} of [{reader: 'a desktop', device: desktop}, {reader: 'a phone held upright', device: iPhone}] as const) {
  test.describe(reader, () => {
    test.use(device);

    for (const {name, path} of [{name: 'the home page', path: ''}, {name: 'the accordions tab', path: 'demos/?tab=accordions'}, {name: 'the tables tab', path: 'demos/?tab=tables'}]) {
      test(`finds Feedback on ${name} without scrolling and opens it onto the field`, async ({page}) => {
        await github(page);
        const feedback = feedbackOn(page);
        await page.goto(path);

        await expect(feedback.open).toBeInViewport();
        const toggles = await feedback.pressed();

        await expect.poll(toggles, 'the dialog\'s toggles since the press').toEqual(['open']);
        await expect(feedback.dialog).toBeVisible();
        await expect(feedback.words).toBeFocused();
      });
    }
  });
}

for (const {name, path, title} of [
  {name: 'the tables tab', path: 'demos/?tab=tables', title: 'Demos Tables'},
  {name: 'a chart tutorial', path: 'demos/charts/price/', title: 'Demos Charts'}
]) {
  test.describe('a phone held upright', () => {
    test.use(iPhone);

    test(`aims at Feedback while ${name} is still arriving, and the press opens it onto the field`, async ({page}) => {
      await github(page);
      await scriptedMarket(page, []);
      const feedback = feedbackOn(page);
      const arriving = Promise.withResolvers<void>();
      await page.route('**/assets/Demos-*.js', async route => {
        await arriving.promise;
        await route.continue();
      });
      await page.goto(path, {waitUntil: 'commit'});
      const aim = await feedback.open.boundingBox();
      if (aim === null) throw new Error('no Feedback to aim at');

      arriving.resolve();
      await expect(page.getByRole('heading', {level: 1, name: title})).toBeVisible();
      await page.mouse.click(aim.x + aim.width / 2, aim.y + aim.height / 2);

      await expect(feedback.dialog).toBeVisible();
      await expect(feedback.words).toBeFocused();
    });
  });
}

for (const {way, closing} of [
  {way: 'Escape', closing: async (page: import('@playwright/test').Page) => page.keyboard.press('Escape')},
  {way: 'Cancel', closing: async (page: import('@playwright/test').Page) => feedbackOn(page).cancel.click()},
  {way: 'a click on the veil', closing: async (page: import('@playwright/test').Page) => page.mouse.click(5, 5)}
]) {
  test(`${way} closes Feedback and gives focus back to it`, async ({page}) => {
    await github(page);
    const feedback = feedbackOn(page);
    await page.goto('demos/?tab=accordions');
    await feedback.open.click();
    await expect(feedback.words).toBeFocused();

    await closing(page);

    await expect(feedback.dialog).toBeHidden();
    await expect(feedback.open).toBeFocused();
  });
}

test('a click inside the dialog’s edge keeps Feedback open', async ({page}) => {
  await github(page);
  const feedback = feedbackOn(page);
  await page.goto('demos/?tab=accordions');
  await feedback.open.click();
  const edge = await feedback.dialog.boundingBox();
  expect(edge).not.toBeNull();

  await page.mouse.click((edge?.x ?? 0) + 2, (edge?.y ?? 0) + (edge?.height ?? 0) / 2);

  await expect(feedback.dialog).toBeVisible();
});

test('Tab never lands on the page behind the open dialog', async ({page}) => {
  await github(page);
  const feedback = feedbackOn(page);
  await page.goto('demos/?tab=accordions');
  await feedback.open.click();

  await expect(feedback.words).toBeFocused();

  for (let step = 0; step < 8; step += 1) {
    await pressTab(page);
    expect(await feedback.dialog.evaluate(dialog => dialog.contains(document.activeElement) || document.activeElement === document.body)).toBe(true);
  }
});

test('an empty note is refused by the platform', async ({page}) => {
  const posted = await github(page);
  const feedback = feedbackOn(page);
  await page.goto('demos/?tab=accordions');
  await feedback.open.click();
  await expect(feedback.words).toBeFocused();

  await page.keyboard.press('Enter');

  await expect(feedback.dialog).toBeVisible();
  expect(await feedback.words.evaluate(field => field.matches(':invalid'))).toBe(true);
  expect(posted).toHaveLength(0);
});

for (const field of ['words', 'reach'] as const) {
  test(`Enter in the ${field === 'words' ? 'note' : 'reach'} field sends, and the dialog closes onto Sent`, async ({page}) => {
    const posted = await github(page);
    const feedback = feedbackOn(page);
    await page.goto('demos/?tab=tables');
    await expect(siteFrame(page).title).toHaveText('Demos Tables');
    await feedback.open.click();
    await feedback.words.pressSequentially('The sort menu hides behind the header.');
    await feedback.reach.pressSequentially('reader@example.test');

    await feedback[field].press('Enter');

    await expect(feedback.dialog).toBeHidden();
    await expect(feedback.sent).toContainText('Sent.');
    await expect(feedback.sent.getByRole('link', {name: 'Read it on GitHub'})).toHaveAttribute('href', 'https://github.com/RyanDur/ChosenPicachu/discussions/9');
    expect(posted[0].variables.title).toBe('Feedback: Demos Tables (/demos/?tab=tables)');
    expect(posted[0].variables.body).toContain('The sort menu hides behind the header.');
  });
}

test('a note GitHub refuses stays in the open dialog, and it says so', async ({page}) => {
  await github(page, {refuse: 'Bad credentials'});
  const feedback = feedbackOn(page);
  await page.goto('demos/?tab=accordions');
  await feedback.open.click();
  await feedback.words.pressSequentially('A step does not build.');

  await feedback.send.click();

  await expect(feedback.dialog.getByRole('status')).toHaveText('GitHub turned the request away. Your words are still here.');
  await expect(feedback.dialog).toBeVisible();
  await expect(feedback.words).toHaveValue('A step does not build.');
});

test('the first line links to the page’s own thread', async ({page}) => {
  await github(page, {thread: {url: 'https://github.com/RyanDur/ChosenPicachu/discussions/4', title: 'Feedback: Demos Accordions (/demos/?tab=accordions)'}});
  const feedback = feedbackOn(page);
  await page.goto('demos/?tab=accordions');

  await feedback.open.click();

  await expect(feedback.thread).toHaveAttribute('href', 'https://github.com/RyanDur/ChosenPicachu/discussions/4');
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
      await page.goto('demos/?tab=accordions');
      const toggles = await feedback.pressed();
      await expect.poll(toggles, 'the dialog\'s toggles since the press').toEqual(['open']);
      await expect(feedback.words).toBeFocused();

      await expect(feedback.send).toBeVisible();
    });
  });
}

test.describe('a reader with script off', () => {
  test.use({javaScriptEnabled: false});

  test('finds no Feedback button, and a line that links to Discussions instead', async ({page}) => {
    await page.goto('');

    await expect(page.getByRole('button', {name: 'Feedback'})).toHaveCount(0);
    await expect(page.getByRole('link', {name: 'Discussions page on GitHub'})).toHaveAttribute('href', 'https://github.com/RyanDur/ChosenPicachu/discussions');
  });
});
