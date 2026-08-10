import {expect, Page, test} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {HtmlValidate} from 'html-validate';

const validator = new HtmlValidate({
  extends: ['html-validate:recommended'],
  rules: {
    'attribute-boolean-style': 'off',
    'attribute-empty-style': 'off',
    'no-trailing-whitespace': 'off',
    'no-inline-style': 'off',
    'form-dup-name': ['error', {shared: ['radio', 'checkbox']}]
  }
});

type Role = Parameters<Page['getByRole']>[0];
type A11yPage = {name: string, path: string, ready: Role, loaded?: string};
const pages: A11yPage[] = [
  {name: 'root', path: '', ready: 'navigation'},
  {name: 'demos', path: 'demos?tab=accordions', ready: 'navigation'},
  {name: 'charts', path: 'demos?tab=charts', ready: 'navigation', loaded: '.price-chart .delta'},
  {name: 'tables', path: 'demos?tab=tables', ready: 'navigation', loaded: '.aggregations .header-cell'},
  {name: 'price chart tutorial', path: 'demos/charts/price/', ready: 'navigation', loaded: '.build-steps .story'},
  {name: 'candles chart tutorial', path: 'demos/charts/candles/', ready: 'navigation', loaded: '.build-steps .story'},
  {name: 'pressure chart tutorial', path: 'demos/charts/pressure/', ready: 'navigation', loaded: '.build-steps .story'},
  {name: 'menu tutorial', path: 'demos?tab=tables&tut=menu', ready: 'navigation', loaded: '.build-steps .story'},
  {name: 'resize tutorial', path: 'demos?tab=tables&tut=resize', ready: 'navigation', loaded: '.build-steps .story'},
  {name: 'drag sort', path: 'demos?tab=dragAndDrop', ready: 'navigation', loaded: '.sortable-list .draggable'},
  {name: 'users', path: 'users', ready: 'table'},
  {name: 'gallery', path: 'gallery', ready: 'navigation', loaded: 'figure.frame'},
  {name: 'games', path: 'games', ready: 'banner'},
  {name: 'three-in-a-row', path: 'games/colorGame', ready: 'main'},
];

for (const {name, path, ready, loaded} of pages) {
  test(`the ${name} page has no accessibility violations`, async ({page}) => {
    await page.goto(path);
    await expect(page.getByRole(ready).first()).toBeVisible({timeout: 30_000});
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

const tradeFrame = (id: number, price: number): string => JSON.stringify({
  type: 'match',
  trade_id: id,
  price: `${price}`,
  size: '0.01',
  side: 'buy',
  time: new Date().toISOString()
});

const scriptedMarket = async (page: Page, prices: number[]): Promise<void> => {
  await page.route(/\/products\/.*\/candles/, route =>
    route.fulfill({json: [], headers: {'access-control-allow-origin': '*'}}));
  await page.routeWebSocket(/ws-feed/, socket => {
    socket.onMessage(() => prices.forEach((price, id) => socket.send(tradeFrame(id, price))));
  });
};

for (const {name, path, ready, loaded} of pages) {
  test(`the ${name} page is conforming html`, async ({page, browserName}) => {
    test.skip(browserName !== 'chromium', 'the serialized DOM is engine-independent');
    await page.goto(path);
    await expect(page.getByRole(ready).first()).toBeVisible({timeout: 30_000});
    if (loaded) await expect(page.locator(loaded).first()).toBeVisible({timeout: 30_000});

    const report = await validator.validateString(await page.content());

    expect(report.results.flatMap(result => result.messages.map(message =>
      `${message.ruleId}: ${message.message} [${message.selector}]`
    ))).toEqual([]);
  });
}

test('the period menu stays hidden until asked', async ({page}) => {
  await scriptedMarket(page, [50000, 50100]);
  await page.goto('demos?tab=charts');

  await expect(page.locator(`.price-chart[data-trend='rising'] .delta`)).toBeVisible({timeout: 30_000});
  await expect(page.getByRole('button', {name: 'price period'})).toBeVisible();
  await expect(page.getByText('week').first()).toBeHidden();

  await page.getByRole('button', {name: 'price period'}).click();
  await expect(page.getByText('week').first()).toBeVisible();
});

const markets = [
  {trend: 'rising', prices: [50000, 50100]},
  {trend: 'falling', prices: [50100, 50000]},
];

for (const {trend, prices} of markets) {
  test(`the ${trend} price card has no accessibility violations`, async ({page}) => {
    await scriptedMarket(page, prices);
    await page.goto('demos?tab=charts');

    await expect(page.locator(`.price-chart[data-trend='${trend}'] .delta`)).toBeVisible({timeout: 30_000});

    const results = await new AxeBuilder({page}).include('.price-chart').withTags(['wcag2a', 'wcag2aa']).analyze();

    expect(results.violations.map(v => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.length,
      sample: v.nodes[0]?.html.slice(0, 120)
    }))).toEqual([]);
  });
}
