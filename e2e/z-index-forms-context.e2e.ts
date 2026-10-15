import {expect, test} from '@playwright/test';
import {contextChooser, desktop, iPhone, type Worn} from './__test_support';

const opensOver: readonly Worn[] = ['nothing', 'position', 'outline'];
const opensUnder: readonly Worn[] = ['z-index', 'opacity', 'transform', 'isolation'];

for (const {size, device} of [{size: 390, device: iPhone}, {size: 1440, device: desktop}]) {
  test.describe(`at ${size} wide`, () => {
    test.use(device);

    for (const worn of opensOver) {
      test(`with card one wearing ${worn}, the menu opens over card two`, async ({page}) => {
        const chooser = contextChooser(page);
        await page.goto(chooser.wears(worn));

        await chooser.open();

        await expect.poll(() => chooser.onTopAt('date')).toBe('the choice');
        await expect(chooser.said).toContainText('over card two');
      });
    }

    for (const worn of opensUnder) {
      test(`with card one wearing ${worn}, the menu opens under card two`, async ({page}) => {
        const chooser = contextChooser(page);
        await page.goto(chooser.wears(worn));

        await chooser.open();

        await expect.poll(() => chooser.onTopAt('date')).toBe('card two');
        await expect(chooser.said).toContainText('under card two');
      });
    }
  });
}
