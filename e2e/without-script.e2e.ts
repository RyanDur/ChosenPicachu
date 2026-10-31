import {expect, test} from '@playwright/test';
import {siteFrame} from './__test_support';

for (const path of ['record/', 'practice/structure/', 'practice/presentation/', 'practice/behavior/', 'games/']) {
  test(`the document at /${path} reads word for word as the page does once its script runs`, async ({browser, page, baseURL}) => {
    const withoutScript = await browser.newContext({baseURL, javaScriptEnabled: false});
    const document = await withoutScript.newPage();
    await document.goto(path);
    const fetched = await siteFrame(document).reading();
    await withoutScript.close();

    await page.goto(path);
    await siteFrame(page).hydrated();

    expect(fetched.text).not.toBe('');
    expect(await siteFrame(page).reading()).toEqual(fetched);
  });
}
