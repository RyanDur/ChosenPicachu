import {expect, test} from '@playwright/test';
import {desktop, iPhone} from './__test_support';

for (const {reader, device} of [{reader: 'a phone', device: iPhone}, {reader: 'a desktop', device: desktop}]) {
  test.describe(reader, () => {
    test.use(device);

    test('meets the games page\'s first sentence on arrival', async ({page}) => {
      await page.goto('games');

      await expect(page.getByText('One game so far.')).toBeInViewport();
    });
  });
}
