import {expect, test} from '@playwright/test';
import {contextChooser, desktop, iPhone, wearsReportedWrong, type Worn} from './__test_support';

const whereTheListOpens: readonly [Worn, 'over' | 'under'][] = [
  ['nothing', 'over'],
  ['position: relative', 'over'],
  ['outline', 'over'],
  ['z-index: 1', 'under'],
  ['opacity: 0.9', 'under'],
  ['transform: rotate(-1deg)', 'under'],
  ['isolation: isolate', 'under']
];

for (const {size, device} of [{size: 390, device: iPhone}, {size: 1440, device: desktop}]) {
  test.describe(`at ${size} wide`, () => {
    test.use(device);

    test('choosing each thing card one wears in turn opens the menu over card two for the three that form no context, and under it for the four that do', async ({page}) => {
      await page.goto('demos/z-index/');

      expect(await wearsReportedWrong(page, whereTheListOpens)).toEqual([]);
    });
  });
}

test('going back past a choice takes back the sentence, which no longer matches the cards', async ({page}) => {
  await page.goto('demos/z-index/');
  const chooser = contextChooser(page);
  await chooser.wearing('opacity: 0.9').click();
  await chooser.open();
  await expect(chooser.said).toContainText('under card two');
  await page.keyboard.press('Escape');

  await page.goBack();

  await expect(chooser.wearing('nothing')).toBeChecked();
  await expect(chooser.said).toBeEmpty();
});
