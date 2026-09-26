import {Locator, expect, test} from '@playwright/test';
import {phone} from './__test_support';

const heightByTheNextFrame = (fold: Locator): Promise<number> => fold.evaluate(details =>
  new Promise<number>(resolve => requestAnimationFrame(() => resolve(details.getBoundingClientRect().height))));

test.use(phone);

test('a reader who asks for less motion gets the settings fold open at once', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.goto('demos/?tab=tables');
  const fold = page.getByRole('group', {name: 'settings'}).first();
  const controls = page.getByRole('region', {name: 'table controls'});
  await expect(fold).toBeVisible();
  await expect(controls).toBeHidden();

  await fold.getByText(/^settings/).click();
  const opened = await heightByTheNextFrame(fold);

  await expect(controls).toBeVisible();
  await fold.evaluate(details => Promise.all(details.getAnimations({subtree: true}).map(animation => animation.finished)));
  expect(await heightByTheNextFrame(fold)).toBe(opened);
});
