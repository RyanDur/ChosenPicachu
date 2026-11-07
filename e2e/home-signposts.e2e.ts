import {expect, test} from '@playwright/test';
import {homePage, recordPage} from './__test_support';

test('a reader who follows a story from the home’s opener lands on that story on the record', async ({page}) => {
  await page.goto('');

  await homePage(page).openerLink('the Presentation story').click();

  await expect(page).toHaveURL(/\/record\/#presentation$/);
  await expect(recordPage(page).story('Presentation')).toBeFocused();
});
