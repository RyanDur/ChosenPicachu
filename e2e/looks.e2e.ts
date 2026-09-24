import {expect, test} from '@playwright/test';
import {bannersPage, chartsPage, homePage, looks, markets, scriptedMarket} from './__test_support';

test('the period menu stays hidden until asked', async ({page}) => {
  const charts = chartsPage(page);
  await scriptedMarket(page, [50000, 50100]);
  await page.goto('demos?tab=charts');

  await expect(charts.priceDelta).toBeVisible({timeout: 30_000});
  await expect(charts.periodToggle).toBeVisible();
  await expect(charts.period('week')).toBeHidden();

  await charts.periodToggle.click();
  await expect(charts.period('week')).toBeVisible();
});

test('the chosen period glows, and its neighbours do not', async ({page}) => {
  const charts = chartsPage(page);
  await scriptedMarket(page, [50000, 50100]);
  await page.goto('demos?tab=charts');

  await expect(charts.priceDelta).toBeVisible({timeout: 30_000});
  await charts.periodToggle.click();

  await expect(charts.period('hour')).toHaveCSS('box-shadow', await looks(page).resolved('box-shadow', '--press-glow-soft'));
  await expect(charts.period('week')).toHaveCSS('box-shadow', 'none');
});

test('only one fuller story stands open at a time', async ({page}) => {
  const home = homePage(page);
  await page.goto('');
  const stories = home.timelineStories;

  await home.fullerStoryOf(stories.nth(0)).click();
  await expect(stories.nth(0)).toHaveAttribute('open', '');
  await expect(stories.nth(1)).not.toHaveAttribute('open', '');

  await home.fullerStoryOf(stories.nth(1)).click();
  await expect(stories.nth(1)).toHaveAttribute('open', '');
  await expect(stories.nth(0)).not.toHaveAttribute('open', '');
});

test('on a wide screen the rail and its list of paths wear different surfaces', async ({page}) => {
  await page.goto('');
  const rail = page.getByRole('navigation', {name: 'site'});

  await expect(rail).toHaveCSS('background-color', await looks(page).resolved('background-color', '--field'));
  await expect(rail.getByRole('list')).toHaveCSS('background-color', await looks(page).resolved('background-color', '--backdrop'));
});

test('an accordion card wears the card surface, not the silk of its folds', async ({page}) => {
  await page.goto('demos/?tab=accordions');
  const card = page.getByRole('article').filter({has: page.getByRole('heading', {name: 'Accordion using checkboxes', exact: true})});

  await expect(card).toHaveCSS('background-color', await looks(page).resolved('background-color', '--card'));
  await expect(card.getByRole('list')).toHaveCSS('background-color', await looks(page).resolved('background-color', '--silk'));
});

test('the z-index cards start in a stack and the button spreads them', async ({page}) => {
  await page.goto('demos/?tab=z-index');
  const layers = page.getByRole('region', {name: 'stacking with z-index'}).getByRole('listitem');
  const boxes = async () => [await layers.first().boundingBox(), await layers.last().boundingBox()];
  const stacked = async () => {
    const [first, last] = await boxes();
    return first !== null && last !== null && first.y === last.y;
  };
  const spread = async () => {
    const [first, last] = await boxes();
    return first !== null && last !== null && last.y >= first.y + first.height;
  };
  await expect.poll(stacked).toBe(true);

  await page.getByRole('button', {name: 'Expand'}).click();

  await expect.poll(spread).toBe(true);
});

test('the roster card is lifted off the page', async ({page}) => {
  await page.goto('users');
  const roster = page.getByRole('region', {name: 'User Candidates'});

  await expect(roster).toHaveCSS('box-shadow', await looks(page).resolved('box-shadow', '--light-box-shadow'));
});

test('the feed dot glows live', async ({page}) => {
  const charts = chartsPage(page);
  await scriptedMarket(page, [50000, 50100]);
  await page.goto('demos?tab=charts');

  await expect(charts.priceDelta).toBeVisible({timeout: 30_000});
  await expect.poll(() => charts.feedDot()).toBe(await looks(page).ink('--mint'));
});

const inks = {rising: '--mint-ink', falling: '--international-orange-engineering'};

for (const {trend, sign, prices} of markets) {
  test(`the ${trend} price card wears its ink`, async ({page}) => {
    const charts = chartsPage(page);
    await scriptedMarket(page, prices);
    await page.goto('demos?tab=charts');

    await expect(charts.priceDelta).toBeVisible({timeout: 30_000});
    await expect(charts.priceDelta).toHaveText(sign);
    await expect(charts.priceDelta).toHaveCSS('color', await looks(page).ink(inks[trend]));
  });
}

test('banners stacked sideways settle to the height of their news', async ({page}) => {
  const banners = bannersPage(page);
  await page.goto('demos/?tab=z-index');
  await banners.stackToTheLeft();
  await expect(banners.leftStack).toBeChecked();
  await banners.raise();
  await banners.raise();
  await expect(banners.news).toHaveCount(2);

  await expect.poll(banners.settled).toBe(true);
});
