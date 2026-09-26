import {expect, test} from '@playwright/test';
import {chartsPage, fingerTap, galleryPage, iPadUpright, iPhone, phoneSideways, sortableList, usersPage} from './__test_support';

for (const {reader, device} of [{reader: 'an iPad held upright', device: iPadUpright}, {reader: 'a phone', device: iPhone}]) {
  test.describe(reader, () => {
    test.use(device);

    test('lifts a list item from a press just beside its grip and moves it to a new seat', async ({page}) => {
      const list = sortableList(page);
      await page.goto('demos/?tab=dragAndDrop');
      await expect(list.items.first()).toBeVisible();
      const first = await list.items.first().textContent();

      await list.pressBesideAGripAndDropOnItsNeighbour();

      await expect.poll(() => list.items.first().textContent()).not.toBe(first);
    });

    test('opens a row\'s actions from a finger that lands just off the toggle', async ({page}) => {
      const users = usersPage(page);
      await page.goto('users');
      await expect(users.firstRowActions).toBeVisible({timeout: 30_000});

      await fingerTap(page, users.firstRowActions);

      await expect(await users.actionsOf()).toBeVisible();
    });

    test('changes the price period from a finger that lands just off the toggle', async ({page}) => {
      const charts = chartsPage(page);
      await page.goto('demos/?tab=charts');
      await expect(charts.periodToggle).toBeVisible({timeout: 30_000});

      await fingerTap(page, charts.periodToggle);
      await charts.period('week').tap();

      await expect(charts.periodToggle).toContainText('week');
    });
  });
}

test.describe('a phone held sideways', () => {
  test.use(phoneSideways);

  test('runs and clears a search from fingers that land just off submit and reset', async ({page}) => {
    const gallery = galleryPage(page);
    await page.goto('gallery/?tab=vam');
    await gallery.openSettings();
    await gallery.searchField.fill('flowers');

    await fingerTap(page, gallery.submitSearch);
    await expect(page).toHaveURL(/search=flowers/);

    await gallery.openSettings();
    await fingerTap(page, gallery.resetSearch);
    await expect(page).not.toHaveURL(/search=/);
  });
});
