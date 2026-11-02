import {Locator, Page, expect, test} from '@playwright/test';
import {desktop, practicePage, feedbackOn, galleryPage, tabsTo, usersPage} from './__test_support';

test.use(desktop);

const theKeyboardReaches = async (page: Page, at: string, control: Locator): Promise<void> => {
  await page.goto(at);
  await expect(control).toBeVisible();

  await tabsTo(page, control);

  await expect(control).toBeFocused();
};

test('the keyboard reaches Feedback in the rail', ({page}) => theKeyboardReaches(page, '', feedbackOn(page).open));

test('the keyboard reaches the gallery’s Go', ({page}) => theKeyboardReaches(page, 'gallery/?page=1&size=8&tab=aic', galleryPage(page).go));

test('the keyboard reaches the gallery’s reset search', ({page}) => theKeyboardReaches(page, 'gallery/?page=1&size=8&tab=aic', galleryPage(page).resetSearch));

test('the keyboard reaches Same as Home on the users form', ({page}) => theKeyboardReaches(page, 'users/', usersPage(page).sameAsHome));

test('the keyboard reaches a link in a Practice tab’s how I organize it', ({page}) =>
  theKeyboardReaches(page, 'practice/', practicePage(page).practice.getByRole('link', {name: 'progress', exact: true})));
