import {expect, test} from '@playwright/test';
import {desktop, iPhone} from './__test_support';

for (const {reader, device} of [{reader: 'a phone', device: iPhone}, {reader: 'a desktop', device: desktop}]) {
  test.describe(reader, () => {
    test.use(device);

    test('meets the games page\'s first sentence at the top of the page', async ({page}) => {
      await page.goto('games');
      const sentence = page.getByText('One game so far.');
      await expect(sentence).toBeVisible();

      const gapBelowTheTop = async (): Promise<number> =>
        ((await sentence.boundingBox())?.y ?? Infinity) - ((await page.getByRole('main').boundingBox())?.y ?? 0);

      await expect.poll(gapBelowTheTop).toBeLessThanOrEqual(48);
    });
  });
}
