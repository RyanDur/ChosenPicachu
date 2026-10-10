import {expect, test} from '@playwright/test';
import {documentScrollY, phone, recordPage} from './__test_support';

test.use(phone);

test('following a link lands at the top of the next page', async ({page}) => {
  await page.goto('record/');
  const away = recordPage(page).linkToTheDemos;
  await away.scrollIntoViewIfNeeded();
  expect(await documentScrollY(page)).toBeGreaterThan(0);

  await away.click();
  await expect(page.getByRole('navigation', {name: 'demos'})).toBeVisible();

  await expect.poll(() => documentScrollY(page)).toBe(0);
});
