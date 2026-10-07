import {Locator, expect, test} from '@playwright/test';
import {desktop, galleryPage, iPad13Upright, iPadSideways, iPadUpright, iPhone, phoneSideways, pressTab} from './__test_support';

const focusIsIn = (region: Locator): Promise<boolean> => region.evaluate(element => element.contains(document.activeElement));

const handhelds = [
  {reader: 'a phone', device: iPhone},
  {reader: 'a phone held sideways', device: phoneSideways}
];

for (const {reader, device} of handhelds) {
  test.describe(reader, () => {
    test.use(device);

    test('reads the search label in full once the settings are open', async ({page}) => {
      const gallery = galleryPage(page);
      await page.goto('gallery/?tab=vam');
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

    test('leaves no gallery settings panel beside the gallery', async ({page}) => {
      const gallery = galleryPage(page);
      await page.goto('gallery/?tab=vam');
      await expect(gallery.wall.first()).toBeVisible();

      await expect(gallery.settingsPanel).toHaveCount(0);
    });

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

    test('reads the museum and the page on the settings fold', async ({page}) => {
      const gallery = galleryPage(page);
      await page.goto('gallery/?tab=vam');

      await expect(gallery.settings).toContainText(/The Victoria and Albert Museum, page 1 of \d+/);
    });

    test('reads the search word on the settings fold once there is one', async ({page}) => {
      const gallery = galleryPage(page);
      await page.goto('gallery/?tab=vam&search=100%25');

      await expect(gallery.settings).toContainText('100%, page 1');
    });

    test('reads the next page on the settings fold after the arrow moves on', async ({page}) => {
      const gallery = galleryPage(page);
      await page.goto('gallery/?tab=vam');
      await expect(gallery.wall.first()).toBeVisible();

      await gallery.nextPage.tap();

      await expect(gallery.settings).toContainText(/, page 2(?!\d)/);
    });
  });
}

test.describe('a phone', () => {
  test.use(iPhone);

  test('has the first work of art begin within the top third of the screen', async ({page}) => {
    const gallery = galleryPage(page);
    await page.goto('gallery/?tab=vam');

    await expect.poll(async () => (await gallery.wall.first().boundingBox())?.y ?? Infinity)
      .toBeLessThanOrEqual(iPhone.viewport.height / 3);
  });
});

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

for (const {reader, device} of [
  {reader: 'an iPad held sideways', device: iPadSideways},
  {reader: 'a desktop', device: desktop},
  {reader: 'a short desktop window', device: {viewport: {width: 1300, height: 580}}}
]) {
  test.describe(reader, () => {
    test.use(device);

    test('shows the search and the page controls with no fold', async ({page}) => {
      const gallery = galleryPage(page);
      await page.goto('gallery/?tab=vam');
      await expect(gallery.wall.first()).toBeVisible();

      await expect(page.getByRole('banner').getByLabel(/Search For/)).toBeVisible();
      await expect(gallery.settingsPanel.getByLabel(/^Page #/)).toBeVisible();
      await expect(gallery.settings).toHaveCount(0);
    });
  });
}

test.describe('a desktop window made narrow', () => {
  test.use(desktop);

  test('folds the settings once it is a phone\'s width', async ({page}) => {
    const gallery = galleryPage(page);
    await page.goto('gallery/?tab=vam');
    await expect(gallery.settings).toHaveCount(0);

    await page.setViewportSize(iPhone.viewport);

    await expect(gallery.settings).toBeVisible();
  });
});

test.describe('a visitor at a desk', () => {
  test.use(desktop);

  test('should see each picture on the wall once it arrives', async ({page}) => {
    await page.goto('gallery/?tab=vam');
    const works = galleryPage(page).wall;
    await expect(works.first()).toBeVisible();

    for (const work of await works.all()) {
      await work.scrollIntoViewIfNeeded();
      const alt = await work.getByRole('img', {includeHidden: true}).first().getAttribute('alt') ?? '';
      await expect(work.getByRole('img', {name: alt, exact: true})).toBeVisible();
    }
  });
});

test.describe('a keyboard reader on a desktop', () => {
  test.use(desktop);

  test('meets the gallery right after the page controls', async ({page}) => {
    const gallery = galleryPage(page);
    await page.goto('gallery/?tab=vam');
    await expect(gallery.wall.first()).toBeVisible();
    await gallery.settingsPanel.getByRole('button', {name: 'Go'}).focus();

    await pressTab(page);

    await expect.poll(() => focusIsIn(page.getByRole('main'))).toBe(true);
  });
});

test.describe('a phone, while another museum has not answered', () => {
  test.use(iPhone);

  test('shows one loading bar from the first until the wall\'s first piece, then none', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.holdTheArtInstitute();
    await gallery.countTheLoadingBarsUntilTheFirstPiece();

    await page.goto('gallery?tab=vam');
    await expect(gallery.wall.first()).toBeVisible();

    const perFrame = await gallery.loadingBarsPerFrame();
    expect(perFrame).toContain(1);
    expect(perFrame.slice(perFrame.indexOf(1), -1).filter(bars => bars !== 1)).toEqual([]);
    await expect(page.getByRole('progressbar', {name: 'loading gallery'})).toHaveCount(0);
  });
});
