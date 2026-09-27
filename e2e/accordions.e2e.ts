import {expect, test} from '@playwright/test';
import {accordionsTab, builds, codedStepLayouts, desktop, firstHeightAfter, framesWhileMoving, heightByTheNextFrame, heightOnceSettled, iPhone, misplacedPictures, textOf} from './__test_support';

test('a details fold slides open where the browser can animate it', async ({page, browserName}) => {
  test.skip(browserName !== 'chromium', 'only chromium animates a details element to its natural height');
  await page.goto('demos/?tab=accordions');
  const part = accordionsTab(page).firstPartOf('the details build');

  await part.open();
  const midway = await heightByTheNextFrame(part.fold);

  expect(midway).toBeLessThan(await heightOnceSettled(part.fold));
});

test('a fold in the React checkbox build slides open', async ({page}) => {
  await page.goto('demos/?tab=accordions');
  const part = accordionsTab(page).firstPartOf('the React checkbox build');
  await expect(part.fold).toBeVisible();
  const closed = await heightByTheNextFrame(part.fold);
  const firstMoved = firstHeightAfter(part.fold, closed);

  await part.open();

  expect(await firstMoved).toBeGreaterThan(closed);
  expect(await firstMoved).toBeLessThan(await heightOnceSettled(part.fold));
});

const roundingBetweenLayoutAndTransform = 3;

for (const build of ['the React checkbox build', 'the React radio build'] as const) {
  test(`a fold in ${build} slides open with its text shown down to the fold’s edge`, async ({page}) => {
    await page.goto('demos/?tab=accordions');
    const part = accordionsTab(page).firstPartOf(build);
    await expect(part.fold).toBeVisible();
    const moving = framesWhileMoving(part.fold);

    await part.open();
    const frames = await moving;

    expect(frames[0].height).toBeLessThan(frames.at(-1)?.height ?? 0);
    expect(frames.map(frame => frame.textBottomGap).filter(gap => gap > roundingBetweenLayoutAndTransform)).toEqual([]);
  });

  test(`a fold in ${build} slides closed with its text shown down to the fold’s edge`, async ({page}) => {
    await page.goto('demos/?tab=accordions');
    const part = accordionsTab(page).firstPartOf(build);
    await part.open();
    await heightOnceSettled(part.fold);
    const moving = framesWhileMoving(part.fold);

    await part.close();
    const frames = await moving;

    expect(frames[0].height).toBeGreaterThan(frames.at(-1)?.height ?? 0);
    expect(frames.map(frame => frame.textBottomGap).filter(gap => gap > roundingBetweenLayoutAndTransform)).toEqual([]);
  });
}

test('a details fold opens at once, fully, where the browser cannot animate it', async ({page, browserName}) => {
  test.skip(browserName === 'chromium', 'chromium animates it');
  await page.goto('demos/?tab=accordions');
  const part = accordionsTab(page).firstPartOf('the details build');

  await part.open();
  const midway = await heightByTheNextFrame(part.fold);

  expect(midway).toBe(await heightOnceSettled(part.fold));
  await expect.poll(part.showsText).toBe(true);
});

test('opening a second details fold closes the first, from the keyboard too', async ({page}) => {
  await page.goto('demos/?tab=accordions');
  const [first, second] = [accordionsTab(page).partOf('the details build', 0), accordionsTab(page).partOf('the details build', 1)];
  await first.open();
  await expect.poll(first.showsText).toBe(true);

  await second.openByKeyboard();

  await expect.poll(second.showsText).toBe(true);
  await expect.poll(first.showsText).toBe(false);
});

for (const {reader, device, layout} of [
  {reader: 'a phone held upright', device: iPhone, layout: 'code below prose'},
  {reader: 'a desktop', device: desktop, layout: 'code beside prose'}
] as const) {
  test.describe(reader, () => {
    test.use(device);

    test(`reads the accordions explanation with the ${layout} on every step`, async ({page}) => {
      await page.goto('demos/?tab=accordions');
      await expect(page.getByRole('code').first()).toBeVisible();

      await expect.poll(async () => [...new Set(await codedStepLayouts(page))]).toEqual([layout]);
    });
  });
}

for (const build of builds) {
  test(`a reader who asks for less motion gets ${build} open at once`, async ({page, browserName}) => {
    test.skip(build === 'the details build' && browserName !== 'chromium', 'only chromium animates a details element to its natural height');
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.goto('demos/?tab=accordions');
    const part = accordionsTab(page).firstPartOf(build);
    await expect(part.fold).toBeVisible();
    const closed = await heightByTheNextFrame(part.fold);

    const firstMoved = firstHeightAfter(part.fold, closed);
    await part.open();
    await expect.poll(part.isOpen).toBe(true);

    expect(await firstMoved).toBeGreaterThan(closed);
    expect(await firstMoved).toBe(await heightOnceSettled(part.fold));
  });
}

for (const build of ['the React checkbox build', 'the React radio build'] as const) {
  test(`a closed fold in ${build} shows only its bar`, async ({page}) => {
    await page.goto('demos/?tab=accordions');
    await expect(accordionsTab(page).firstPartOf(build).fold).toBeVisible();
    const parts = await accordionsTab(page).partsOf(build);

    for (const part of parts) {
      await expect(textOf(part)).toBeAttached();
      await expect.poll(part.showsText).toBe(false);
    }
  });
  test(`an open fold in ${build} shows its text`, async ({page}) => {
    await page.goto('demos/?tab=accordions');
    const part = accordionsTab(page).firstPartOf(build);

    await part.open();

    await expect.poll(part.isOpen).toBe(true);
    await expect.poll(part.showsText).toBe(true);
  });
}

test.describe('a desktop', () => {
  test.use(desktop);

  test('sees each diagram under its prose and beside its code', async ({page}) => {
    await page.goto('demos/?tab=accordions');
    await expect(page.getByRole('figure').first()).toBeVisible();

    await expect.poll(() => misplacedPictures(page)).toEqual([]);
  });
});

for (const build of builds.filter(build => build !== 'the details build')) {
  test(`a keyboard reader opens the first fold of ${build} and reads its text`, async ({page}) => {
    await page.goto('demos/?tab=accordions');
    const part = accordionsTab(page).firstPartOf(build);
    await expect(part.fold).toBeVisible();

    await part.openByKeyboard();

    await expect.poll(part.isOpen).toBe(true);
    await expect.poll(part.showsText).toBe(true);
  });
}

for (const build of ['the radio build', 'the React radio build'] as const) {
  test(`a keyboard reader moves through ${build} from its first fold to its second`, async ({page}) => {
    await page.goto('demos/?tab=accordions');
    const [first, second] = [accordionsTab(page).partOf(build, 0), accordionsTab(page).partOf(build, 1)];
    await expect(second.fold).toBeVisible();
    await first.openByKeyboard();
    await expect.poll(first.showsText).toBe(true);

    await second.openByKeyboard();

    await expect.poll(second.showsText).toBe(true);
    await expect.poll(first.showsText).toBe(false);
  });
}
