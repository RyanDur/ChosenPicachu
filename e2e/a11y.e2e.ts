import {expect, Page, test} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {HtmlValidate} from 'html-validate';
import {delta, pages} from './pages';

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

for (const {name, path, ready, loaded} of pages) {
  test(`the ${name} page has no accessibility violations`, async ({page}) => {
    await page.goto(path);
    await expect(page.getByRole(ready).first()).toBeVisible({timeout: 30_000});
    if (loaded) await expect(loaded(page)).toBeVisible({timeout: 30_000});

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
    if (loaded) await expect(loaded(page)).toBeVisible({timeout: 30_000});

    const report = await validator.validateString(await page.content());

    expect(report.results.flatMap(result => result.messages.map(message =>
      `${message.ruleId}: ${message.message} [${message.selector}]`
    ))).toEqual([]);
  });
}

test('the period menu stays hidden until asked', async ({page}) => {
  await scriptedMarket(page, [50000, 50100]);
  await page.goto('demos?tab=charts');

  await expect(delta(page)).toBeVisible({timeout: 30_000});
  await expect(delta(page)).toHaveText(/^\+/);
  await expect(page.getByRole('button', {name: 'price period'})).toBeVisible();
  await expect(page.getByText('week').first()).toBeHidden();

  await page.getByRole('button', {name: 'price period'}).click();
  await expect(page.getByText('week').first()).toBeVisible();
});

test('only one fuller story stands open at a time', async ({page}) => {
  await page.goto('');
  const stories = page.getByRole('list', {name: 'the timeline'}).getByRole('group');

  await stories.nth(0).getByText('the fuller story').click();
  await expect(stories.nth(0)).toHaveAttribute('open', '');
  await expect(stories.nth(1)).not.toHaveAttribute('open', '');

  await stories.nth(1).getByText('the fuller story').click();
  await expect(stories.nth(1)).toHaveAttribute('open', '');
  await expect(stories.nth(0)).not.toHaveAttribute('open', '');
});

const markets = [
  {trend: 'rising', sign: /^\+/, prices: [50000, 50100]},
  {trend: 'falling', sign: /^-/, prices: [50100, 50000]},
];

for (const {trend, sign, prices} of markets) {
  test(`the ${trend} price card has no accessibility violations`, async ({page}) => {
    await scriptedMarket(page, prices);
    await page.goto('demos?tab=charts');

    await expect(delta(page)).toBeVisible({timeout: 30_000});
    await expect(delta(page)).toHaveText(sign);

    const results = await new AxeBuilder({page}).include('section[aria-label="live trades"]').withTags(['wcag2a', 'wcag2aa']).analyze();

    expect(results.violations.map(v => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.length,
      sample: v.nodes[0]?.html.slice(0, 120)
    }))).toEqual([]);
  });
}
