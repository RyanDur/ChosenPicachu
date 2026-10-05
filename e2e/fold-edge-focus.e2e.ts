import {expect, test} from '@playwright/test';
import {ringPixelsLeftOf} from './__test_support';

test.describe('a desk, at a link that starts a line in a fold', () => {
  test.use({viewport: {width: 1440, height: 900}});

  test('keeps the left side of its focus ring', async ({page}) => {
    await page.goto('');
    const door = page.getByRole('group').filter({has: page.getByText('how I organize it', {exact: true})}).first();
    await door.getByText('how I organize it', {exact: true}).click();
    const link = door.getByRole('link', {name: 'progress', exact: true});
    await expect(link).toBeVisible();

    expect(await ringPixelsLeftOf(page, link)).toBeGreaterThan(0);
  });
});
