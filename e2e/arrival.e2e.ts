import {expect, test} from '@playwright/test';
import {clickWhereItIs, desktop, documentScrollY, iPhone} from './__test_support';

for (const [frame, device] of [['a phone', iPhone], ['a desk', desktop]] as const) {
  test.describe(frame, () => {
    test.use(device);

    test('Back to a tutorial from another tab, and Forward again, return the reader to where they were', async ({page}) => {
      await page.goto('demos/?tab=tables#station-5');
      await expect(page.getByRole('heading', {name: 'The trader can watch the market live, in windows'})).toBeInViewport();
      const atTheTutorial = await documentScrollY(page);
      await clickWhereItIs(page, page.getByRole('navigation', {name: 'demos'}).getByRole('link', {name: 'Z-index'}));
      await expect(page.getByRole('heading', {name: 'Why Third is on top'})).toBeAttached();
      const onTheOtherTab = await documentScrollY(page);

      await page.goBack();

      await expect(page.getByRole('heading', {name: 'Slice the design into stories'})).toBeAttached();
      await expect.poll(() => documentScrollY(page)).toBe(atTheTutorial);

      await page.goForward();

      await expect(page.getByRole('heading', {name: 'Why Third is on top'})).toBeAttached();
      await expect.poll(() => documentScrollY(page)).toBe(onTheOtherTab);
    });
  });
}
