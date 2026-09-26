import {Page, expect, test} from '@playwright/test';
import {chartsPage, desktop, fingerTap, galleryPage, iPadUpright, iPhone, phoneSideways} from './__test_support';

const justMissedBy = 21;

const itemsOf = (page: Page) => page.getByRole('list', {name: 'sortable list'}).first().getByRole('listitem');

for (const {reader, device} of [{reader: 'an iPad held upright', device: iPadUpright}, {reader: 'a phone', device: iPhone}]) {
  test.describe(reader, () => {
    test.use(device);

    test('lifts a list item from a press just beside its grip and moves it to a new seat', async ({page}) => {
      await page.goto('demos/?tab=dragAndDrop');
      const items = itemsOf(page);
      await expect(items.first()).toBeVisible();
      const first = await items.first().textContent();
      const grip = items.first().getByRole('button', {name: /^grip for/});
      const box = await grip.boundingBox();
      if (box === null) throw new Error('the grip never stood');

      await grip.dragTo(items.nth(1), {force: true, sourcePosition: {x: box.width / 2 + justMissedBy, y: box.height / 2}});

      await expect.poll(() => items.first().textContent()).not.toBe(first);
    });

    test('opens a row\'s actions from a finger that lands just off the toggle', async ({page}) => {
      await page.goto('users');
      const toggle = page.getByRole('button', {name: /^Actions for /}).first();
      await expect(toggle).toBeVisible({timeout: 30_000});
      const name = await toggle.getAttribute('aria-label');

      await fingerTap(page, toggle, justMissedBy);

      await expect(page.getByLabel(`${name}, chosen`)).toBeVisible();
    });

    test('changes the price period from a finger that lands just off the toggle', async ({page}) => {
      const charts = chartsPage(page);
      await page.goto('demos/?tab=charts');
      await expect(charts.periodToggle).toBeVisible({timeout: 30_000});

      await fingerTap(page, charts.periodToggle, justMissedBy);
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
    await gallery.showSettings();
    await gallery.searchField.fill('flowers');
    await page.getByRole('heading', {name: 'Gallery'}).tap();

    await fingerTap(page, page.getByRole('button', {name: 'submit search'}), justMissedBy);
    await expect(page).toHaveURL(/search=flowers/);

    await gallery.showSettings();
    await fingerTap(page, page.getByRole('button', {name: 'reset search'}), justMissedBy);
    await expect(page).not.toHaveURL(/search=/);
  });
});

test.describe('a desktop', () => {
  test.use(desktop);

  test('still opens a row\'s actions and changes the period with a click', async ({page}) => {
    const charts = chartsPage(page);
    await page.goto('users');
    const toggle = page.getByRole('button', {name: /^Actions for /}).first();
    await expect(toggle).toBeVisible({timeout: 30_000});
    await toggle.click();
    await expect(page.getByLabel(`${await toggle.getAttribute('aria-label')}, chosen`)).toBeVisible();

    await page.goto('demos/?tab=charts');
    await charts.periodToggle.click();
    await charts.period('week').click();
    await expect(charts.periodToggle).toContainText('week');
  });
});
