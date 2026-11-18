import {Locator, expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {clickWhereItIs, desktop, documentScrollY, galleryPage, iPad13Upright, iPadSideways, iPadUpright, iPhone, phoneSideways, pressTab, siteFrame, twoFramesLater} from './__test_support';

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

      await expect(gallery.searchField).toHaveAccessibleName('Search');
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

    test('reads the museum on the Gallery settings button', async ({page}) => {
      const gallery = galleryPage(page);
      await page.goto('gallery/?tab=vam');

      await expect(gallery.settings).toContainText('The Victoria and Albert Museum');
    });

    test('reads the search word in quotes on the Gallery settings button once there is one', async ({page}) => {
      const gallery = galleryPage(page);
      await page.goto('gallery/?tab=vam&search=100%25');

      await expect(gallery.settings).toContainText('“100%”');
    });

    test('names the Gallery settings button with the words it shows', async ({page}) => {
      const gallery = galleryPage(page);
      await page.goto('gallery/?tab=vam&search=100%25');

      await expect(gallery.settings).toHaveAccessibleName('Gallery settings: The Victoria and Albert Museum, 100%');
    });

    test('reads the next page on the pager after the arrow moves on', async ({page}) => {
      const gallery = galleryPage(page);
      await gallery.hangPageOneOnEveryPage();
      await page.goto('gallery/?tab=vam');
      await expect(gallery.wall.first()).toBeVisible();

      await gallery.nextPage.tap();

      await expect(gallery.count).toHaveText(/^Page 2 of /);
    });

    test('opens the gallery settings on the museum the gallery shows', async ({page}) => {
      const gallery = galleryPage(page);
      await page.goto('gallery/?tab=vam');

      await gallery.openSettings();

      await expect(gallery.museum.getByRole('option', {selected: true})).toHaveText('The Victoria and Albert Museum');
    });

    test('shows another museum\'s pieces once it is chosen, with the settings still open on the choice', async ({page}) => {
      const gallery = galleryPage(page);
      await page.goto('gallery/?tab=vam&page=1&size=8');
      await gallery.openSettings();
      await gallery.museum.focus();

      await gallery.museum.selectOption({label: 'Harvard Art Museums'});

      await expect(page).toHaveURL(/tab=harvard/);
      await expect(gallery.wall.first()).toBeVisible();
      await expect(gallery.sheet).toBeVisible();
      await expect(gallery.museum).toBeFocused();
    });

    test('leaves the museum tabs to the gallery settings', async ({page}) => {
      const gallery = galleryPage(page);
      await page.goto('gallery/?tab=vam');
      await expect(gallery.wall.first()).toBeVisible();

      await expect(gallery.doors.first()).toBeHidden();
    });

    test('searches from the gallery settings on Enter, with them still open on the search', async ({page}) => {
      const gallery = galleryPage(page);
      await gallery.answerEveryWallFromTheRecording();
      await page.goto('gallery/?tab=vam');
      await gallery.openSettings();
      await gallery.searchField.fill('lilies');

      await gallery.searchField.press('Enter');

      await expect(page).toHaveURL(/search=lilies/);
      await expect(gallery.sheet).toBeVisible();
      await expect(gallery.searchField).toBeFocused();
    });

    test('closes the gallery settings on Back from a search made there, and opens them again on the address\'s words', async ({page}) => {
      const gallery = galleryPage(page);
      await gallery.answerEveryWallFromTheRecording();
      await page.goto('gallery/?tab=vam');
      await gallery.openSettings();
      await gallery.searchField.fill('lilies');
      await gallery.searchField.press('Enter');
      await expect(page).toHaveURL(/search=lilies/);

      await page.goBack();

      await expect(page).not.toHaveURL(/search=/);
      await expect(gallery.sheet).toBeHidden();
      await gallery.openSettings();
      await expect(gallery.searchField).toHaveValue('');
    });

    test('waits for Enter before searching the words typed in the gallery settings', async ({page}) => {
      const gallery = galleryPage(page);
      await gallery.answerEveryWallFromTheRecording();
      await page.goto('gallery/?tab=vam');
      await gallery.openSettings();

      await gallery.searchField.pressSequentially('lilies');

      await expect(gallery.searchField).toHaveValue('lilies');
      await expect(page).not.toHaveURL(/search=/);
    });

    test('goes to the page typed in the gallery settings once the reader leaves the field', async ({page}) => {
      const gallery = galleryPage(page);
      await gallery.answerEveryWallFromTheRecording();
      await page.goto('gallery/?tab=vam');
      await gallery.openSettings();
      await gallery.pageNumber.fill('2');

      await gallery.pageNumber.press('Tab');

      await expect(page).toHaveURL(/page=2/);
      await expect(gallery.sheet).toBeVisible();
    });

    test('shows the number per page typed in the gallery settings on Enter', async ({page}) => {
      const gallery = galleryPage(page);
      await gallery.answerEveryWallFromTheRecording();
      await page.goto('gallery/?tab=vam');
      await gallery.openSettings();
      await gallery.pageSize.fill('12');

      await gallery.pageSize.press('Enter');

      await expect(page).toHaveURL(/size=12/);
    });

    test('puts back the page it is on when the reader leaves a page past the last', async ({page}) => {
      const gallery = galleryPage(page);
      await gallery.answerEveryWallFromTheRecording();
      await page.goto('gallery/?tab=vam&page=3');
      await expect(gallery.count).toHaveText(/^Page 3 of /);
      await gallery.openSettings();
      await gallery.pageNumber.fill('999999');

      await gallery.pageNumber.press('Tab');

      await expect(gallery.pageNumber).toHaveValue('3');
      await expect(page).toHaveURL(/page=3/);
    });

    test('keeps a refused page in the field on Enter, for the browser to say why, with the gallery where it was', async ({page}) => {
      const gallery = galleryPage(page);
      await gallery.answerEveryWallFromTheRecording();
      await page.goto('gallery/?tab=vam&page=3');
      await expect(gallery.count).toHaveText(/^Page 3 of /);
      await gallery.openSettings();
      await gallery.pageNumber.fill('0');

      await gallery.pageNumber.press('Enter');

      await expect(gallery.pageNumber).toHaveValue('0');
      await expect(gallery.pageNumber).toBeFocused();
      await expect(page).toHaveURL(/page=3/);
    });

    test('asks for no button to apply the gallery settings', async ({page}) => {
      const gallery = galleryPage(page);
      await page.goto('gallery/?tab=vam');

      await gallery.openSettings();

      await expect(gallery.sheet.getByRole('button')).toHaveCount(0);
    });

    test('Escape closes the gallery settings', async ({page}) => {
      const gallery = galleryPage(page);
      await page.goto('gallery/?tab=vam');
      await gallery.openSettings();

      await page.keyboard.press('Escape');

      await expect(gallery.sheet).toBeHidden();
    });

    test('a tap outside the gallery settings closes them, with the gallery where it was', async ({page}) => {
      const gallery = galleryPage(page);
      await page.goto('gallery/?tab=vam');
      await expect(gallery.wall.first()).toBeVisible();
      await gallery.openSettings();
      await page.evaluate(() => window.scrollTo(0, 200));
      const scrolledTo = await documentScrollY(page);

      await page.touchscreen.tap(10, 10);

      await expect(gallery.sheet).toBeHidden();
      expect(await documentScrollY(page)).toBe(scrolledTo);
    });
  });
}

test.describe('a phone held upright', () => {
  test.use(iPhone);

  test('pages on from the pager while partway down the wall', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.hangPageOneOnEveryPage();
    await page.goto('gallery/?tab=vam');
    await expect(gallery.wall.first()).toBeVisible();
    await gallery.wall.nth(Math.floor(await gallery.wall.count() / 2)).scrollIntoViewIfNeeded();
    await twoFramesLater(page);

    await clickWhereItIs(page, gallery.nextPage);

    await expect(gallery.count).toHaveText(/^Page 2 of /);
  });
});

for (const {reader, device} of [{reader: 'an iPad held upright', device: iPadUpright}, {reader: 'a 13-inch iPad held upright', device: iPad13Upright}]) {
  test.describe(reader, () => {
    test.use(device);

    test('reads the search label', async ({page}) => {
      const gallery = galleryPage(page);
      await page.goto('gallery/?tab=vam');
      await expect(gallery.searchField).toBeVisible();

      await expect(gallery.searchField).toHaveAccessibleName('Search');
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

    test('shows the search and the page controls with no Gallery settings button', async ({page}) => {
      const gallery = galleryPage(page);
      await page.goto('gallery/?tab=vam');
      await expect(gallery.wall.first()).toBeVisible();

      await expect(page.getByRole('banner').getByRole('combobox', {name: 'Search', exact: true})).toBeVisible();
      await expect(gallery.settingsPanel.getByRole('spinbutton', {name: 'Page', exact: true})).toBeVisible();
      await expect(gallery.settings).toBeHidden();
    });

    test('shows the museum tabs', async ({page}) => {
      const gallery = galleryPage(page);
      await page.goto('gallery/?tab=vam');

      await expect(gallery.doors.first()).toBeVisible();
    });
  });
}

test.describe('a desktop window made narrow', () => {
  test.use(desktop);

  test('offers the Gallery settings once it is a phone\'s width', async ({page}) => {
    const gallery = galleryPage(page);
    await page.goto('gallery/?tab=vam');
    await expect(gallery.settings).toBeHidden();

    await page.setViewportSize(iPhone.viewport);

    await expect(gallery.settings).toBeVisible();
  });

  test('closes the gallery settings once it is no longer a phone\'s width', async ({page}) => {
    const gallery = galleryPage(page);
    await page.setViewportSize(iPhone.viewport);
    await page.goto('gallery/?tab=vam');
    await gallery.openSettings();

    await page.setViewportSize(desktop.viewport);

    await expect(gallery.sheet).toBeHidden();
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

  test('keeps the focus on the search after searching with Enter', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.answerEveryWallFromTheRecording();
    await page.goto('gallery/?tab=vam');
    await siteFrame(page).hydrated();
    await gallery.searchField.fill('lilies');

    await gallery.searchField.press('Enter');

    await expect(page).toHaveURL(/search=lilies/);
    await expect(gallery.searchField).toBeFocused();
  });

  test('shows the address\'s words in the search after Back and then Forward from a search made with Enter', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.answerEveryWallFromTheRecording();
    await page.goto('gallery/?tab=vam');
    await siteFrame(page).hydrated();
    await gallery.searchField.fill('lilies');
    await gallery.searchField.press('Enter');
    await expect(page).toHaveURL(/search=lilies/);

    await page.goBack();
    await expect(page).not.toHaveURL(/search=/);
    await expect(gallery.searchField).toHaveValue('');
    await page.goForward();

    await expect(page).toHaveURL(/search=lilies/);
    await expect(gallery.searchField).toHaveValue('lilies');
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
