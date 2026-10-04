import {expect, test} from '@playwright/test';
import {desktop, reachesAcross} from './__test_support';

test.use(desktop);

for (const {tab, at, opening} of [
  {tab: 'Accordions', at: 'demos/?tab=accordions', opening: /^A web page is written in three languages/},
  {tab: 'Z-index', at: 'demos/?tab=z-index', opening: /^Where two boxes on a page overlap/},
  {tab: 'Charts', at: 'demos/?tab=charts', opening: /^A live chart draws numbers/}
]) {
  test(`the ${tab} tab's introduction reaches across the part it sits in`, async ({page}) => {
    await page.goto(at);
    const region = page.getByRole('region', {name: tab, exact: true});

    await expect.poll(() => reachesAcross(region.getByText(opening).first(), region.getByRole('heading', {level: 2, name: tab, exact: true})))
      .toBe(true);
  });
}
