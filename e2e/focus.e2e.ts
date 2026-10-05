import {Page, expect, test} from '@playwright/test';
import {desktop, feedbackOn, galleryPage, homePage, tabsTo, usersPage} from './__test_support';

test.use(desktop);

const homeDoor = (page: Page) => homePage(page).doorFolds.first();

for (const {control, at, find, before} of [
  {control: 'Feedback in the rail', at: '', find: (page: Page) => feedbackOn(page).open},
  {control: 'the gallery’s Go', at: 'gallery/?page=1&size=8&tab=aic', find: (page: Page) => galleryPage(page).go},
  {control: 'the gallery’s reset search', at: 'gallery/?page=1&size=8&tab=aic', find: (page: Page) => galleryPage(page).resetSearch},
  {control: 'Same as Home on the users form', at: 'users/', find: (page: Page) => usersPage(page).sameAsHome},
  {control: 'a link in an open home page door', at: '', find: (page: Page) => homeDoor(page).getByRole('link', {name: 'progress', exact: true}),
    before: (page: Page) => homeDoor(page).getByText('how I organize it', {exact: true}).click()}
]) {
  test(`the keyboard reaches ${control}`, async ({page}) => {
    await page.goto(at);
    await before?.(page);
    await expect(find(page)).toBeVisible();

    await tabsTo(page, find(page));

    await expect(find(page)).toBeFocused();
  });
}
