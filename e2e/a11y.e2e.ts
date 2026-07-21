import {expect, test} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  {name: 'home', path: '', ready: 'table'},
  {name: 'about', path: 'about?tab=accordions', ready: 'navigation'},
  {name: 'users', path: 'users', ready: 'table'},
  {name: 'gallery', path: 'gallery?page=1&size=8&tab=vam', ready: 'navigation'},
];

for (const {name, path, ready} of pages) {
  test(`the ${name} page has no accessibility violations`, async ({page}) => {
    await page.goto(path);
    await expect(page.getByTestId(ready).first()).toBeVisible({timeout: 30_000});

    const results = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa']).analyze();

    expect(results.violations.map(v => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.length,
      sample: v.nodes[0]?.html.slice(0, 120)
    }))).toEqual([]);
  });
}
