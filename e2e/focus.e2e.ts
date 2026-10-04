import {Page, expect, test} from '@playwright/test';
import {desktop, focusStandsOut} from './__test_support';

test.use(desktop);

for (const {control, at, find, mark} of [
  {control: 'Feedback in the rail', at: '', find: (page: Page) => page.getByRole('button', {name: 'Feedback', exact: true})},
  {control: 'the gallery’s Go', at: 'gallery/?page=1&size=8&tab=aic', find: (page: Page) => page.getByRole('button', {name: 'Go', exact: true})},
  {control: 'the gallery’s reset search', at: 'gallery/?page=1&size=8&tab=aic', find: (page: Page) => page.getByRole('button', {name: /reset/i})},
  {control: 'Same as Home on the users form', at: 'users/', find: (page: Page) => page.getByRole('checkbox', {name: 'Same as Home'}),
    mark: (page: Page) => page.getByText('Same as Home', {exact: true}).locator('..')}
]) {
  test(`keyboard focus on ${control} stands out from its ground at 3:1`, async ({page}) => {
    await page.goto(at);

    const {changed, ring} = await focusStandsOut(page, find(page), mark?.(page));

    expect(changed).toBeGreaterThanOrEqual(ring);
  });
}
