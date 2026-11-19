import {Locator, expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {clickWhereItIs, desktop, documentScrollY, galleryPage, hydration, iPad13Upright, iPadSideways, iPadUpright, iPhone, phoneSideways, pressTab, siteFrame, twoFramesLater} from './__test_support';

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

    test('shows the first page in the gallery settings after a search made there from a later page', async ({page}) => {
      const gallery = galleryPage(page);
      await gallery.answerEveryWallFromTheRecording();
      await page.goto('gallery/?tab=vam&page=40');
      await gallery.openSettings();
      await gallery.searchField.fill('lilies');

      await gallery.searchField.press('Enter');

      await expect(page).toHaveURL(/[?&]page=1(&|$)/);
      await expect(gallery.pageNumber).toHaveValue('1');
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

    test('opens the gallery settings again on the number per page sent from them with Enter', async ({page}) => {
      const gallery = galleryPage(page);
      await gallery.answerEveryWallFromTheRecording();
      await page.goto('gallery/?tab=vam&size=30');
      await gallery.openSettings();
      await gallery.pageSize.fill('10');
      await gallery.pageSize.press('Enter');
      await expect(page).toHaveURL(/[?&]size=10(&|$)/);
      await page.keyboard.press('Escape');
      await expect(gallery.sheet).toBeHidden();

      await gallery.openSettings();

      await expect(gallery.pageSize).toHaveValue('10');
    });

    test('goes to the last page offered in the gallery settings on Enter, when the address\'s page is past it', async ({page}) => {
      const gallery = galleryPage(page);
      await gallery.answerEveryWallFromTheRecording();
      await page.goto('gallery/?tab=vam&page=99999&size=8');
      await expect(gallery.count).toHaveText(/ of 1,247$/);
      await gallery.openSettings();

      await gallery.pageNumber.press('Enter');

      await expect(page).toHaveURL(/[?&]page=1247(&|$)/);
    });

    test('keeps the reader in the page field after Enter in the gallery settings', async ({page}) => {
      const gallery = galleryPage(page);
      await gallery.answerEveryWallFromTheRecording();
      await page.goto('gallery/?tab=vam&page=3');
      await gallery.openSettings();
      await gallery.pageNumber.fill('2');

      await gallery.pageNumber.press('Enter');

      await expect(page).toHaveURL(/[?&]page=2(&|$)/);
      await expect(gallery.pageNumber).toBeFocused();
    });

    test('offers the last page in the gallery settings when the address\'s page is past it', async ({page}) => {
      const gallery = galleryPage(page);
      await gallery.answerEveryWallFromTheRecording();
      await page.goto('gallery/?tab=vam&page=99999&size=8');
      await expect(gallery.count).toHaveText(/ of 1,247$/);

      await gallery.openSettings();

      await expect(gallery.pageNumber).toHaveValue('1247');
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

    test('keeps the search when Escape empties the search field and then closes the gallery settings', async ({page}) => {
      const gallery = galleryPage(page);
      await gallery.answerEveryWallFromTheRecording();
      await page.goto('gallery/?tab=vam&search=roses&page=4');
      await gallery.openSettings();
      await gallery.searchField.focus();

      await gallery.searchField.press('Escape');
      await page.keyboard.press('Escape');

      await expect(gallery.sheet).toBeHidden();
      await expect(page).toHaveURL(/search=roses/);
      await expect(page).toHaveURL(/[?&]page=4(&|$)/);
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

      await page.touchscreen.tap(10, 10);

      await expect(gallery.sheet).toBeHidden();
      await expect(page).toHaveURL(/\?tab=vam$/);
    });

    test('goes to a page typed in the gallery settings once Escape closes them', async ({page}) => {
      const gallery = galleryPage(page);
      await gallery.answerEveryWallFromTheRecording();
      await page.goto('gallery/?tab=vam');
      await gallery.openSettings();
      await gallery.pageNumber.fill('2');

      await page.keyboard.press('Escape');

      await expect(page).toHaveURL(/page=2/);
    });

    test('goes to a page typed in the gallery settings once a tap outside closes them', async ({page}) => {
      const gallery = galleryPage(page);
      await gallery.answerEveryWallFromTheRecording();
      await page.goto('gallery/?tab=vam');
      await gallery.openSettings();
      await gallery.pageNumber.fill('2');

      await page.touchscreen.tap(10, 10);

      await expect(page).toHaveURL(/page=2/);
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
  test('leaves the gallery where it was when it is no longer a phone\'s width, with words typed in its settings and never sent', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.answerEveryWallFromTheRecording();
    await page.setViewportSize(iPhone.viewport);
    await page.goto('gallery/?tab=vam&page=3');
    await gallery.openSettings();
    await gallery.searchField.fill('lil');

    await page.setViewportSize(desktop.viewport);

    await expect(gallery.sheet).toBeHidden();
    await expect(page).not.toHaveURL(/search=/);
    await expect(page).toHaveURL(/[?&]page=3(&|$)/);
  });
});

test.describe('a visitor at a desk', () => {
  test.use(desktop);

  test('leaves the gallery with one Back after a reset over words never sent', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.answerEveryWallFromTheRecording();
    await page.goto('');
    await page.goto('gallery/?tab=vam&page=2');
    await siteFrame(page).hydrated();
    await gallery.searchField.fill('lil');
    await gallery.resetSearch.click();
    await expect(gallery.searchField).toHaveValue('');

    await page.goBack();

    await expect(page).not.toHaveURL(/gallery/);
  });

  test('goes back to the last page from the pager when the address\'s page is past it', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.answerEveryWallFromTheRecording();
    await page.goto('gallery/?tab=vam&page=99999&size=8');
    await expect(gallery.count).toHaveText(/ of 1,247$/);

    await gallery.previousPage.click();

    await expect(page).toHaveURL(/[?&]page=1247(&|$)/);
  });

  test('keeps the words sent from a piece\'s page in the search while the gallery loads', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.answerEveryWallFromTheRecording();
    await page.goto('gallery/O9138?tab=vam&search=roses');
    await siteFrame(page).hydrated();
    const galleryArrives = await gallery.holdTheScriptsStillToLoad();
    await gallery.searchField.fill('lilies');

    await gallery.searchField.press('Enter');

    await expect(gallery.searchField).toHaveValue('lilies');
    galleryArrives();
    await expect(page).toHaveURL(/[?&]search=lilies(&|$)/);
  });

  test('stays on its page when the museum it shows is tapped', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.answerEveryWallFromTheRecording();
    await page.goto('gallery/?tab=vam&page=40');
    await siteFrame(page).hydrated();

    await gallery.doors.filter({hasText: 'The Victoria and Albert Museum'}).click();

    await expect(page).toHaveURL(/[?&]page=40(&|$)/);
  });

  test('sends a page from an address whose size the per page field would refuse', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.answerEveryWallFromTheRecording();
    await page.goto('gallery/?tab=vam&size=200');
    await siteFrame(page).hydrated();
    await gallery.pageNumber.fill('3');

    await gallery.go.click();

    await expect(page).toHaveURL(/[?&]page=3(&|$)/);
  });

  test('sends a number per page from an address whose page the page field would refuse', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.answerEveryWallFromTheRecording();
    await page.goto('gallery/?tab=vam&page=0');
    await siteFrame(page).hydrated();
    await gallery.pageSize.fill('45');

    await gallery.go.click();

    await expect(page).toHaveURL(/[?&]size=45(&|$)/);
  });

  test('goes to a page that exists at the number per page sent with it', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.answerEveryWallFromTheRecording();
    await page.goto('gallery/?tab=vam&size=8');
    await siteFrame(page).hydrated();
    await expect(gallery.count).toHaveText(/ of 1,247$/);
    await gallery.pageSize.fill('4');
    await gallery.pageNumber.fill('2000');

    await gallery.go.click();

    await expect(page).toHaveURL(/[?&]page=2000(&|$)/);
    await expect(page).toHaveURL(/[?&]size=4(&|$)/);
  });

  test('goes to the last page when the page sent is past the end at the number per page sent with it', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.answerEveryWallFromTheRecording();
    await page.goto('gallery/?tab=vam&size=8');
    await siteFrame(page).hydrated();
    await expect(gallery.count).toHaveText(/ of 1,247$/);
    await gallery.pageSize.fill('100');
    await gallery.pageNumber.fill('2000');

    await gallery.go.click();

    await expect(page).toHaveURL(/[?&]page=100(&|$)/);
    await expect(page).toHaveURL(/[?&]size=100(&|$)/);
  });

  test('changes the number per page on a search that finds nothing', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.answerEverySearchWithNothing();
    await page.goto('gallery/?tab=vam&search=zzzz');
    await siteFrame(page).hydrated();
    await expect(gallery.emptyWall).toBeVisible();
    await gallery.pageSize.fill('10');

    await gallery.pageSize.press('Enter');

    await expect(page).toHaveURL(/[?&]size=10(&|$)/);
  });

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

  test('keeps the focus on the reset button after a keyboard reader clears a search with it', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.answerEveryWallFromTheRecording();
    await page.goto('gallery/?tab=vam&search=lilies');
    await siteFrame(page).hydrated();
    await gallery.resetSearch.focus();

    await gallery.resetSearch.press('Enter');

    await expect(page).not.toHaveURL(/search=/);
    await expect(gallery.searchField).toHaveValue('');
    await expect(gallery.resetSearch).toBeFocused();
  });

  test('shows the page the address is on in the page field', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.answerEveryWallFromTheRecording();

    await page.goto('gallery/?tab=vam&page=4');
    await siteFrame(page).hydrated();

    await expect(gallery.pageNumber).toHaveValue('4');
  });

  test('shows the page size the address asks for in the per page field', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.answerEveryWallFromTheRecording();

    await page.goto('gallery/?tab=vam&size=30');
    await siteFrame(page).hydrated();

    await expect(gallery.pageSize).toHaveValue('30');
  });

  test('keeps the focus and the letters of a reader who types in the search before the page\'s script runs', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.answerEveryWallFromTheRecording();
    await hydration(page).holdBack('gallery/?tab=vam&search=lilies');
    await page.goto('gallery/?tab=vam&search=lilies');
    await gallery.searchField.fill('roses');

    await hydration(page).release();
    await siteFrame(page).hydrated();

    await expect(gallery.searchField).toHaveValue('roses');
    await expect(gallery.searchField).toBeFocused();
  });

  test('keeps the focus and the number of a reader who types a page before the page\'s script runs', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.answerEveryWallFromTheRecording();
    await hydration(page).holdBack('gallery/?tab=vam&page=4&size=30');
    await page.goto('gallery/?tab=vam&page=4&size=30');
    await gallery.pageNumber.fill('7');

    await hydration(page).release();
    await siteFrame(page).hydrated();

    await expect(gallery.pageNumber).toHaveValue('7');
    await expect(gallery.pageNumber).toBeFocused();
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

  test('shows the address\'s words in the search after Back, not words typed and never sent', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.answerEveryWallFromTheRecording();
    await page.goto('gallery/?tab=vam&search=lilies');
    await siteFrame(page).hydrated();
    await gallery.searchField.fill('roses');
    const rosesAnswered = page.waitForResponse(response => new URL(response.url()).searchParams.get('q') === 'roses');
    await gallery.searchField.press('Enter');
    await rosesAnswered;
    await gallery.searchField.fill('tulips');

    await page.goBack();

    await expect(page).toHaveURL(/search=lilies/);
    await expect(gallery.searchField).toHaveValue('lilies');
  });

  test('opens a new search on its first page', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.answerEveryWallFromTheRecording();
    await page.goto('gallery/?tab=vam&page=40');
    await siteFrame(page).hydrated();

    await gallery.searchField.fill('lilies');
    await gallery.searchField.press('Enter');

    await expect(page).toHaveURL(/[?&]search=lilies/);
    await expect(page).toHaveURL(/[?&]page=1(&|$)/);
    await expect(gallery.count).toHaveText(/^Page 1 of /);
  });

  test('changes the number per page from an address whose page is past the last page', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.answerEveryWallFromTheRecording();
    await page.goto('gallery/?tab=vam&page=99999&size=8');
    await siteFrame(page).hydrated();
    await expect(gallery.count).toHaveText(/ of /);

    await gallery.pageSize.fill('25');
    await gallery.go.click();

    await expect(page).toHaveURL(/size=25/);
  });

  test('lands on the last page when a number per page puts the page past the end', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.answerEveryWallFromTheRecording();
    await page.goto('gallery/?tab=vam&page=500&size=8');
    await siteFrame(page).hydrated();
    await expect(gallery.count).toHaveText(/^Page 500 of /);

    await gallery.pageSize.fill('100');
    await gallery.go.click();

    await expect(page).toHaveURL(/[?&]page=100(&|$)/);
  });

  test('shows the address\'s page in the page field after the pager moves back to it, not a page typed and never sent', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.answerEveryWallFromTheRecording();
    await page.goto('gallery/?tab=vam&page=3&size=8');
    await siteFrame(page).hydrated();
    await gallery.pageNumber.fill('4');
    await gallery.go.click();
    await expect(page).toHaveURL(/[?&]page=4(&|$)/);
    await gallery.pageNumber.fill('9');

    await gallery.previousPage.click();

    await expect(page).toHaveURL(/[?&]page=3(&|$)/);
    await expect(gallery.pageNumber).toHaveValue('3');
  });

  test('shows the address\'s words in the search after Back between two searches made with Enter', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.answerEveryWallFromTheRecording();
    await page.goto('gallery/?tab=vam');
    await siteFrame(page).hydrated();
    await gallery.searchField.fill('roses');
    await gallery.searchField.press('Enter');
    await expect(page).toHaveURL(/search=roses/);
    await gallery.searchField.fill('tulips');
    await gallery.searchField.press('Enter');
    await expect(page).toHaveURL(/search=tulips/);
    await gallery.searchField.fill('daisies');

    await page.goBack();

    await expect(page).toHaveURL(/search=roses/);
    await expect(gallery.searchField).toHaveValue('roses');
  });

  test('shows the address\'s page in the page field after Back between two pages sent with Enter', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.answerEveryWallFromTheRecording();
    await page.goto('gallery/?tab=vam&page=2');
    await siteFrame(page).hydrated();
    await gallery.pageNumber.fill('3');
    await gallery.pageNumber.press('Enter');
    await expect(gallery.count).toHaveText(/^Page 3 of /);
    await gallery.pageNumber.fill('4');
    await gallery.pageNumber.press('Enter');
    await expect(gallery.count).toHaveText(/^Page 4 of /);

    await page.goBack();

    await expect(page).toHaveURL(/[?&]page=3(&|$)/);
    await expect(gallery.pageNumber).toHaveValue('3');
  });

  test('shows the address\'s page in the page field after Back, not a page typed and never sent', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.answerEveryWallFromTheRecording();
    await page.goto('gallery/?tab=vam&page=2');
    await siteFrame(page).hydrated();
    await gallery.pageNumber.fill('3');
    await gallery.pageNumber.press('Enter');
    await expect(gallery.count).toHaveText(/^Page 3 of /);
    await gallery.pageNumber.fill('9');

    await page.goBack();

    await expect(page).toHaveURL(/page=2/);
    await expect(gallery.pageNumber).toHaveValue('2');
  });

  test('keeps the focus on the page field after going to a page with Enter', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.answerEveryWallFromTheRecording();
    await page.goto('gallery/?tab=vam');
    await siteFrame(page).hydrated();
    await gallery.pageNumber.fill('2');

    await gallery.pageNumber.press('Enter');

    await expect(page).toHaveURL(/page=2/);
    await expect(gallery.pageNumber).toBeFocused();
  });

  test('shows the page it went to in the page field after Enter', async ({page}) => {
    const gallery = galleryPage(page);
    await gallery.answerEveryWallFromTheRecording();
    await page.goto('gallery/?tab=vam');
    await siteFrame(page).hydrated();
    await gallery.pageNumber.fill('2');

    await gallery.pageNumber.press('Enter');

    await expect(page).toHaveURL(/[?&]page=2(&|$)/);
    await expect(gallery.pageNumber).toHaveValue('2');
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
