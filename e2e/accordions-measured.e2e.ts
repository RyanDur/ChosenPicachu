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
import {everyBuildJourneys, test} from './__test_support/fold-journeys';

// WebKit stopped starting page.goto after about 90 navigations of these journeys mixed with the tab's others in one worker; a worker of their own keeps them apart
test.use({workerOfItsOwn: 'the measured folds'});

everyBuildJourneys(measuredBuilds);
const textStillShown = async (part: Part): Promise<void> => {
  await expect.poll(part.isOpen).toBe(true);
  await expect.poll(part.showsText).toBe(true);
};

const longestOf = async (parts: Part[]): Promise<Part> => {
  const lengths = await Promise.all(parts.map(async part => (await textOf(part).textContent())?.length ?? 0));
  return parts[lengths.indexOf(Math.max(...lengths))];
};

test.describe('a desktop', () => {
  test.use(desktop);

  for (const build of measuredBuilds) {
    test(`an open part of ${build} still shows its text after the window narrows`, async ({page}) => {
      await page.goto(showing(build));
      await expect(accordionsTab(page).firstPartOf(build).fold).toBeVisible();
      const part = await longestOf(await accordionsTab(page).partsOf(build));
      await part.open();
      await heightOnceSettled(part.fold);

      await page.setViewportSize({width: 390, height: 900});

      await textStillShown(part);
    });
  }
});

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

    test(`an opening part of ${build} switched to Static mid-motion still shows its text after the window narrows`, async ({page}) => {
      await page.emulateMedia({reducedMotion: 'no-preference'});
      await page.goto(showing(build));
      const part = accordionsTab(page).firstPartOf(build);
      await expect(part.fold).toBeVisible();

      await accordionsTab(page).opensTheFirstPartThenChoosesOnceItStartsMoving(build, 'Static');
      await page.setViewportSize({width: 390, height: 900});

      await textStillShown(part);
    });

    test(`an open part of ${build} closed and opened again in one frame still shows its text after the window narrows`, async ({page}) => {
      await page.goto(showing(build));
      const part = accordionsTab(page).firstPartOf(build);
      await part.open();
      await heightOnceSettled(part.fold);

      await accordionsTab(page).closesThenOpensTheFirstPartInOneFrame(build);
      await heightOnceSettled(part.fold);
      await page.setViewportSize({width: 390, height: 900});

      await textStillShown(part);
    });
  });
}
