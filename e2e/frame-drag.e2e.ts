import {expect, FrameLocator, Locator, Page, test} from '@playwright/test';

type Stage = {name: string, at: string, table: (page: Page) => Locator | FrameLocator};

const stages: Stage[] = [
  {name: 'react', at: '/ChosenPicachu/demos/?tab=tables&world=react', table: page => page.getByRole('region', {name: 'live aggregations'})},
  {name: 'vanilla', at: '/ChosenPicachu/demos/?tab=tables&world=vanilla', table: page => page.frameLocator('iframe[title="the living table, in vanilla"]')}
];

type Box = {x: number, y: number, width: number, height: number};

const dragTo = async (page: Page, from: Box, x: number, y: number): Promise<void> => {
  const start = {x: from.x + from.width / 2, y: from.y + from.height / 2};
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  for (let step = 1; step <= 16; step++) {
    await page.mouse.move(start.x + (x - start.x) * (step / 16), start.y + (y - start.y) * (step / 16));
  }
  await page.mouse.up();
};

const boxOf = async (locator: Locator): Promise<Box> => {
  const box = await locator.boundingBox();
  if (!box) {
    throw new Error('the element never stood');
  }
  return box;
};

for (const {name, at, table} of stages) {
  test(`a trader drags a column and a row into new seats, in ${name}`, async ({page}) => {
    const troubles: string[] = [];
    page.on('pageerror', error => troubles.push(String(error)));
    await page.goto(at);
    const frame = table(page);
    await expect(frame.getByRole('columnheader', {name: 'trades'})).toBeVisible();

    const order = () => frame.getByRole('columnheader').evaluateAll(headers =>
      headers.map(header => header.getAttribute('aria-label')));
    const rows = () => frame.getByRole('rowheader').evaluateAll(cells =>
      cells.map(cell => cell.getAttribute('aria-label') ?? (cell.textContent ?? '').trim()));

    const trades = await boxOf(frame.getByRole('columnheader', {name: 'trades'}));
    const vwap = await boxOf(frame.getByRole('columnheader', {name: 'vwap'}));
    await dragTo(page, trades, vwap.x + vwap.width * 0.8, trades.y + trades.height / 2);
    await expect.poll(order).toEqual(['window', 'buys', 'sells', 'volume', 'vwap', 'trades', 'change']);

    const grip = await boxOf(frame.getByRole('button', {name: 'move row 1'}));
    const thirdRow = await boxOf(frame.getByRole('row', {name: /last 15 minutes/}));
    await dragTo(page, grip, grip.x + grip.width / 2, thirdRow.y + thirdRow.height * 0.8);
    await expect.poll(rows).toEqual(['last 5 minutes', 'last 15 minutes', 'this minute', 'this hour', 'session']);

    expect(troubles).toEqual([]);
  });
}

test('a menu choice sorts, and never lifts the column', async ({page}) => {
  await page.goto('/ChosenPicachu/demos/?tab=tables&world=vanilla');
  const frame = page.frameLocator('iframe[title="the living table, in vanilla"]');
  const trades = frame.getByRole('columnheader', {name: 'trades'});
  await expect(trades).toBeVisible();
  const order = () => frame.getByRole('columnheader').evaluateAll(headers =>
    headers.map(header => header.getAttribute('aria-label')));

  await frame.getByRole('button', {name: 'sort trades'}).click();
  await frame.getByRole('button', {name: 'descending'}).click();

  await expect(trades).toHaveAttribute('aria-sort', 'descending');
  await expect.poll(order).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
});
