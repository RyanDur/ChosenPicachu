import {Page, expect, test} from '@playwright/test';
import {desktop, iPadUpright, iPhone, phoneSideways, pillsAFingerCannotChoose, pillSwitch} from './__test_support';

const everyPillIsChosenByAFinger = async (page: Page, at: string, groups: string[]): Promise<void> => {
  await page.goto(at);

  const unchosen = await pillsAFingerCannotChoose(page, groups);

  expect(unchosen).toEqual([]);
};

for (const {reader, device} of [
  {reader: 'a phone', device: iPhone},
  {reader: 'an iPad held upright', device: iPadUpright},
  {reader: 'a phone held sideways', device: phoneSideways}
]) {
  test.describe(reader, () => {
    test.use(device);

    test('every pill on the accordions demo is chosen by a finger that lands just off its middle', ({page}) =>
      everyPillIsChosenByAFinger(page, 'demos/accordions/', ['fold type', 'fold motion']));

    test('every pill on the tables demo is chosen by a finger that lands just off its middle', ({page}) =>
      everyPillIsChosenByAFinger(page, 'demos/tables/', ['world', 'pace', 'origin', 'motion']));

    test('every pill on the z-index demo is chosen by a finger that lands just off its middle', ({page}) =>
      everyPillIsChosenByAFinger(page, 'demos/z-index/', ['card raised', 'side', 'align', 'entrance', 'stack']));
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
