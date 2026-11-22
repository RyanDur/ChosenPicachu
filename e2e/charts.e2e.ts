import {expect, type Page} from '@playwright/test';
import {test} from './__test_support/journey';
import {boxOf, chartsPage, hydration, siteFrame} from './__test_support';

test('the price period menu stays hidden until the reader asks for it', async ({page}) => {
  const charts = chartsPage(page);
  await page.goto('demos/charts/');

  await expect(charts.periodToggle).toBeVisible();
  await expect(charts.period('week')).toBeHidden();

  await charts.periodToggle.click();
  await expect(charts.period('week')).toBeVisible();
});

test('the feed says it is connecting, then that it is live', async ({page}) => {
  const feed = await chartsPage(page).feedStillConnecting([50000, 50100]);
  const status = page.getByRole('status', {name: 'feed'});
  await page.goto('demos/charts/');
  await expect(status).toHaveText('connecting to the live feed…');

  feed.opens();

  await expect(status).toHaveText('live');
});

const leftOut = 'What the page left out: “bogus” isn’t a chart. Pie was already on the desk.';

test('a reader who opens an address with a name the page doesn’t know and a repeat reads what was left out', async ({page}) => {
  const charts = chartsPage(page);
  await page.goto('demos/charts/?charts=pie,bogus,pie,candles:day');
  await siteFrame(page).hydrated();

  await expect(charts.doorway('Candles')).toBeVisible();
  await expect(page.getByRole('list', {name: 'charts'}).getByRole('link', {name: / tutorial$/})).toHaveCount(2);
  await expect(page.getByText(leftOut)).toBeVisible();
});

test('a screen reader entering the desk of an address with a name the page doesn’t know hears what was left out', async ({page}) => {
  await page.goto('demos/charts/?charts=pie,bogus,pie,candles:day');
  await siteFrame(page).hydrated();

  await expect(page.getByRole('list', {name: 'charts'})).toHaveAccessibleDescription(leftOut);
});

test('a reader who opens an address naming each chart once reads nothing left out', async ({page}) => {
  const charts = chartsPage(page);
  await page.goto('demos/charts/?charts=pie,candles:day');
  await siteFrame(page).hydrated();

  await expect(charts.doorway('Candles')).toBeVisible();
  await expect(page.getByText(/^What the page left out:/)).toHaveCount(0);
});

test('removing a chart leaves focus on the next chart\'s link', async ({page}) => {
  const charts = chartsPage(page);
  await page.goto('demos/charts/?charts=price,candles');
  await siteFrame(page).hydrated();
  await charts.doorway('Price line').focus();

  await page.keyboard.press('Delete');

  await expect(charts.doorway('Candles')).toBeFocused();
});

const aPressOpensTheTutorial = async (page: Page, byTouch: boolean, kind: string, region: string): Promise<void> => {
  await page.goto(`demos/charts/?charts=${kind}`);
  const drawing = page.getByRole('region', {name: region, exact: true}).getByRole('figure');
  await drawing.scrollIntoViewIfNeeded();
  const box = await boxOf(drawing, `the ${kind} drawing is not shown`);

  const [x, y] = [box.x + box.width / 2, box.y + box.height / 2];
  await (byTouch ? page.touchscreen.tap(x, y) : page.mouse.click(x, y));

  await expect(page).toHaveURL(new RegExp(`/demos/charts/${kind}/?$`));
};

test.describe('a press in the middle of a drawing', {tag: ['@iPhone', '@desktop']}, () => {
  test('a press in the middle of the price drawing opens its tutorial', ({page, hasTouch}) => aPressOpensTheTutorial(page, hasTouch, 'price', 'live trades'));

  test('a press in the middle of the candles drawing opens its tutorial', ({page, hasTouch}) => aPressOpensTheTutorial(page, hasTouch, 'candles', 'candles'));

  test('a press in the middle of the pressure drawing opens its tutorial', ({page, hasTouch}) => aPressOpensTheTutorial(page, hasTouch, 'pressure', 'pressure'));

  test('a press in the middle of the pie drawing opens its tutorial', ({page, hasTouch}) => aPressOpensTheTutorial(page, hasTouch, 'pie', 'pie'));
});

test.describe('a mouse carrying a chart past its neighbor', {tag: '@desktop'}, () => {
  test('the chart swaps back only once the pointer has come a third of its height back', async ({page}) => {
    await page.goto('demos/charts/?charts=price,pie');
    const charts = chartsPage(page);
    const carried = await charts.carryByTheGrip('live trades');

    const down = await carried.pointerWhenTheyTrade(1);
    await expect.poll(charts.stillSliding).toBe(0);
    const back = await carried.pointerWhenTheyTrade(-1);
    await page.mouse.up();

    expect(down - back).toBeGreaterThan(carried.height / 3 - 6);
    expect(down - back).toBeLessThan(carried.height / 3 + 6);
  });
});

test('a finger pressed on a chart\'s grip and taken over by the browser leaves the chart at rest', {tag: '@iPhone'}, async ({page, browserName}) => {
  test.skip(browserName !== 'chromium', 'only Chromium\'s DevTools protocol cancels a finger');
  await page.goto('demos/charts/?charts=price,candles');
  const charts = chartsPage(page);

  const finger = await charts.fingerOnTheGrip('live trades');
  await expect(charts.seat('live trades')).toHaveAttribute('draggable', 'true');

  await finger.canceled();
  await expect(charts.seat('live trades')).not.toHaveAttribute('draggable', 'true');
});

const chartsTabWithItsScriptHeldBack = async (page: Page) => {
  const address = 'demos/charts/';
  const script = hydration(page);
  await script.holdBack(address);
  await page.goto(address);
  return {charts: chartsPage(page), release: script.release};
};

test('given the charts tab before its script runs, Add a chart is disabled; once the script runs, a chart chosen from it is added', async ({page}) => {
  const {charts, release} = await chartsTabWithItsScriptHeldBack(page);

  await expect(charts.adder).toBeDisabled();
  await release();

  await charts.adder.click();
  await charts.chartToAdd('Candles').click();

  await expect(charts.seat('candles')).toBeVisible();
  await expect(charts.report).toHaveText('Candles added');
});

test('given the charts tab before its script runs, the period toggle is disabled; once the script runs, a period chosen from it is taken', async ({page}) => {
  const {charts, release} = await chartsTabWithItsScriptHeldBack(page);

  await expect(charts.periodToggle).toBeDisabled();
  await release();

  await charts.periodToggle.click();
  await charts.period('week').click();

  await expect(charts.periodToggle).toContainText('week');
});
