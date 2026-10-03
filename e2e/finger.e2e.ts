import {Page, expect, test} from '@playwright/test';
import {accordionsTab, bannerTrap, fingerTap, iPhone, nameOn, phoneSideways, shortOfAFinger, topLayerMenu, trappedMenu} from './__test_support';

const doorFold = (page: Page) => page.getByRole('group').filter({has: page.getByText('how I organize it', {exact: true})}).first();
const explainer = (page: Page) => page.getByRole('group').filter({has: page.getByText('what am I looking at?', {exact: true})}).first();

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
      const fold = doorFold(page);
      const told = fold.getByRole('paragraph', {includeHidden: true}).first();
      await expect(told).toBeHidden();

      await fingerTap(page, fold.getByText('how I organize it', {exact: true}));
      await expect(told).toBeVisible();

      await fingerTap(page, fold.getByText('how I organize it', {exact: true}));
      await expect(told).toBeHidden();
    });

    test('opens and closes what am I looking at with a finger that lands just off the line', async ({page}) => {
      await page.goto('demos/?tab=charts');
      const fold = explainer(page);
      const told = fold.getByRole('paragraph', {includeHidden: true}).first();
      await expect(fold).toBeVisible({timeout: 30_000});
      await expect(told).toBeHidden();

      await fingerTap(page, fold.getByText('what am I looking at?', {exact: true}));
      await expect(told).toBeVisible();

      await fingerTap(page, fold.getByText('what am I looking at?', {exact: true}));
      await expect(told).toBeHidden();
    });

    test('every control in the trap takes a finger', async ({page}) => {
      await page.goto('demos/?tab=z-index');
      const menu = trappedMenu(page);
      await menu.open();
      const controls = [menu.contextWords, menu.sortBy, menu.choice('name'), menu.choice('date'), menu.choice('size')];

      expect(await shortOfAFinger(controls)).toEqual([]);
    });

    test('the menu in the top layer and its choices take a finger', async ({page}) => {
      await page.goto('demos/?tab=z-index');
      const menu = topLayerMenu(page);
      await menu.open();
      const controls = [menu.sortBy, menu.choice('name'), menu.choice('date'), menu.choice('size')];

      expect(await shortOfAFinger(controls)).toEqual([]);
    });

    test('the banners\' buttons and the old banner\'s dismiss take a finger', async ({page}) => {
      await page.goto('demos/?tab=z-index');
      const banners = bannerTrap(page);
      await banners.raiseOld.click();
      const controls = [banners.raiseOld, banners.raiseNew, banners.dismissOld];

      expect(await shortOfAFinger(controls)).toEqual([]);
    });

    test('changes the trap with a finger that lands just off the checkbox\'s words', async ({page}) => {
      await page.goto('demos/?tab=z-index');
      const menu = trappedMenu(page);

      await fingerTap(page, menu.contextWords);

      await expect(menu.contextChoice).not.toBeChecked();
    });

    test('every fold of the accordion in HTML alone takes a finger', async ({page}) => {
      await page.goto('demos/?tab=accordions');
      const bars = accordionsTab(page).htmlAloneFolds().map(fold => nameOn(fold.fold));
      await expect(bars[0]).toBeVisible();

      expect(await shortOfAFinger(bars)).toEqual([]);
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
