import {expect, test} from '@playwright/test';
import {chartsPage, scriptedMarket} from './__test_support';

test('the price period menu stays hidden until the reader asks for it', async ({page}) => {
  const charts = chartsPage(page);
  await scriptedMarket(page, [50000, 50100]);
  await page.goto('demos?tab=charts');

  await expect(charts.priceDelta).toBeVisible({timeout: 30_000});
  await expect(charts.periodToggle).toBeVisible();
  await expect(charts.period('week')).toBeHidden();

  await charts.periodToggle.click();
  await expect(charts.period('week')).toBeVisible();
});
