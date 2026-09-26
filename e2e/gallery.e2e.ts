import {expect, test} from '@playwright/test';
import {galleryPage, iPad13Upright, iPadUpright, phoneSideways} from './__test_support';

const readers = [
  {reader: 'a phone held sideways', device: phoneSideways},
  {reader: 'an iPad held upright', device: iPadUpright},
  {reader: 'a 13-inch iPad held upright', device: iPad13Upright}
];

for (const {reader, device} of readers) {
  test.describe(reader, () => {
    test.use(device);

    test('reads the search label in full, and a tap on it lands in the field', async ({page}) => {
      const gallery = galleryPage(page);
      await page.goto('gallery/?tab=vam');
      await expect(gallery.searchField).toBeVisible();

      await expect.poll(gallery.searchLabelReadsInFull).toBe(true);

      await gallery.tapSearchLabel();
      await expect(gallery.searchField).toBeFocused();
    });
  });
}
