import {expect, test} from '@playwright/test';
import {chartsPage, desktop, feedStillConnecting, heldMarket, iPad13Upright, iPadUpright, iPhone, scriptedMarket} from './__test_support';

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

for (const {reader, device, statusLine} of [
  {reader: 'an iPad held upright', device: iPadUpright, statusLine: 'under the title'},
  {reader: 'a phone', device: iPhone, statusLine: 'under the title'},
  {reader: 'a large iPad held upright', device: iPad13Upright, statusLine: 'beside the title'}
] as const) {
  test.describe(reader, () => {
    test.use(device);

    test('the price period toggle holds still while the feed connects and once it is live', async ({page}) => {
      const feed = await feedStillConnecting(page, [50000, 50100]);
      const charts = chartsPage(page);
      const status = page.getByRole('status', {name: 'feed'});
      await page.goto('demos/?tab=charts');
      await expect(status).toHaveText('connecting to the live feed…');
      await expect(charts.periodToggle).toBeVisible();
      const whileConnecting = await charts.periodToggle.boundingBox();

      feed.opens();

      await expect(status).toHaveText('live');
      expect(await charts.periodToggle.boundingBox()).toEqual(whileConnecting);
    });

    test(`the feed's status sits ${statusLine}`, async ({page}) => {
      await scriptedMarket(page, [50000, 50100]);
      await page.goto('demos/?tab=charts');
      await expect(page.getByRole('status', {name: 'feed'})).toHaveText('live');

      expect(await chartsPage(page).whereTheFeedStatusSits()).toBe(statusLine);
    });
  });
}

for (const {reader, device, press} of [
  {reader: 'a mouse at a desk', device: desktop, press: 'click' as const},
  {reader: 'a finger on a phone', device: iPhone, press: 'tap' as const}
]) {
  test.describe(reader, () => {
    test.use(device);

    for (const {kind, region} of [
      {kind: 'price', region: 'live trades'},
      {kind: 'candles', region: 'candles'},
      {kind: 'pressure', region: 'pressure'},
      {kind: 'pie', region: 'pie'}
    ]) {
      test(`a press in the middle of the ${kind} drawing opens its tutorial`, async ({page}) => {
        await page.goto(`demos/?tab=charts&charts=${kind}`);
        const drawing = page.getByRole('region', {name: region, exact: true}).getByRole('figure');
        await drawing.scrollIntoViewIfNeeded();
        const box = await drawing.boundingBox();
        if (box === null) throw new Error(`the ${kind} drawing is not shown`);

        const [x, y] = [box.x + box.width / 2, box.y + box.height / 2];
        await (press === 'tap' ? page.touchscreen.tap(x, y) : page.mouse.click(x, y));

        await expect(page).toHaveURL(new RegExp(`/demos/charts/${kind}/?$`));
      });
    }
  });
}

test.describe('a mouse carrying a chart past its neighbour', () => {
  test.use(desktop);

  test('the chart swaps back only once the hand has come a third of its height back', async ({page}) => {
    await page.goto('demos/?tab=charts&charts=price,pie');
    const charts = chartsPage(page);
    const carried = await charts.carryByTheGrip('live trades');

    const down = await carried.handWhenTheyTrade(1);
    await expect.poll(charts.stillSliding).toBe(0);
    const back = await carried.handWhenTheyTrade(-1);
    await page.mouse.up();

    expect(down - back).toBeGreaterThan(carried.height / 3 - 6);
    expect(down - back).toBeLessThan(carried.height / 3 + 6);
  });
});
