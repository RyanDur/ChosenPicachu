import {expect, test} from '@playwright/test';

const milliseconds = (duration: string): number =>
  duration.trim().endsWith('ms') ? parseFloat(duration) : parseFloat(duration) * 1000;

test('a reader who asks for less motion gets the settings fold without a slide', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.goto('demos/?tab=tables');
  const fold = page.getByRole('group', {name: 'settings'}).first();
  await expect(fold).toBeVisible();

  const longest = () => fold.evaluate(details => getComputedStyle(details, '::details-content').transitionDuration)
    .then(durations => Math.max(...durations.split(',').map(milliseconds)));

  await expect.poll(longest).toBeLessThanOrEqual(1);
});
