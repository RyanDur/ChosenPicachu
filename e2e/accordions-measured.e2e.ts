import {expect} from '@playwright/test';
import {
  accordionsTab,
  desktop,
  heightOnceSettled,
  measuredBuilds,
  showing,
  textOf,
  type Part
} from './__test_support';
import {everyBuildJourneys, layoutRounding, test} from './__test_support/fold-journeys';

// WebKit stopped starting page.goto after about 90 navigations of these journeys mixed with the tab's others in one worker; a worker of their own keeps them apart
test.use({workerOfItsOwn: 'the measured folds'});

everyBuildJourneys(measuredBuilds);
const gapUnderItsText = async (part: Part): Promise<number> => {
  const [fold, text] = await Promise.all([part.fold.boundingBox(), textOf(part).boundingBox()]);
  return Math.abs((fold?.y ?? 0) + (fold?.height ?? 0) - (text?.y ?? Infinity) - (text?.height ?? 0));
};

const tallestOf = async (parts: Part[]): Promise<Part> => {
  const heights = await Promise.all(parts.map(part => textOf(part).evaluate(text => text.getBoundingClientRect().height)));
  return parts[heights.indexOf(Math.max(...heights))];
};

test.describe('a desktop', () => {
  test.use(desktop);

  for (const build of measuredBuilds) {
    test(`an open part of ${build} still ends at its text after the window narrows and widens`, async ({page}) => {
      await page.goto(showing(build));
      await expect(accordionsTab(page).firstPartOf(build).fold).toBeVisible();
      const part = await tallestOf(await accordionsTab(page).partsOf(build));
      await part.open();
      await heightOnceSettled(part.fold);

      for (const width of [390, 1440]) {
        await page.setViewportSize({width, height: 900});
        await expect.poll(() => gapUnderItsText(part)).toBeLessThanOrEqual(layoutRounding);
      }
    });
  }
});

for (const build of measuredBuilds) {
  test(`a reader opens and then closes a part of ${build}, and its text goes`, async ({page}) => {
    await page.goto(showing(build));
    const part = accordionsTab(page).firstPartOf(build);
    await expect(part.fold).toBeVisible();

    await part.open();
    await expect.poll(part.showsText).toBe(true);
    await part.close();

    await expect.poll(part.showsText).toBe(false);
  });
}

const pressesNeverReachTheScript = (): void => ['click', 'change'].forEach(press =>
  window.addEventListener(press, event => event.stopImmediatePropagation(), true));

for (const build of measuredBuilds) {
  test(`with its script never hearing the press, a part of ${build} still opens and closes`, async ({page}) => {
    await page.addInitScript(pressesNeverReachTheScript);
    await page.goto(showing(build));
    const part = accordionsTab(page).firstPartOf(build);
    await expect(part.fold).toBeVisible();

    await part.open();

    await expect.poll(part.showsText).toBe(true);
    await part.close();
    await expect.poll(part.showsText).toBe(false);
  });
}

for (const build of measuredBuilds) {
  test.describe('a desktop', () => {
    test.use(desktop);

    test(`an opening part of ${build} switched to Static mid-motion still ends at its text after the window narrows`, async ({page}) => {
      await page.emulateMedia({reducedMotion: 'no-preference'});
      await page.goto(showing(build));
      const part = accordionsTab(page).firstPartOf(build);
      await expect(part.fold).toBeVisible();

      await accordionsTab(page).opensTheFirstPartThenChoosesOnceItStartsMoving(build, 'Static');
      await page.setViewportSize({width: 390, height: 900});

      await expect.poll(() => gapUnderItsText(part)).toBeLessThanOrEqual(layoutRounding);
    });

    test(`an open part of ${build} closed and opened again in one frame still ends at its text after the window narrows`, async ({page}) => {
      await page.goto(showing(build));
      const part = accordionsTab(page).firstPartOf(build);
      await part.open();
      await heightOnceSettled(part.fold);

      await accordionsTab(page).closesThenOpensTheFirstPartInOneFrame(build);
      await heightOnceSettled(part.fold);
      await page.setViewportSize({width: 390, height: 900});

      await expect.poll(() => gapUnderItsText(part)).toBeLessThanOrEqual(layoutRounding);
    });
  });
}
