import {expect, test} from '@playwright/test';

test('a link saved to the old Development address lands on its Practice tab, and Back returns to where it was followed from', async ({page}) => {
  await page.goto('');
  await expect(page.getByRole('heading', {level: 1, name: 'The three languages'})).toBeVisible();

  await page.goto('development/?tab=presentation');

  await expect(page.getByRole('heading', {level: 1, name: 'Practice Presentation'})).toBeVisible();
  await expect(page).toHaveURL(/\/practice\/\?tab=presentation$/);

  await page.goBack();

  await expect(page.getByRole('heading', {level: 1, name: 'The three languages'})).toBeVisible();
});
