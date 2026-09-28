import {expect, test} from '@playwright/test';
import {chartsPage, heldMarket, iPhone} from './__test_support';

test('the price period menu stays hidden until the reader asks for it', async ({page}) => {
  const charts = chartsPage(page);
  await page.goto('demos?tab=charts');

  await expect(charts.periodToggle).toBeVisible();
  await expect(charts.period('week')).toBeHidden();

  await charts.periodToggle.click();
  await expect(charts.period('week')).toBeVisible();
});

test.describe('a phone', () => {
  test.use(iPhone);

  test('the charts tab holds still while its data arrives', async ({page}) => {
    const market = await heldMarket(page, [50000, 50100]);
    await page.goto('demos?tab=charts');
    const fold = chartsPage(page).priceCard.getByText('what am I looking at?', {exact: true});
    await expect(fold).toBeVisible();
    const before = await fold.boundingBox();

    market.arrive();

    await expect(chartsPage(page).priceDelta).toBeVisible();
    expect(await fold.boundingBox()).toEqual(before);
  });

  test('the pressure chart holds still while its trades arrive', async ({page}) => {
    const market = await heldMarket(page, [50000, 50100]);
    await page.goto('demos?tab=charts');
    await page.getByRole('button', {name: 'Add a chart'}).click();
    await page.getByLabel('charts to add').getByRole('button', {name: 'Pressure'}).click();
    const pressure = page.getByRole('region', {name: 'pressure'});
    const fold = pressure.getByText('what am I looking at?', {exact: true});
    await expect(fold).toBeVisible();
    const before = await fold.boundingBox();

    market.arrive();

    await expect(pressure.getByText('waiting for the first trade')).toBeHidden();
    expect(await fold.boundingBox()).toEqual(before);
  });
});
