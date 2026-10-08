import {expect, test, type Browser, type Page} from '@playwright/test';
import {differences, heldStill, lookOf, type Look} from './look';
import {views, type View} from './views';

const stages = {before: 'http://localhost:4530/ChosenPicachu/', after: 'http://localhost:4531/ChosenPicachu/'};
const sizes = [{width: 1440, height: 900}, {width: 1000, height: 900}, {width: 390, height: 844}] as const;

// a page still settling (the Feedback dialog moves focus into its field from its own toggle event) is read until two
// reads in a row agree, so a difference is the change and not the moment it was read
const steadyLookOf = async (page: Page): Promise<Look> => {
  let last = await lookOf(page);
  for (let read = 0; read < 5; read++) {
    await page.waitForTimeout(250);
    const now = await lookOf(page);
    if (differences(last, now).length === 0) return now;
    last = now;
  }
  return last;
};

const looked = async (browser: Browser, base: string, view: View, viewport: {width: number; height: number}): Promise<Look> => {
  const context = await browser.newContext({viewport, reducedMotion: 'reduce', serviceWorkers: view.withoutWorkers ? 'block' : 'allow'});
  const page: Page = await context.newPage();
  const settled = await heldStill(page);
  if (view.held) await page.route(view.held, () => new Promise(() => undefined));
  await page.goto(base + view.page.path);
  await page.getByRole(view.page.ready).first().waitFor();
  await view.page.loaded?.(page).waitFor();
  await settled();
  await view.into?.(page);
  await settled();
  const look = await steadyLookOf(page);
  await context.close();
  return look;
};

for (const viewport of sizes) {
  for (const view of views) {
    test(`${view.page.name}, ${view.name}, at ${viewport.width}, looks as it did`, async ({browser}) => {
      const [before, after] = await Promise.all([looked(browser, stages.before, view, viewport), looked(browser, stages.after, view, viewport)]);
      const moved = differences(before, after);

      expect(moved, moved.slice(0, 60).join('\n')).toEqual([]);
    });
  }
}
