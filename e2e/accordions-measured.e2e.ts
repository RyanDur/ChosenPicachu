import {expect, type Page} from '@playwright/test';
import {accordions, type Build, heightOnceSettled, type Part, siteFrame} from './__test_support';
import {everyBuildJourneys, layoutRounding, test} from './__test_support/fold-journeys';
import {assertionPatience} from './__test_support/patience';

// WebKit stopped starting page.goto after about 90 navigations of these journeys mixed with the tab's others in one
// worker; a worker of their own keeps them apart
test.use({workerOfItsOwn: 'the measured folds'});

everyBuildJourneys(accordions.measuredBuilds);
const textBelowItsFold = (part: Part): Promise<number> => accordions.textBelow(part.fold, part.words);

const settlesWithinRounding = async (measure: () => Promise<number>): Promise<void> =>
  expect(async () => expect(await measure()).toBeLessThanOrEqual(layoutRounding)).toPass({timeout: assertionPatience});

const tallestOf = async (parts: Part[]): Promise<Part> => {
  const heights = await Promise.all(parts.map(part =>
    part.words.evaluate(text => text.getBoundingClientRect().height)));
  return parts[heights.indexOf(Math.max(...heights))];
};

for (const build of accordions.measuredBuilds) {
  test(`an open part of ${build} still shows all its text after the window narrows`, {tag: '@desktop'}, async ({page}) => {
    await accordions.tab(page).goTo(build);
    await expect(accordions.tab(page).firstPartOf(build).fold).toBeVisible();
    const part = await tallestOf(await accordions.tab(page).partsOf(build));
    await part.open();
    await heightOnceSettled(part.fold);

    await page.setViewportSize({width: 390, height: 900});

    await settlesWithinRounding(() => textBelowItsFold(part));
  });
}

const opensAndClosesTheFirstPartOf = async (page: Page, build: Build): Promise<void> => {
  await accordions.tab(page).goTo(build);
  const part = accordions.tab(page).firstPartOf(build);
  await expect(part.fold).toBeVisible();

  await part.open();
  await expect.poll(part.showsText).toBe(true);
  await part.close();

  await expect.poll(part.showsText).toBe(false);
};

for (const build of accordions.measuredBuilds) {
  test(`a reader who allows motion opens and then closes a part of ${build}, and its text goes`, async ({page}) => {
    await page.emulateMedia({reducedMotion: 'no-preference'});
    await opensAndClosesTheFirstPartOf(page, build);
  });
}

const pressesNeverReachTheScript = (): void => ['click', 'change'].forEach(press =>
  window.addEventListener(press, event => event.stopImmediatePropagation(), true));

for (const build of accordions.measuredBuilds) {
  test(`with its script never hearing the press, a part of ${build} still opens and closes`, async ({page}) => {
    await page.addInitScript(pressesNeverReachTheScript);
    await opensAndClosesTheFirstPartOf(page, build);
  });
}

for (const build of accordions.measuredBuilds) {
  test(`an opening part of ${build} switched to Static mid-motion still shows all its text after the window narrows`, {tag: '@desktop'}, async ({page}) => {
    await page.emulateMedia({reducedMotion: 'no-preference'});
    await accordions.tab(page).goTo(build);
    const part = accordions.tab(page).firstPartOf(build);
    await expect(part.fold).toBeVisible();

    await accordions.tab(page).opensTheFirstPartThenChoosesOnceItStartsMoving(build, 'Static');
    await page.setViewportSize({width: 390, height: 900});

    await settlesWithinRounding(() => textBelowItsFold(part));
  });

  test(`an open part of ${build} closed and opened again in one frame still shows all its text after the window narrows`, {tag: '@desktop'}, async ({page}) => {
    await page.emulateMedia({reducedMotion: 'no-preference'});
    await accordions.tab(page).goTo(build);
    const part = accordions.tab(page).firstPartOf(build);
    await part.open();
    await heightOnceSettled(part.fold);

    await accordions.tab(page).closesThenOpensTheFirstPartInOneFrame(build);
    await heightOnceSettled(part.fold);
    await page.setViewportSize({width: 390, height: 900});

    await settlesWithinRounding(() => textBelowItsFold(part));
  });
}

test.describe('the fold measured by plain script', () => {
  test('opens on a press to show all its text, and shuts on a second press', async ({page}) => {
    await page.emulateMedia({reducedMotion: 'no-preference'});
    const fold = accordions.plainFold(page);
    await fold.goTo();

    await fold.bar.click();

    await expect(fold.text).toBeVisible();
    await settlesWithinRounding(fold.textBelowItsPanel);
    await fold.bar.click();
    await expect(fold.text).toBeHidden();
  });

  test('still shows all its text after the window narrows', {tag: '@desktop'}, async ({page}) => {
    await page.emulateMedia({reducedMotion: 'no-preference'});
    const fold = accordions.plainFold(page);
    await fold.goTo();
    await fold.bar.click();
    await settlesWithinRounding(fold.textBelowItsPanel);

    await page.setViewportSize({width: 390, height: 900});

    await settlesWithinRounding(fold.textBelowItsPanel);
  });

  test('with its script never hearing the press, still opens and shuts', async ({page}) => {
    await page.emulateMedia({reducedMotion: 'no-preference'});
    await page.addInitScript(pressesNeverReachTheScript);
    const fold = accordions.plainFold(page);
    await fold.goTo();

    await fold.bar.click();
    await expect(fold.text).toBeVisible();
    await fold.bar.click();
    await expect(fold.text).toBeHidden();
  });

  test('reached by its link on the accordions tab, with its document assembled after the frame first loads, grows to its opened text', async ({page}) => {
    const assembly = Promise.withResolvers<void>();
    await page.route(/\/assemble-[^/]*\.js$/, async route => {
      await assembly.promise;
      await route.continue();
    });
    const fold = accordions.plainFold(page);
    await fold.countsFrameLoads();
    await page.goto('demos/accordions/');
    await siteFrame(page).hydrated();
    await accordions.tab(page).partLink('The measured height').click();
    await expect.poll(fold.frameLoaded).toBe(true);
    assembly.resolve();

    await fold.bar.click();

    await settlesWithinRounding(fold.textBelowTheFrame);
  });
});

test('the measured height’s page says the plain fold could not be assembled when its script never arrives', async ({page}) => {
  await page.route('**/assets/assemble-*.js', route => route.abort());

  await page.goto(accordions.measuredHeightPage);

  await expect(page.getByRole('alert')).toContainText('the plain fold could not be assembled');
});
