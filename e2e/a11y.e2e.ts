import {expect, test} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

type A11yPage = {name: string, path: string, ready: string, loaded?: string};
const pages: A11yPage[] = [
  {name: 'home', path: '', ready: 'table'},
  {name: 'about', path: 'about?tab=accordions', ready: 'navigation'},
  {name: 'users', path: 'users', ready: 'table'},
  {name: 'gallery', path: 'gallery?page=1&size=8&tab=vam', ready: 'navigation', loaded: 'figure.frame'},
  {name: 'games', path: 'games', ready: 'header'},
  {name: 'three-in-a-row', path: 'games/colorGame', ready: 'main'},
];

for (const {name, path, ready, loaded} of pages) {
  test(`the ${name} page has no accessibility violations`, async ({page}) => {
    await page.goto(path);
    await expect(page.getByTestId(ready).first()).toBeVisible({timeout: 30_000});
    if (loaded) await expect(page.locator(loaded).first()).toBeVisible({timeout: 30_000});

    const results = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa']).analyze();

    expect(results.violations.map(v => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.length,
      sample: v.nodes[0]?.html.slice(0, 120)
    }))).toEqual([]);
  });
}
