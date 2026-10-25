import {expect, test} from '@playwright/test';
import {chartsPage, oldWayFoldLabels, scriptedMarket} from './__test_support';

test('the accordion labels survive a visit to the streaming charts', async ({page}) => {
  await scriptedMarket(page, [50000, 50001]);
  await page.goto('demos/?tab=accordions');
  const demos = page.getByRole('navigation', {name: 'demos'});
  await expect(page.getByRole('region', {name: 'How we used to build a fold'}).getByRole('radio').first()).toBeAttached();
  const before = await oldWayFoldLabels(page);

  await demos.getByRole('link', {name: 'Charts'}).click();
  await expect(chartsPage(page).priceCard.getByText('$50,001.00')).toBeVisible();
  await demos.getByRole('link', {name: 'Accordions'}).click();

  await expect.poll(() => oldWayFoldLabels(page)).toEqual(before);
});
