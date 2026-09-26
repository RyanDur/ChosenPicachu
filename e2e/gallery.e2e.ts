import {expect, test} from '@playwright/test';
import {desktop, galleryPage, iPad13Upright, iPadSideways, iPadUpright, iPhone, phoneSideways} from './__test_support';

for (const {reader, device} of [{reader: 'a phone', device: iPhone}, {reader: 'a phone held sideways', device: phoneSideways}]) {
  test.describe(reader, () => {
    test.use(device);

    test('reads the search label in full once the settings are open', async ({page}) => {
      const gallery = galleryPage(page);
      await page.goto('gallery/?tab=vam');
      await expect(gallery.settings).toBeVisible();
      await gallery.openSettings();
      await expect(gallery.searchField).toBeVisible();

      await expect.poll(gallery.searchLabelReadsInFull).toBe(true);
    });

    test('lands in the search field from a tap on its label', async ({page}) => {
      const gallery = galleryPage(page);
      await page.goto('gallery/?tab=vam');
      await gallery.openSettings();
      await expect(gallery.searchField).toBeVisible();

      await gallery.tapSearchLabel();
      await expect(gallery.searchField).toBeFocused();
    });
  });
}

for (const {reader, device} of [{reader: 'an iPad held upright', device: iPadUpright}, {reader: 'a 13-inch iPad held upright', device: iPad13Upright}]) {
  test.describe(reader, () => {
    test.use(device);

    test('reads the search label in full', async ({page}) => {
      const gallery = galleryPage(page);
      await page.goto('gallery/?tab=vam');
      await expect(gallery.searchField).toBeVisible();

      await expect.poll(gallery.searchLabelReadsInFull).toBe(true);
    });

    test('lands in the search field from a tap on its label', async ({page}) => {
      const gallery = galleryPage(page);
      await page.goto('gallery/?tab=vam');
      await expect(gallery.searchField).toBeVisible();

      await gallery.tapSearchLabel();
      await expect(gallery.searchField).toBeFocused();
    });
  });
}

const handhelds = [
  {reader: 'a phone', device: iPhone},
  {reader: 'a phone held sideways', device: phoneSideways}
];

for (const {reader, device} of handhelds) {
  test.describe(reader, () => {
    test.use(device);

    test('shows a work of art on the first screen', async ({page}) => {
      const gallery = galleryPage(page);
      await page.goto('gallery/?tab=vam');

      await expect(gallery.wall.first()).toBeInViewport({ratio: 0.5});
    });

    test('has the search, the page number and the page size within one tap of the first screen', async ({page}) => {
      const gallery = galleryPage(page);
      await page.goto('gallery/?tab=vam');
      await expect(gallery.wall.first()).toBeVisible();

      await expect(gallery.settings).toBeInViewport();
      await gallery.openSettings();

      await expect(gallery.searchField).toBeVisible();
      await expect(gallery.pageNumber).toBeVisible();
      await expect(gallery.pageSize).toBeVisible();
    });

    test('reads the museum and the page on the settings fold, and the search word once there is one', async ({page}) => {
      const gallery = galleryPage(page);
      await page.goto('gallery/?tab=vam');
      await expect(gallery.wall.first()).toBeVisible();
      await expect(gallery.settings).toContainText('The Victoria and Albert Museum');
      await expect(gallery.settings).toContainText('page 1 of');

      await page.goto('gallery/?tab=vam&search=flowers');

      await expect(gallery.settings).toContainText('flowers');
      await expect(gallery.settings).toContainText('page 1');
    });
  });
}

test.describe('a phone', () => {
  test.use(iPhone);

  test('has the first work of art begin within the top third of the screen', async ({page}) => {
    const gallery = galleryPage(page);
    await page.goto('gallery/?tab=vam');
    await expect(gallery.wall.first()).toBeVisible();

    const art = await gallery.wall.first().boundingBox();
    expect(art).not.toBeNull();
    expect(art === null ? Infinity : art.y).toBeLessThanOrEqual(iPhone.viewport.height / 3);
  });
});

for (const {reader, device} of [{reader: 'an iPad held sideways', device: iPadSideways}, {reader: 'a desktop', device: desktop}]) {
  test.describe(reader, () => {
    test.use(device);

    test('keeps the search band and the page controls where they were', async ({page}) => {
      const gallery = galleryPage(page);
      await page.goto('gallery/?tab=vam');
      await expect(gallery.wall.first()).toBeVisible();

      await expect(gallery.searchField).toBeVisible();
      await expect(gallery.pageNumber).toBeVisible();
      await expect(gallery.settings).toHaveCount(0);
    });
  });
}
