import {expect, test} from '@playwright/test';
import {homePage, recordPage} from './__test_support';

for (const {concern, id} of [{concern: 'Structure', id: 'structure'}, {concern: 'Presentation', id: 'presentation'}, {concern: 'Dynamic', id: 'dynamic'}]) {
  test(`a reader who follows ${concern}'s story from the home lands on that story on the record`, async ({page}) => {
    await page.goto('');

    await homePage(page).signpost(concern, 'Its story is on the record.').click();

    await expect(page).toHaveURL(new RegExp(`/record/#${id}$`));
    await expect(recordPage(page).story(concern)).toBeFocused();
  });

  test(`a reader who follows how I organize ${concern} from the home lands on its tab on Practice`, async ({page}) => {
    await page.goto('');

    await homePage(page).signpost(concern, 'How I organize it is on Practice.').click();

    await expect(page.getByRole('heading', {name: `Practice ${concern}`, level: 1})).toBeVisible();
  });
}
