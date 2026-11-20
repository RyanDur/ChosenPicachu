import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {chartsPage, iPhone, rememberedFolds, rememberedFoldLabels, siteFrame} from './__test_support';

test('the accordion labels survive a visit to the streaming charts', async ({page}) => {
  await chartsPage(page).scriptedMarket([50000, 50001]);
  await page.goto('demos/accordions/a-box-remembers-the-fold/?type=exclusive');
  await siteFrame(page).hydrated();
  const demos = page.getByRole('navigation', {name: 'demos'});
  await expect(rememberedFolds(page).first()).toBeAttached();
  const before = await rememberedFoldLabels(page);

  await demos.getByRole('link', {name: 'Charts'}).click();
  await expect(chartsPage(page).priceCard.getByText('$50,001.00')).toBeVisible();
  await page.goBack();

  await expect.poll(() => rememberedFoldLabels(page)).toEqual(before);
});

test('a tab on a page reached with a dial carries the dial along once the script runs', async ({page}) => {
  await page.goto('demos/tables/?world=vanilla');
  await siteFrame(page).hydrated();

  await expect(page.getByRole('navigation', {name: 'demos'}).getByRole('link', {name: 'Accordions'})).toHaveAttribute('href', /world=vanilla/);
});

test('a reader who opens a chart the site does not have is told there is no room there', async ({page}) => {
  await page.goto('demos/charts/nope/');

  await expect(page.getByRole('heading', {name: 'There is no room at this address.'})).toBeVisible();
});

test.describe('a reader on a phone', () => {
  test.use(iPhone);

  test('moves along the course with the tab row, which then names the tab they are on and its neighbors', async ({page}) => {
    await page.goto('demos/z-index/');
    await siteFrame(page).hydrated();
    const row = page.getByRole('navigation', {name: 'demos'});

    await row.getByRole('link', {name: 'Next tab, Drag sort'}).click();

    await expect(page.getByRole('region', {name: 'Drag sort', exact: true})).toBeVisible();
    const current = row.getByRole('link', {name: 'Drag sort', exact: true}).filter({visible: true});
    await expect(current).toBeVisible();
    await expect(current).toHaveAttribute('aria-current', 'page');
    await expect(row.getByRole('link', {name: 'Previous tab, Z-index'})).toBeVisible();
    await expect(row.getByRole('link', {name: 'Next tab, Charts'})).toBeVisible();
  });
});
