import {expect, test} from '@playwright/test';
import {desktop, iPhone} from './__test_support';

for (const {reader, device} of [{reader: 'a phone', device: iPhone}, {reader: 'a desktop', device: desktop}]) {
  test.describe(reader, () => {
    test.use(device);

    test('meets the games page\'s first sentence at the top of the page', async ({page}) => {
      await page.goto('games');
      const sentence = page.getByText('One game so far.');
      await expect(sentence).toBeVisible();

      const main = await page.getByRole('main').boundingBox();
      const first = await sentence.boundingBox();

      expect((first?.y ?? Infinity) - (main?.y ?? 0)).toBeLessThanOrEqual(48);
      await expect(page.getByRole('link', {name: 'Three in a row'})).toBeVisible();
    });
  });
}
