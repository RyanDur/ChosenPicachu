import {expect, test} from '@playwright/test';
import {chartsPage, desktop, feedStillConnecting, iPhone} from './__test_support';

test('the price period menu stays hidden until the reader asks for it', async ({page}) => {
  const charts = chartsPage(page);
  await page.goto('demos?tab=charts');

  await expect(charts.periodToggle).toBeVisible();
  await expect(charts.period('week')).toBeHidden();

  await charts.periodToggle.click();
  await expect(charts.period('week')).toBeVisible();
});

test('the feed says it is connecting, then that it is live', async ({page}) => {
  const feed = await feedStillConnecting(page, [50000, 50100]);
  const status = page.getByRole('status', {name: 'feed'});
  await page.goto('demos/?tab=charts');
  await expect(status).toHaveText('connecting to the live feed…');

  feed.opens();

  await expect(status).toHaveText('live');
});

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
