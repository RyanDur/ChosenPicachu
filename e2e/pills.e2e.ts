import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {pillsAFingerCannotChoose, pillSwitch} from './__test_support';

test.describe('a finger that lands just off a pill\'s middle', {tag: ['@iPhone', '@iPadUpright', '@phoneSideways']}, () => {
  test('every fold type pill on the accordions demo is chosen by a finger that lands just off its middle', async ({page}) => {
    await page.goto('demos/accordions/');

    expect(await pillsAFingerCannotChoose(page, 'fold type')).toEqual([]);
  });

  test('every fold motion pill on the accordions demo is chosen by a finger that lands just off its middle', async ({page}) => {
    await page.goto('demos/accordions/');

    expect(await pillsAFingerCannotChoose(page, 'fold motion')).toEqual([]);
  });

  test('every world pill on the tables demo is chosen by a finger that lands just off its middle', async ({page}) => {
    await page.goto('demos/tables/');

    expect(await pillsAFingerCannotChoose(page, 'world')).toEqual([]);
  });

  test('every pace pill on the drag sort tutorial is chosen by a finger that lands just off its middle', async ({page}) => {
    await page.goto('demos/tables/sort/');

    expect(await pillsAFingerCannotChoose(page, 'pace')).toEqual([]);
  });

  test('every origin pill on the drag sort tutorial is chosen by a finger that lands just off its middle', async ({page}) => {
    await page.goto('demos/tables/sort/');

    expect(await pillsAFingerCannotChoose(page, 'origin')).toEqual([]);
  });

  test('every motion pill on the drag sort tutorial is chosen by a finger that lands just off its middle', async ({page}) => {
    await page.goto('demos/tables/sort/');

    expect(await pillsAFingerCannotChoose(page, 'motion')).toEqual([]);
  });

  test('every card raised pill on the z-index demo is chosen by a finger that lands just off its middle', async ({page}) => {
    await page.goto('demos/z-index/why-third-is-on-top/');

    expect(await pillsAFingerCannotChoose(page, 'card raised')).toEqual([]);
  });

  test('every step pill on the z-index tab’s pile is chosen by a finger that lands just off its middle', async ({page}) => {
    await page.goto('demos/z-index/');

    expect(await pillsAFingerCannotChoose(page, 'Step')).toEqual([]);
  });

  test('every give a z-index to pill on the z-index tab’s pile is chosen by a finger that lands just off its middle', async ({page}) => {
    await page.goto('demos/z-index/?raised=first');

    expect(await pillsAFingerCannotChoose(page, 'Give a z-index to')).toEqual([]);
  });

  test('every side pill on the z-index demo is chosen by a finger that lands just off its middle', async ({page}) => {
    await page.goto('demos/z-index/lets-build-this-feature/');

    expect(await pillsAFingerCannotChoose(page, 'side')).toEqual([]);
  });

  test('every align pill on the z-index demo is chosen by a finger that lands just off its middle', async ({page}) => {
    await page.goto('demos/z-index/lets-build-this-feature/');

    expect(await pillsAFingerCannotChoose(page, 'align')).toEqual([]);
  });

  test('every entrance pill on the z-index demo is chosen by a finger that lands just off its middle', async ({page}) => {
    await page.goto('demos/z-index/lets-build-this-feature/');

    expect(await pillsAFingerCannotChoose(page, 'entrance')).toEqual([]);
  });

  test('every stack pill on the z-index demo is chosen by a finger that lands just off its middle', async ({page}) => {
    await page.goto('demos/z-index/lets-build-this-feature/');

    expect(await pillsAFingerCannotChoose(page, 'stack')).toEqual([]);
  });

  test('every position pill on how position places a box is chosen by a finger that lands just off its middle', async ({page}) => {
    await page.goto('demos/z-index/how-position-places-a-box/');

    expect(await pillsAFingerCannotChoose(page, 'Second’s position is')).toEqual([]);
  });
});

test('the pill chosen is checked, and the pill left behind is not', {tag: ['@iPhone', '@desktop']}, async ({page}) => {
  await page.goto('demos/tables/');
  const world = pillSwitch(page, 'world');
  await expect(world.pill('React')).toBeChecked();

  await world.choose('Vanilla');

  await expect(world.pill('Vanilla')).toBeChecked();
  await expect(world.pill('React')).not.toBeChecked();
});
