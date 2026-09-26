import {Locator, expect, test} from '@playwright/test';
import {phone, tablesDemo} from './__test_support';

const heightByTheNextFrame = (fold: Locator): Promise<number> => fold.evaluate(details =>
  new Promise<number>(resolve => requestAnimationFrame(() => resolve(details.getBoundingClientRect().height))));

const heightOnceSettled = async (fold: Locator): Promise<number> => {
  await fold.evaluate(details => Promise.all(details.getAnimations({subtree: true}).map(animation => animation.finished)));
  return heightByTheNextFrame(fold);
};

test.use(phone);

test('a reader who asks for less motion gets the settings fold open at once', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.goto('demos/?tab=tables');
  const tables = tablesDemo(page);
  await expect(tables.settingsFold).toBeVisible();
  await expect(tables.controls).toBeHidden();

  await tables.pressSettings();
  const opened = await heightByTheNextFrame(tables.settingsFold);

  await expect(tables.controls).toBeVisible();
  expect(await heightOnceSettled(tables.settingsFold)).toBe(opened);
});
