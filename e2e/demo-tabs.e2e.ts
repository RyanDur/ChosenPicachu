import {expect, test} from '@playwright/test';
import {chartsPage, oldWayFoldLabels, scriptedMarket, siteFrame} from './__test_support';

test('the accordion labels survive a visit to the streaming charts', async ({page}) => {
  await scriptedMarket(page, [50000, 50001]);
  await page.goto('demos/accordions/');
  const demos = page.getByRole('navigation', {name: 'demos'});
  await expect(page.getByRole('region', {name: 'How we used to build a fold'}).getByRole('radio').first()).toBeAttached();
  const before = await oldWayFoldLabels(page);

  await demos.getByRole('link', {name: 'Charts'}).click();
  await expect(chartsPage(page).priceCard.getByText('$50,001.00')).toBeVisible();
  await demos.getByRole('link', {name: 'Accordions'}).click();

  await expect.poll(() => oldWayFoldLabels(page)).toEqual(before);
});

test('a tab on a page reached with a dial carries the dial along once the script runs', async ({page}) => {
  await page.goto('demos/tables/?world=vanilla');
  await siteFrame(page).hydrated();

  await expect(page.getByRole('navigation', {name: 'demos'}).getByRole('link', {name: 'Accordions'})).toHaveAttribute('href', /world=vanilla/);
});
