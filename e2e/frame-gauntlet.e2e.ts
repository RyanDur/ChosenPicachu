import {expect, test} from '@playwright/test';

const worlds = [
  'pace=eager&origin=hide&motion=animated',
  'pace=eager&origin=hide&motion=static',
  'pace=eager&origin=keep&motion=animated',
  'pace=eager&origin=keep&motion=static',
  'pace=lazy&origin=hide&motion=animated',
  'pace=lazy&origin=hide&motion=static',
  'pace=lazy&origin=keep&motion=animated',
  'pace=lazy&origin=keep&motion=static'
];

for (const stage of ['react', 'vanilla']) for (const world of worlds) {
  test(`the gauntlet, in ${stage}: ${world}`, async ({page}) => {
    const troubles: string[] = [];
    page.on('pageerror', error => troubles.push(String(error)));

    await page.goto(`/ChosenPicachu/demos/?tab=tables&world=${stage}&${world}`);
    const frame = stage === 'vanilla'
      ? page.frameLocator('iframe[title="the living table, in vanilla"]')
      : page.getByRole('region', {name: 'live aggregations'});
    await frame.getByRole('columnheader', {name: 'trades'}).waitFor();

    const order = () => frame.getByRole('columnheader').evaluateAll(headers =>
      headers.map(header => header.getAttribute('aria-label')));
    const rows = () => frame.getByRole('rowheader').evaluateAll(cells =>
      cells.map(cell => cell.getAttribute('aria-label') ?? (cell.textContent ?? '').trim()));

    const dragTo = async (fromBox: {x: number; y: number; width: number; height: number}, x: number, y: number) => {
      await page.mouse.move(fromBox.x + fromBox.width / 2, fromBox.y + fromBox.height / 2);
      await page.mouse.down();
      for (let step = 1; step <= 16; step++) {
        await page.mouse.move(
          fromBox.x + fromBox.width / 2 + (x - (fromBox.x + fromBox.width / 2)) * (step / 16),
          fromBox.y + fromBox.height / 2 + (y - (fromBox.y + fromBox.height / 2)) * (step / 16));
        await page.waitForTimeout(20);
      }
      await page.mouse.up();
    };

    // column drag across several seats: trades toward vwap
    const trades = await frame.getByRole('columnheader', {name: 'trades'}).boundingBox();
    const vwap = await frame.getByRole('columnheader', {name: 'vwap'}).boundingBox();
    if (!trades || !vwap) {
      throw new Error('headers missing');
    }
    await dragTo(trades, vwap.x + vwap.width * 0.8, trades.y + trades.height / 2);
    expect(await order()).toEqual(['window', 'buys', 'sells', 'volume', 'vwap', 'trades', 'change']);

    // row drag: first grip down past the third row
    const grip = await frame.getByRole('button', {name: 'move row 1'}).boundingBox();
    const thirdRow = await frame.getByRole('row', {name: /last 15 minutes/}).boundingBox();
    if (!grip || !thirdRow) {
      throw new Error('rows missing');
    }
    await dragTo(grip, grip.x + grip.width / 2, thirdRow.y + thirdRow.height * 0.8);
    expect(await rows()).toEqual(['last 5 minutes', 'last 15 minutes', 'this minute', 'this hour', 'session']);

    expect(troubles).toEqual([]);
  });
}
