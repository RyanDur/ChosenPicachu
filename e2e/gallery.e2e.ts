import {Locator, expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {desktop, documentScrollY, galleryPage, iPad13Upright, iPadSideways, iPadUpright, iPhone, phoneSideways, pressTab} from './__test_support';

const focusIsIn = (region: Locator): Promise<boolean> =>
  region.evaluate(element => element.contains(document.activeElement));

const handhelds = [
  {reader: 'a phone', device: iPhone},
  {reader: 'a phone held sideways', device: phoneSideways}
];

for (const {reader, device} of handhelds) {
  test.describe(reader, () => {
    test.use(device);

    test('reads the search label once the settings are open', async ({page}) => {
      const gallery = galleryPage(page);
      await page.goto('gallery/?tab=vam');
      await gallery.openSettings();
      await expect(gallery.searchField).toBeVisible();

      await expect(gallery.searchField).toHaveAccessibleName(/Search For/);
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

for (const {reader, device} of [{reader: 'an iPad held upright', device: iPadUpright}, {reader: 'a 13-inch iPad held upright', device: iPad13Upright}]) {
  test.describe(reader, () => {
    test.use(device);

    test('reads the search label', async ({page}) => {
      const gallery = galleryPage(page);
      await page.goto('gallery/?tab=vam');
      await expect(gallery.searchField).toBeVisible();

      await expect(gallery.searchField).toHaveAccessibleName(/Search For/);
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

    expect(await galleryPage(page).picturesNotShown()).toEqual([]);
  });

  test('keeps the focus on a piece whose picture arrives while it holds it', async ({page}) => {
    const gallery = galleryPage(page);
    const letThePicturesThrough = await gallery.holdEveryPicture();
    await page.goto('gallery/?tab=vam');
    const piece = gallery.wall.first().getByRole('link');
    await piece.focus();

    letThePicturesThrough();

    await expect(gallery.wall.first().getByRole('img')).toBeVisible();
    await expect(piece).toBeFocused();
  });

  test('lands at the top of the page it goes to from the page field', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.hangPageOneOnEveryPage();
    await page.goto('gallery/?tab=vam');
    await expect(gallery.wall.first()).toBeVisible();
    await gallery.wall.last().scrollIntoViewIfNeeded();
    await expect.poll(() => documentScrollY(page)).toBeGreaterThan(0);

    await gallery.pageNumber.fill('2');
    await gallery.go.click();
    await expect(page).toHaveURL(/page=2/);

    await expect.poll(() => documentScrollY(page)).toBe(0);
  });

  test('takes the loading sign off a piece once its picture arrives', async ({page}) => {
    const gallery = galleryPage(page);
    const letThePicturesThrough = await gallery.holdEveryPicture();
    await page.goto('gallery/?tab=vam');
    const work = gallery.wall.first();
    await expect(gallery.loadingSignOn(work)).toHaveCount(1);

    letThePicturesThrough();

    await expect(work.getByRole('img')).toBeVisible();
    await expect(gallery.loadingSignOn(work)).toHaveCount(0);
  });

  test('takes the loading sign off a piece whose picture will not load', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.refuseEveryPicture();
    const letThePicturesGo = await gallery.holdEveryPicture();
    await page.goto('gallery/?tab=vam');
    const work = gallery.wall.first();
    await expect(gallery.loadingSignOn(work)).toHaveCount(1);

    letThePicturesGo();

    await expect(gallery.standInOf(work)).toBeVisible();
    await expect(gallery.loadingSignOn(work)).toHaveCount(0);
  });

  test('shows a stand-in naming the piece when its picture will not load', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.refuseEveryPicture();
    await page.goto('gallery/?tab=vam');
    const work = gallery.wall.first();

    await expect(gallery.standInOf(work)).toBeVisible();
    const said = await gallery.standInOf(work).getAttribute('alt') ?? '';
    await expect(work).toHaveAccessibleName(said.replace(/ would not load$/, ''));
  });
});

test.describe('a phone held sideways, partway down the gallery', () => {
  test.use(phoneSideways);

  test('following NEXT opens the next page at its top', async ({page}) => {
    const gallery = galleryPage(page);
    await page.goto('gallery/?tab=vam');
    await expect(gallery.wall.first()).toBeVisible();
    await gallery.wall.last().scrollIntoViewIfNeeded();
    await gallery.nextPage.scrollIntoViewIfNeeded();
    await expect.poll(() => documentScrollY(page)).toBeGreaterThan(0);

    await gallery.nextPage.click();
    await expect(page).toHaveURL(/page=2/);

    await expect.poll(() => documentScrollY(page)).toBe(0);
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
