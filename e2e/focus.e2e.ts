import {Page, expect, test} from '@playwright/test';
import {desktop, feedbackOn, focusStandsOut, galleryPage, usersPage} from './__test_support';

test.use(desktop);

for (const {control, at, find, mark} of [
  {control: 'Feedback in the rail', at: '', find: (page: Page) => feedbackOn(page).open},
  {control: 'the gallery’s Go', at: 'gallery/?page=1&size=8&tab=aic', find: (page: Page) => galleryPage(page).go},
  {control: 'the gallery’s reset search', at: 'gallery/?page=1&size=8&tab=aic', find: (page: Page) => galleryPage(page).resetSearch},
  {control: 'Same as Home on the users form', at: 'users/', find: (page: Page) => usersPage(page).sameAsHome,
    mark: (page: Page) => [usersPage(page).sameAsHomeWords, usersPage(page).sameAsHome]}
]) {
  test(`keyboard focus on ${control} stands out from its ground at 3:1`, async ({page}) => {
    await page.goto(at);

    const {changed, ring} = await focusStandsOut(page, find(page), mark?.(page));

    expect(changed).toBeGreaterThanOrEqual(ring);
  });
}
