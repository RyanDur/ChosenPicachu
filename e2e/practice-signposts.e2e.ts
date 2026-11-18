import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {practicePage, recordPage} from './__test_support';

test('a reader who follows the Behavior story from Practice lands on that story on the record', async ({page}) => {
  await page.goto('practice/structure/');

  await practicePage(page).tradeLink('the Behavior story').click();

  await expect(page).toHaveURL(/\/record\/#behavior$/);
  await expect(recordPage(page).story('Behavior')).toBeFocused();
});
