import {expect, test} from '@playwright/test';
import {desktop} from './__test_support';

test.use(desktop);

for (const {tab, at, opening} of [
  {tab: 'Accordions', at: 'demos/?tab=accordions', opening: /^A web page is written in three languages|^An accordion is a list of parts/},
  {tab: 'Z-index', at: 'demos/?tab=z-index', opening: /^Where two boxes on a page overlap/},
  {tab: 'Charts', at: 'demos/?tab=charts', opening: /^A live chart draws numbers/}
]) {
  test(`the ${tab} tab's introduction reaches across the part it sits in`, async ({page}) => {
    await page.goto(at);
    const region = page.getByRole('region', {name: tab, exact: true});

    const [paragraph, heading] = await Promise.all([
      region.getByText(opening).first().boundingBox(),
      region.getByRole('heading', {level: 2, name: tab, exact: true}).boundingBox()
    ]);

    expect(paragraph && heading && Math.round(paragraph.x + paragraph.width)).toBe(heading && Math.round(heading.x + heading.width));
  });
}
