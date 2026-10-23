import {expect, test} from '@playwright/test';
import {dragSortTable, stages} from './__test_support';

const asDealt = ['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change'];

for (const {name, at, table} of stages) {
  test.describe(`resizing a column, in ${name}`, () => {
    test('an arrow on a handle trades two points with its neighbour either way, says the new share, and never moves the column', async ({page}) => {
      await page.goto(at);
      const trades = dragSortTable(page, table(page));
      await trades.resizeHandle('window').focus();
      const window = await trades.announcedShare('window');
      const neighbour = await trades.announcedShare('trades');
      await trades.listenToTheMoveReport();

      await page.keyboard.press('ArrowRight');

      await expect.poll(() => trades.announcedShare('window')).toBe(window + 2);
      await expect.poll(() => trades.announcedShare('trades')).toBe(neighbour - 2);
      await expect.poll(() => trades.whatTheMoveReportSaid()).toEqual([`window resized to ${window + 2}%`]);
      expect(await trades.columnOrder()).toEqual(asDealt);

      await page.keyboard.press('ArrowLeft');
      await page.keyboard.press('ArrowLeft');

      await expect.poll(() => trades.announcedShare('window')).toBe(window - 2);
      await expect.poll(() => trades.announcedShare('trades')).toBe(neighbour + 2);
    });

    test('an arrow held through its repeats says the share once, when it is let go', async ({page}) => {
      await page.goto(at);
      const trades = dragSortTable(page, table(page));
      await trades.resizeHandle('window').focus();
      const window = await trades.announcedShare('window');
      await trades.listenToTheMoveReport();

      await page.keyboard.down('ArrowRight');
      await page.keyboard.down('ArrowRight');
      await page.keyboard.down('ArrowRight');
      expect(await trades.whatTheMoveReportSaid()).toEqual([]);
      await page.keyboard.up('ArrowRight');

      await expect.poll(() => trades.whatTheMoveReportSaid()).toEqual([`window resized to ${window + 6}%`]);
    });

    test('a keyboard resize ends when the handle loses focus', async ({page}) => {
      await page.goto(at);
      const trades = dragSortTable(page, table(page));
      await trades.resizeHandle('window').focus();
      const window = await trades.announcedShare('window');
      await trades.listenToTheMoveReport();

      await page.keyboard.down('ArrowRight');
      await page.keyboard.press('Tab');

      await expect.poll(() => trades.whatTheMoveReportSaid()).toEqual([`window resized to ${window + 2}%`]);
      await page.keyboard.up('ArrowRight');
    });

    test('a second resize replaces what the page said about the first', async ({page}) => {
      await page.goto(at);
      const trades = dragSortTable(page, table(page));
      await trades.resizeHandle('window').focus();
      await page.keyboard.press('ArrowRight');
      await trades.resizeHandle('trades').focus();
      const share = await trades.announcedShare('trades');

      await page.keyboard.press('ArrowRight');

      await expect(trades.moveReport()).toHaveText(`trades resized to ${share + 2}%`);
    });

    test('a handle dragged through several shares says nothing on the way, keeps its name, and says where it lands', async ({page}) => {
      await page.goto(at);
      const trades = dragSortTable(page, table(page));
      await trades.listenToTheMoveReport();

      const hold = await trades.holdHandle('window');
      const before = await trades.announcedShare('window');
      await hold.carryTo(40);
      expect(await trades.whatTheMoveReportSaid()).toEqual([]);
      expect(await trades.announcedShare('window')).toBe(before);
      await hold.letGo();

      const after = await trades.announcedShare('window');
      expect(after).toBeGreaterThan(before);
      await expect.poll(() => trades.whatTheMoveReportSaid()).toEqual([`window resized to ${after}%`]);
    });

    test('a handle dragged and then left says its share once', async ({page}) => {
      await page.goto(at);
      const trades = dragSortTable(page, table(page));
      await trades.resizeHandle('window').focus();
      await trades.listenToTheMoveReport();

      const hold = await trades.holdHandle('window');
      await hold.carryTo(40);
      await hold.letGo();
      const share = await trades.announcedShare('window');
      await page.keyboard.press('Tab');

      await expect.poll(() => trades.whatTheMoveReportSaid()).toEqual([`window resized to ${share}%`]);
    });

    test('a handle pressed and let go, or dragged away and back, says nothing until a key moves it', async ({page}) => {
      await page.goto(at);
      const trades = dragSortTable(page, table(page));
      await trades.listenToTheMoveReport();

      const pressed = await trades.holdHandle('window');
      await pressed.letGo();
      const carried = await trades.holdHandle('window');
      await carried.carryTo(40);
      await carried.carryHome();
      await carried.letGo();
      await trades.resizeHandle('window').focus();
      await page.keyboard.press('ArrowRight');

      const share = await trades.announcedShare('window');
      await expect.poll(() => trades.whatTheMoveReportSaid()).toEqual([`window resized to ${share}%`]);
    });

    test('a handle dragged while another holds focus says only its own share', async ({page}) => {
      await page.goto(at);
      const trades = dragSortTable(page, table(page));
      await trades.resizeHandle('window').focus();
      await trades.listenToTheMoveReport();

      const hold = await trades.holdHandle('trades');
      await hold.carryTo(40);
      await hold.letGo();

      const share = await trades.announcedShare('trades');
      await expect.poll(() => trades.whatTheMoveReportSaid()).toEqual([`trades resized to ${share}%`]);
    });

    test('a resize whose finger is cancelled stops following the pointer', async ({page, browserName}) => {
      test.skip(browserName !== 'chromium', 'only Chromium\'s DevTools protocol cancels a finger');
      await page.goto(at);
      const trades = dragSortTable(page, table(page));
      await trades.resizeHandle('window').focus();
      const before = await trades.announcedShare('window');

      await trades.fingerCancelledOnHandle('window', 40);

      const atCancel = await trades.announcedShare('window');
      await trades.hoverAcrossHandle('window', 60);
      expect(await trades.announcedShare('window')).toBe(atCancel);
      expect(atCancel).not.toBe(before);
    });
  });
}
