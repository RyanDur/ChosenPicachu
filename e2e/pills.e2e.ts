import {expect, test} from '@playwright/test';
import {desktop, iPadUpright, iPhone, phoneSideways, pillsAFingerCannotChoose, pillSwitch} from './__test_support';

for (const {reader, device} of [
  {reader: 'a phone', device: iPhone},
  {reader: 'an iPad held upright', device: iPadUpright},
  {reader: 'a phone held sideways', device: phoneSideways}
]) {
  test.describe(reader, () => {
    test.use(device);

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

    test('every pace pill on the tables demo is chosen by a finger that lands just off its middle', async ({page}) => {
      await page.goto('demos/tables/');

      expect(await pillsAFingerCannotChoose(page, 'pace')).toEqual([]);
    });

    test('every origin pill on the tables demo is chosen by a finger that lands just off its middle', async ({page}) => {
      await page.goto('demos/tables/');

      expect(await pillsAFingerCannotChoose(page, 'origin')).toEqual([]);
    });

    test('every motion pill on the tables demo is chosen by a finger that lands just off its middle', async ({page}) => {
      await page.goto('demos/tables/');

      expect(await pillsAFingerCannotChoose(page, 'motion')).toEqual([]);
    });

    test('every card raised pill on the z-index demo is chosen by a finger that lands just off its middle', async ({page}) => {
      await page.goto('demos/z-index/');

      expect(await pillsAFingerCannotChoose(page, 'card raised')).toEqual([]);
    });

    test('every side pill on the z-index demo is chosen by a finger that lands just off its middle', async ({page}) => {
      await page.goto('demos/z-index/');

      expect(await pillsAFingerCannotChoose(page, 'side')).toEqual([]);
    });

    test('every align pill on the z-index demo is chosen by a finger that lands just off its middle', async ({page}) => {
      await page.goto('demos/z-index/');

      expect(await pillsAFingerCannotChoose(page, 'align')).toEqual([]);
    });

    test('every entrance pill on the z-index demo is chosen by a finger that lands just off its middle', async ({page}) => {
      await page.goto('demos/z-index/');

      expect(await pillsAFingerCannotChoose(page, 'entrance')).toEqual([]);
    });

    test('every stack pill on the z-index demo is chosen by a finger that lands just off its middle', async ({page}) => {
      await page.goto('demos/z-index/');

      expect(await pillsAFingerCannotChoose(page, 'stack')).toEqual([]);
    });
  });
}

for (const {reader, device} of [{reader: 'a desktop', device: desktop}, {reader: 'a phone', device: iPhone}]) {
  test.describe(`${reader}, choosing a pill`, () => {
    test.use(device);

    test('the pill chosen is checked, and the pill left behind is not', async ({page}) => {
      await page.goto('demos/tables/');
      const world = pillSwitch(page, 'world');
      await expect(world.pill('React')).toBeChecked();

      await world.choose('Vanilla');

      await expect(world.pill('Vanilla')).toBeChecked();
      await expect(world.pill('React')).not.toBeChecked();
    });
  });
}
