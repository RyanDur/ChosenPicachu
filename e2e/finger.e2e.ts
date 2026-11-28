import {Locator, Page, expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {accordions, chartsPage, contextChooser, demoSettings, fingerTap, foldsAFingerLeavesShut, galleryPage, popoverExhibit, recordPage, siteFrame, tablesDemo, zIndexTab} from './__test_support';
const opensFromAFingerOnItsName = async (page: Page, name: string): Promise<void> => {
  await page.goto('demos/accordions/');
  const fold = accordions.tab(page).htmlAloneFold(name);
  await expect(accordions.nameOn(fold.fold)).toBeVisible();

  await fingerTap(page, accordions.nameOn(fold.fold));

  await expect.poll(fold.isOpen).toBe(true);
};

const closesBasaltFromAFingerOnItsName = async (page: Page): Promise<void> => {
  await page.goto('demos/accordions/');
  const basalt = accordions.tab(page).htmlAloneFold('basalt');
  await expect.poll(basalt.isOpen).toBe(true);

  await fingerTap(page, accordions.nameOn(basalt.fold));

  await expect.poll(basalt.isOpen).toBe(false);
};

const opensFromAFinger = async (page: Page, fold: Locator): Promise<void> => {
  await fingerTap(page, fold.getByText(/\S/).first());
  await expect(fold).toHaveAttribute('open', '');
};

const opensAndClosesTheExplainer = async (page: Page): Promise<void> => {
  await page.goto('demos/charts/');
  const fold = chartsPage(page).explainer;
  const told = fold.getByRole('paragraph', {includeHidden: true}).first();
  await expect(fold).toBeVisible({timeout: 30_000});
  await expect(told).toBeHidden();

  await fingerTap(page, fold.getByText('what am I looking at?', {exact: true}));
  await expect(told).toBeVisible();

  await fingerTap(page, fold.getByText('what am I looking at?', {exact: true}));
  await expect(told).toBeHidden();
};

const choosesInTheOldWayMenu = async (page: Page): Promise<void> => {
  await page.goto('demos/z-index/what-else-forms-a-stacking-context/');
  await siteFrame(page).hydrated();
  const menu = contextChooser(page);

  await fingerTap(page, menu.sortBy);
  await expect(menu.choice('size')).toBeVisible();
  await fingerTap(page, menu.choice('size'));

  await expect(menu.sortBy).toHaveAccessibleName('Sort by: size, the old way');
};

const choosesInTheMenuInTheTopLayer = async (page: Page): Promise<void> => {
  await page.goto('demos/z-index/why-the-popover-wins/');
  await siteFrame(page).hydrated();
  const menu = popoverExhibit(page);

  await fingerTap(page, menu.sortBy);
  await expect(menu.list).toBeVisible();
  await fingerTap(page, menu.newest);

  await expect(menu.list).toBeHidden();
};

const givesCardOneItsNineThousand = async (page: Page): Promise<void> => {
  await page.goto('demos/z-index/why-the-popover-wins/');
  await siteFrame(page).hydrated();
  const menu = popoverExhibit(page);

  await fingerTap(page, menu.nineThousandWords);

  await expect(menu.nineThousand).toBeChecked();
};

const raisesABanner = async (page: Page): Promise<void> => {
  await page.goto('demos/z-index/lets-build-this-feature/');
  const banners = zIndexTab(page);
  await banners.raiser.click({trial: true});

  await fingerTap(page, banners.raiser);

  await expect(page.getByRole('alert').getByRole('button', {name: /^dismiss/})).toBeVisible();
};

const opensEveryFoldOnTheRecord = async (page: Page): Promise<void> => {
  await page.goto('record/');
  const record = recordPage(page);
  await expect(record.timelineStories.first()).toBeVisible();
  await expect(record.researchFold).toBeVisible();

  expect(await foldsAFingerLeavesShut(page, [...await record.timelineStories.all(), record.researchFold]))
    .toEqual([]);
};

const opensTheTablesSettings = async (page: Page): Promise<void> => {
  await page.goto('demos/tables/sort/');
  const settings = demoSettings(page).fold;
  await expect(settings).toBeVisible();

  await opensFromAFinger(page, settings);
};

const opensTheGallerySettings = async (page: Page): Promise<void> => {
  const gallery = galleryPage(page);
  await page.goto('gallery/?tab=vam');
  await expect(gallery.settings).toBeVisible();

  await fingerTap(page, gallery.settings.getByText(/\S/).first());

  await expect(gallery.sheet).toBeVisible();
};

const opensEveryHowIBuiltItFold = async (page: Page): Promise<void> => {
  await page.goto('demos/tables/the-live-table-and-the-store/');
  const reveals = await tablesDemo(page).howIBuiltItInTheFirstStory();
  await expect(reveals.first()).toBeVisible();

  expect(await foldsAFingerLeavesShut(page, await reveals.all())).toEqual([]);
};

const closesABanner = async (page: Page): Promise<void> => {
  await page.goto('demos/z-index/lets-build-this-feature/');
  await zIndexTab(page).raiser.tap();
  const dismiss = page.getByRole('alert').getByRole('button', {name: /^dismiss/}).first();
  await expect(dismiss).toBeVisible();

  await fingerTap(page, dismiss);

  await expect(page.getByRole('alert').getByRole('button', {name: /^dismiss/})).toHaveCount(0);
};

test.describe('a reader on a phone held upright', {tag: '@iPhone'}, () => {
  test('opens a page from a finger that lands just off a link in the nav', async ({page}) => {
    await page.goto('');
    await siteFrame(page).hydrated();
    await siteFrame(page).menu.tap();

    await fingerTap(page, siteFrame(page).nav.getByRole('link', {name: 'Users'}));

    await expect(page).toHaveURL(/users/);
  });
});

test.describe('a reader on a phone, upright or sideways', {tag: ['@iPhone', '@phoneSideways']}, () => {
  test('opens and closes what am I looking at with a finger that lands just off the line', ({page}) => opensAndClosesTheExplainer(page));

  test('raises a banner from a finger that lands just off Raise a banner', ({page}) => raisesABanner(page));

  test('the old-way menu on part 4 opens and chooses from a finger that lands just off its controls', ({page}) => choosesInTheOldWayMenu(page));

  test('the menu in the top layer opens and chooses from a finger that lands just off its controls', ({page}) => choosesInTheMenuInTheTopLayer(page));

  test('gives card one z-index 9999 with a finger that lands just off the checkbox’s words', ({page}) => givesCardOneItsNineThousand(page));

  test('opens every fold on the record from a finger that lands just off its bar', ({page}) => opensEveryFoldOnTheRecord(page));

  test('opens the settings fold on the tables tab from a finger that lands just off its bar', ({page}) => opensTheTablesSettings(page));

  test('opens the gallery settings from a finger that lands just off their tile', ({page}) => opensTheGallerySettings(page));

  test('opens every how I built it fold in an open story on the live table’s page from a finger that lands just off its bar', ({page}) => opensEveryHowIBuiltItFold(page));

  test('closes basalt, open at load in the accordion in HTML alone, from a finger that lands just off its name', ({page}) => closesBasaltFromAFingerOnItsName(page));

  test('opens cinder, in the accordion in HTML alone, from a finger that lands just off its name', ({page}) => opensFromAFingerOnItsName(page, 'cinder'));

  test('opens meadow, in the accordion in HTML alone, from a finger that lands just off its name', ({page}) => opensFromAFingerOnItsName(page, 'meadow'));

  test('closes a banner with a finger that lands just off its dismiss', ({page}) => closesABanner(page));
});
