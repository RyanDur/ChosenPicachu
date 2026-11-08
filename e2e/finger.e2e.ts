import {Locator, Page, expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {accordionsTab, bannerTrap, chartsPage, demoSettings, fingerTap, foldsAFingerLeavesShut, galleryPage, iPhone, nameOn, phoneSideways, recordPage, tablesDemo, topLayerMenu, trappedMenu} from './__test_support';
const opensFromAFingerOnItsName = async (page: Page, name: string): Promise<void> => {
  await page.goto('demos/accordions/');
  const fold = accordionsTab(page).htmlAloneFold(name);
  await expect(nameOn(fold.fold)).toBeVisible();

  await fingerTap(page, nameOn(fold.fold));

  await expect.poll(fold.isOpen).toBe(true);
};

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

    test('opens and closes what am I looking at with a finger that lands just off the line', async ({page}) => {
      await page.goto('demos/charts/');
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
      await page.goto('demos/z-index/');
      const menu = trappedMenu(page);

      await fingerTap(page, menu.sortBy);
      await expect(menu.choice('size')).toBeVisible();
      await fingerTap(page, menu.choice('size'));

      await expect(menu.sortBy).toHaveAccessibleName('Sort by: size, the old way');
    });

    test('the menu in the top layer opens and chooses from a finger that lands just off its controls', async ({page}) => {
      await page.goto('demos/z-index/');
      const menu = topLayerMenu(page);
      await menu.sortBy.evaluate(button => button.scrollIntoView({block: 'center'}));

      await fingerTap(page, menu.sortBy);
      await expect(menu.menu).toBeVisible();
      await fingerTap(page, menu.choice('size'));

      await expect(menu.sortBy).toHaveAccessibleName('Sort by: size, in the top layer');
    });

    test('raises and dismisses the banners from a finger that lands just off their buttons', async ({page}) => {
      await page.goto('demos/z-index/');
      const banners = bannerTrap(page);

      await fingerTap(page, banners.raiseOld);
      await expect(banners.oldBanner).toBeVisible();
      await fingerTap(page, banners.dismissOld);
      await expect(banners.oldBanner).toBeHidden();
      await fingerTap(page, banners.raiseSite);

      await expect(page.getByRole('alert').getByRole('button', {name: /^dismiss/})).toBeVisible();
    });

    test('changes the trap with a finger that lands just off the checkbox\'s words', async ({page}) => {
      await page.goto('demos/z-index/');
      const menu = trappedMenu(page);

      await fingerTap(page, menu.contextWords);

      await expect(menu.contextChoice).not.toBeChecked();
    });

    test('opens every fold on the record from a finger that lands just off its bar', async ({page}) => {
      await page.goto('record/');
      const record = recordPage(page);
      await expect(record.timelineStories.first()).toBeVisible();
      await expect(record.researchFold).toBeVisible();

      expect(await foldsAFingerLeavesShut(page, [...await record.timelineStories.all(), record.researchFold]))
        .toEqual([]);
    });

    test('opens the settings fold on the drag sort tab from a finger that lands just off its bar', async ({page}) => {
      await page.goto('demos/drag-and-drop/');
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

    test('opens every how I built it fold in an open story on the tables tab from a finger that lands just off its bar', async ({page}) => {
      await page.goto('demos/tables/');
      const reveals = await tablesDemo(page).howIBuiltItInTheFirstStory();
      await expect(reveals.first()).toBeVisible();

      expect(await foldsAFingerLeavesShut(page, await reveals.all())).toEqual([]);
    });

    test('opens basalt, in the accordion in HTML alone, from a finger that lands just off its name', async ({page}) => {
      await opensFromAFingerOnItsName(page, 'basalt');
    });

    test('opens cinder, in the accordion in HTML alone, from a finger that lands just off its name', async ({page}) => {
      await opensFromAFingerOnItsName(page, 'cinder');
    });

    test('opens meadow, in the accordion in HTML alone, from a finger that lands just off its name', async ({page}) => {
      await opensFromAFingerOnItsName(page, 'meadow');
    });

    test('closes a banner with a finger that lands just off its dismiss', async ({page}) => {
      await page.goto('demos/z-index/');
      await bannerTrap(page).raiseSite.tap();
      const dismiss = page.getByRole('alert').getByRole('button', {name: /^dismiss/}).first();
      await expect(dismiss).toBeVisible();

      await fingerTap(page, dismiss);

      await expect(page.getByRole('alert').getByRole('button', {name: /^dismiss/})).toHaveCount(0);
    });
  });
}
