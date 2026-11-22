import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {positionExhibit} from './__test_support';

const address = 'demos/z-index/how-position-places-a-box/';

test('a keyboard steps Second through all five positions, and the chosen one is the one checked', async ({page}) => {
  const exhibit = positionExhibit(page);
  await page.goto(address);

  await exhibit.stepsThroughPositionsByKeyboard(4);

  await expect(exhibit.position('sticky')).toBeChecked();
  await expect(exhibit.position('static')).not.toBeChecked();
});

test('Second given relative moves 16px down and 24px right, its old place stays open, and the CSS shows the rule', async ({page}) => {
  const exhibit = positionExhibit(page);
  await page.goto(address);
  const second = await exhibit.spotOf('Second');
  const third = await exhibit.spotOf('Third');

  await exhibit.choosesPosition('relative');

  await expect.poll(() => exhibit.spotOf('Second')).toEqual({x: second.x + 24, y: second.y + 16});
  expect(await exhibit.spotOf('Third')).toEqual(third);
  await expect(exhibit.css).toContainText('position: relative;');
});

test('an absolute Second whose parent has no position is measured from the page’s corner, and the part says so', async ({page}) => {
  const exhibit = positionExhibit(page);
  await page.goto(address);
  await exhibit.choosesPosition('absolute');

  await exhibit.choosesParent('not positioned');

  await expect.poll(() => exhibit.spotOf('Second')).toEqual({x: 24, y: 16});
  await expect(exhibit.measuredFrom).toContainText('the page’s corner');
});

test('a fixed Second stays where it is in the little window when the little page scrolls', async ({page}) => {
  const exhibit = positionExhibit(page);
  await page.goto(address);
  await exhibit.choosesPosition('fixed');
  const before = await exhibit.spotOf('Second');

  await exhibit.scrollsTheLittlePageTo(120);

  await expect.poll(() => exhibit.spotOf('Second')).toEqual(before);
});

test('a sticky Second holds at the top of the little window while its parent scrolls under it', async ({page}) => {
  const exhibit = positionExhibit(page);
  await page.goto(address);
  await exhibit.choosesPosition('sticky');

  await exhibit.scrollsTheLittlePageTo(200);

  await expect.poll(async () => (await exhibit.spotOf('Second')).y).toBe(0);
});

test('a sticky Second leaves the top of the little window when its parent does', async ({page}) => {
  const exhibit = positionExhibit(page);
  await page.goto(address);
  await exhibit.choosesPosition('sticky');

  await exhibit.scrollsTheLittlePageToItsEnd();

  await expect.poll(async () => (await exhibit.spotOf('Second')).y).toBeLessThan(0);
});
