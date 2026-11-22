import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {positionExhibit} from './__test_support';

const address = 'demos/z-index/how-position-places-a-box/';

test('a keyboard steps Second through all five positions, and the chosen one is the one checked', async ({page}) => {
  const exhibit = positionExhibit(page);
  await page.goto(address);

  await exhibit.stepsByKeyboard(4);

  await expect(exhibit.pill('sticky')).toBeChecked();
  await expect(exhibit.pill('static')).not.toBeChecked();
});

test('a keyboard reaches the little page and scrolls it', async ({page}) => {
  const exhibit = positionExhibit(page);
  await page.goto(address);
  await exhibit.tabsToTheLittlePage();
  await expect(exhibit.littlePage).toBeFocused();
  const first = await exhibit.spotOf('First');

  await page.keyboard.press('PageDown');

  await expect.poll(async () => (await exhibit.spotOf('First')).y).toBeLessThan(first.y);
});

test('a reader’s chosen positions are still chosen after a reload, and Second is still where they put it', async ({page}) => {
  const exhibit = positionExhibit(page);
  await page.goto(address);
  await exhibit.chooses('absolute');
  await exhibit.choosesParent('not positioned');

  await page.reload();

  await expect(exhibit.pill('absolute')).toBeChecked();
  await expect(exhibit.parentPill('not positioned')).toBeChecked();
  await expect.poll(() => exhibit.spotOf('Second')).toEqual({x: 24, y: 16});
});

test('Second given relative moves 16px down and 24px right, and its old place stays open', async ({page}) => {
  const exhibit = positionExhibit(page);
  await page.goto(address);
  const second = await exhibit.spotOf('Second');
  const third = await exhibit.spotOf('Third');

  await exhibit.chooses('relative');

  await expect.poll(() => exhibit.spotOf('Second')).toEqual({x: second.x + 24, y: second.y + 16});
  expect(await exhibit.spotOf('Third')).toEqual(third);
});

test('an absolute Second whose parent has no position is measured from the little page’s corner', async ({page}) => {
  const exhibit = positionExhibit(page);
  await page.goto(address);
  await exhibit.chooses('absolute');

  await exhibit.choosesParent('not positioned');

  await expect.poll(() => exhibit.spotOf('Second')).toEqual({x: 24, y: 16});
});

test('an absolute Second whose parent is positioned sits 16px down and 24px in from the parent’s corner', async ({page}) => {
  const exhibit = positionExhibit(page);
  await page.goto(address);

  await exhibit.chooses('absolute');

  await expect.poll(() => exhibit.placedFromItsHolder('Second')).toEqual({x: 24, y: 16, measuredFromFirstsHolder: true});
});

test('an absolute Second leaves the flow, and Third moves up into its place', async ({page}) => {
  const exhibit = positionExhibit(page);
  await page.goto(address);
  const second = await exhibit.spotOf('Second');

  await exhibit.chooses('absolute');

  await expect.poll(() => exhibit.spotOf('Third')).toEqual(second);
});

test('a fixed Second stays where it is in the little window when the little page scrolls', async ({page}) => {
  const exhibit = positionExhibit(page);
  await page.goto(address);
  await exhibit.chooses('fixed');
  const before = await exhibit.spotOf('Second');
  const first = await exhibit.spotOf('First');

  await exhibit.wheelsTheLittlePage(120);

  await expect.poll(async () => (await exhibit.spotOf('First')).y).toBeLessThan(first.y);
  await expect.poll(() => exhibit.spotOf('Second')).toEqual(before);
});

test('a sticky Second holds at the top of the little window while its parent scrolls under it', async ({page}) => {
  const exhibit = positionExhibit(page);
  await page.goto(address);
  await exhibit.chooses('sticky');

  await exhibit.wheelsTheLittlePage(200);

  await expect.poll(async () => (await exhibit.spotOf('Second')).y).toBe(0);
});

test('a sticky Second leaves the top of the little window when its parent does', async ({page}) => {
  const exhibit = positionExhibit(page);
  await page.goto(address);
  await exhibit.chooses('sticky');

  await exhibit.wheelsTheLittlePage(5000);

  await expect.poll(async () => (await exhibit.spotOf('Second')).y).toBeLessThan(0);
});
