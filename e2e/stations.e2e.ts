import {expect, test} from '@playwright/test';
import {pressTab, tabsTo} from './__test_support';

test('a keyboard reader who follows a story\'s station link carries on inside that station with one Tab', async ({page}) => {
  await page.goto('demos/?tab=dragAndDrop');
  const stations = page.getByRole('list', {name: 'the stations'});
  const station = stations.getByRole('listitem').filter({has: page.getByRole('heading', {name: 'Layer on functionality, in the order it was asked for'})});
  await tabsTo(page, page.getByRole('list', {name: 'the slices'}).getByRole('link', {name: 'station 4'}).first());
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#station-4$/);

  await pressTab(page);

  await expect.poll(() => station.evaluate(landed => landed !== document.activeElement && landed.contains(document.activeElement))).toBe(true);
});
