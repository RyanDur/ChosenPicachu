import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {clickWhereItIs, iPadSplitView, iPadUpright, iPhone, shortPhoneSideways, siteFrame, tabsTo, twoFramesLater} from './__test_support';

const pages = ['Home', 'Record', 'Practice', 'Demos', 'Users', 'Gallery', 'Games', 'Repo'];

test.describe('a phone held upright', () => {
  test.use(iPhone);

  test('opens on the page’s title, with the site menu in reach and the site’s pages out of sight', async ({page}) => {
    await page.goto('record/');

    await expect(siteFrame(page).title).toHaveText('The record');
    await expect(siteFrame(page).menu).toBeVisible();
    await expect(siteFrame(page).nav).toBeHidden();
  });

  test('the site menu shows the eight pages in order, with the page the reader is on marked', async ({page}) => {
    await page.goto('users/');
    await siteFrame(page).hydrated();

    await siteFrame(page).menu.tap();

    const nav = siteFrame(page).nav;
    await expect(nav.getByRole('link')).toHaveText(pages);
    await expect(nav.getByRole('link', {name: 'Users'})).toHaveAttribute('aria-current', 'page');
  });

  test('the site menu marks the page the reader lands on, even at an address typed without its slash', async ({page}) => {
    await page.goto('users');
    await siteFrame(page).hydrated();

    await siteFrame(page).menu.tap();

    await expect(page).toHaveURL(/\/users\/$/);
    await expect(siteFrame(page).nav.getByRole('link', {name: 'Users'})).toHaveAttribute('aria-current', 'page');
  });

  test('choosing Demos opens it, and the site menu then marks Demos', async ({page}) => {
    await page.goto('');
    await siteFrame(page).hydrated();
    await siteFrame(page).menu.tap();

    await siteFrame(page).nav.getByRole('link', {name: 'Demos'}).tap();

    await expect(page).toHaveURL(/\/demos\//);
    await siteFrame(page).menu.tap();
    await expect(siteFrame(page).nav.getByRole('link', {name: 'Demos'})).toHaveAttribute('aria-current', 'page');
  });

  test('Feedback in the foot opens its dialog', async ({page}) => {
    await page.goto('');
    await siteFrame(page).hydrated();

    await siteFrame(page).feedback.tap();

    await expect(page.getByRole('dialog', {name: 'Feedback'})).toBeVisible();
  });

  test('Escape closes the site menu', async ({page}) => {
    await page.goto('');
    await siteFrame(page).hydrated();
    await siteFrame(page).menu.tap();
    await expect(siteFrame(page).nav).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(siteFrame(page).nav).toBeHidden();
  });

  test('a tap outside the site menu closes it', async ({page}) => {
    await page.goto('');
    await siteFrame(page).hydrated();
    await siteFrame(page).menu.tap();
    await expect(siteFrame(page).nav).toBeVisible();

    await page.touchscreen.tap(10, 10);

    await expect(siteFrame(page).nav).toBeHidden();
  });

  test('choosing a page in the site menu opens it and closes the menu', async ({page}) => {
    await page.goto('');
    await siteFrame(page).hydrated();
    await siteFrame(page).menu.tap();

    await siteFrame(page).nav.getByRole('link', {name: 'Record'}).tap();

    await expect(page).toHaveURL(/\/record\/$/);
    await expect(siteFrame(page).nav).toBeHidden();
  });
});

test.describe('a keyboard reader on an upright phone', () => {
  test.use(iPhone);

  test('opens the site menu, chooses Record, and lands back on Menu', async ({page}) => {
    const site = siteFrame(page);
    await page.goto('');
    await site.hydrated();
    await site.menu.focus();
    await page.keyboard.press('Enter');
    await expect(site.nav).toBeVisible();
    await tabsTo(page, site.nav.getByRole('link', {name: 'Record'}));

    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/record\/$/);
    await expect(page.getByRole('navigation', {name: 'site', includeHidden: true}).getByRole('link', {name: 'Record', includeHidden: true}))
      .toHaveAttribute('aria-current', 'page');
    await expect(site.menu).toBeFocused();
    await expect(site.menu).toBeVisible();
  });
});

test.describe('an iPad in split view widened past a phone', () => {
  test.use(iPadSplitView);

  test('closes the site menu, leaving the site nav in the rail', async ({page}) => {
    const site = siteFrame(page);
    await page.goto('');
    await site.hydrated();
    await site.menu.click();
    await expect(site.nav).toBeVisible();

    await page.setViewportSize(iPadUpright.viewport);

    await expect(page.getByRole('region', {name: 'pages and feedback'}).getByRole('navigation', {name: 'site'})).toBeVisible();
  });

  test('keeps a keyboard reader on the link they were on in the menu', async ({page}) => {
    const site = siteFrame(page);
    const record = site.nav.getByRole('link', {name: 'Record'});
    await page.goto('');
    await site.hydrated();
    await site.menu.focus();
    await page.keyboard.press('Enter');
    await tabsTo(page, record);

    await page.setViewportSize(iPadUpright.viewport);

    await expect(record).toBeFocused();
    await expect(record).toBeVisible();
  });
});

test.describe('a short phone held on its side', () => {
  test.use(shortPhoneSideways);

  test('the site menu keeps Home in reach', async ({page}) => {
    await page.goto('record/');
    await siteFrame(page).hydrated();
    await siteFrame(page).menu.tap();

    await twoFramesLater(page);

    await clickWhereItIs(page, siteFrame(page).nav.getByRole('link', {name: 'Home'}));

    await expect(page).toHaveURL(/\/ChosenPicachu\/$/);
  });
});
