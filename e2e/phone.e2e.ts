import {expect, test} from '@playwright/test';
import {documentScrollY, homePage, phone} from './__test_support';

test.use(phone);

test('following a link lands at the top of the next page', async ({page}) => {
  await page.goto('');
  const away = homePage(page).linkToTheDemos;
  await away.scrollIntoViewIfNeeded();
  expect(await documentScrollY(page)).toBeGreaterThan(0);

  await away.click();
  await expect(page.getByRole('navigation', {name: 'demos'})).toBeVisible();

  await expect.poll(() => documentScrollY(page)).toBe(0);
});
