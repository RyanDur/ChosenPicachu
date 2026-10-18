import {Page, expect, test} from '@playwright/test';
import {desktop, developmentPage, feedbackOn, galleryPage, tabsTo, usersPage} from './__test_support';

test.use(desktop);

for (const {control, at, find} of [
  {control: 'Feedback in the rail', at: '', find: (page: Page) => feedbackOn(page).open},
  {control: 'the gallery’s Go', at: 'gallery/?page=1&size=8&tab=aic', find: (page: Page) => galleryPage(page).go},
  {control: 'the gallery’s reset search', at: 'gallery/?page=1&size=8&tab=aic', find: (page: Page) => galleryPage(page).resetSearch},
  {control: 'Same as Home on the users form', at: 'users/', find: (page: Page) => usersPage(page).sameAsHome},
  {control: 'a link in a Development tab’s how I organize it', at: 'development/', find: (page: Page) => developmentPage(page).practice.getByRole('link', {name: 'progress', exact: true})}
]) {
  test(`the keyboard reaches ${control}`, async ({page}) => {
    await page.goto(at);
    await expect(find(page)).toBeVisible();

    await tabsTo(page, find(page));

    await expect(find(page)).toBeFocused();
  });
}
