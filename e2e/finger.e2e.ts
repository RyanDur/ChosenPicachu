import {Locator, Page, expect, test} from '@playwright/test';
import {accordionsTab, bannerTrap, chartsPage, demoSettings, fingerTap, galleryPage, homePage, iPhone, nameOn, phoneSideways, tablesDemo, topLayerMenu, trappedMenu} from './__test_support';
const opensFromAFinger = async (page: Page, fold: Locator): Promise<void> => {
  await fingerTap(page, fold.getByText(/\S/).first());
  await expect(fold).toHaveAttribute('open', '');
};

for (const {reader, device} of [{reader: 'a phone', device: iPhone}, {reader: 'a phone held sideways', device: phoneSideways}]) {
  test.describe(reader, () => {
    test.use(device);

    test('opens a page from a finger that lands just off a link in the nav', async ({page}) => {
      await page.goto('');

      await fingerTap(page, page.getByRole('navigation', {name: 'site'}).getByRole('link', {name: 'Users'}));

      await expect(page).toHaveURL(/users/);
    });

    test('opens and closes how I organize it with a finger that lands just off the line', async ({page}) => {
      await page.goto('');
      const home = homePage(page);
      const fold = home.doorFolds.first();
      const told = fold.getByRole('paragraph', {includeHidden: true}).first();
      await expect(told).toBeHidden();

      await fingerTap(page, home.doorSummaryOf(fold));
      await expect(told).toBeVisible();

      await fingerTap(page, home.doorSummaryOf(fold));
      await expect(told).toBeHidden();
    });

    test('opens and closes what am I looking at with a finger that lands just off the line', async ({page}) => {
      await page.goto('demos/?tab=charts');
      const fold = chartsPage(page).explainer;
      const told = fold.getByRole('paragraph', {includeHidden: true}).first();
      await expect(fold).toBeVisible({timeout: 30_000});
      await expect(told).toBeHidden();

      await fingerTap(page, fold.getByText('what am I looking at?', {exact: true}));
      await expect(told).toBeVisible();

      await fingerTap(page, fold.getByText('what am I looking at?', {exact: true}));
      await expect(told).toBeHidden();
    });

    test('the trap\'s menu opens and chooses from a finger that lands just off its controls', async ({page}) => {
      await page.goto('demos/?tab=z-index');
      const menu = trappedMenu(page);

      await fingerTap(page, menu.sortBy);
      await expect(menu.choice('size')).toBeVisible();
      await fingerTap(page, menu.choice('size'));

      await expect(menu.sortBy).toHaveAccessibleName('Sort by: size, the old way');
    });

    test('the menu in the top layer opens and chooses from a finger that lands just off its controls', async ({page}) => {
      await page.goto('demos/?tab=z-index');
      const menu = topLayerMenu(page);
      await menu.sortBy.evaluate(button => button.scrollIntoView({block: 'center'}));

      await fingerTap(page, menu.sortBy);
      await expect(menu.menu).toBeVisible();
      await fingerTap(page, menu.choice('size'));

      await expect(menu.sortBy).toHaveAccessibleName('Sort by: size, in the top layer');
    });

    test('raises and dismisses the banners from a finger that lands just off their buttons', async ({page}) => {
      await page.goto('demos/?tab=z-index');
      const banners = bannerTrap(page);

      await fingerTap(page, banners.raiseOld);
      await expect(banners.oldBanner).toBeVisible();
      await fingerTap(page, banners.dismissOld);
      await expect(banners.oldBanner).toBeHidden();
      await fingerTap(page, banners.raiseNew);

      await expect(page.getByRole('alert').getByRole('button', {name: /^dismiss/})).toBeVisible();
    });

    test('changes the trap with a finger that lands just off the checkbox\'s words', async ({page}) => {
      await page.goto('demos/?tab=z-index');
      const menu = trappedMenu(page);

      await fingerTap(page, menu.contextWords);

      await expect(menu.contextChoice).not.toBeChecked();
    });

    test('opens every fold on home from a finger that lands just off its bar', async ({page}) => {
      await page.goto('');
      const home = homePage(page);
      await expect(home.timelineStories.first()).toBeVisible();
      await expect(home.researchFold).toBeVisible();

      for (const fold of [...await home.timelineStories.all(), ...await home.doorFolds.all(), home.researchFold]) {
        await opensFromAFinger(page, fold);
      }
    });

    test('opens the settings fold on the drag sort tab from a finger that lands just off its bar', async ({page}) => {
      await page.goto('demos/?tab=dragAndDrop');
      const settings = demoSettings(page).fold;
      await expect(settings).toBeVisible();

      await opensFromAFinger(page, settings);
    });

    test('opens the gallery’s settings fold from a finger that lands just off its bar', async ({page}) => {
      await page.goto('gallery/?tab=vam');
      const settings = galleryPage(page).settings;
      await expect(settings).toBeVisible();

      await opensFromAFinger(page, settings);
    });

    test('opens every how we built it fold in an open story on the tables tab from a finger that lands just off its bar', async ({page}) => {
      await page.goto('demos/?tab=tables');
      const reveals = await tablesDemo(page).howWeBuiltItInTheFirstStory();
      await expect(reveals.first()).toBeVisible();

      for (const fold of await reveals.all()) {
        await opensFromAFinger(page, fold);
      }
    });

    test('opens every fold of the accordion in HTML alone from a finger that lands just off its name', async ({page}) => {
      await page.goto('demos/?tab=accordions');
      const folds = accordionsTab(page).htmlAloneFolds();
      await expect(nameOn(folds[0].fold)).toBeVisible();

      for (const fold of folds) {
        await fingerTap(page, nameOn(fold.fold));
        await expect.poll(fold.isOpen).toBe(true);
      }
    });

    test('closes a banner with a finger that lands just off its dismiss', async ({page}) => {
      await page.goto('demos/?tab=z-index');
      await bannerTrap(page).raiseNew.tap();
      const dismiss = page.getByRole('alert').getByRole('button', {name: /^dismiss/}).first();
      await expect(dismiss).toBeVisible();

      await fingerTap(page, dismiss);

      await expect(page.getByRole('alert').getByRole('button', {name: /^dismiss/})).toHaveCount(0);
    });
  });
}
