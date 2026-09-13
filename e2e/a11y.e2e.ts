import {expect, test} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {HtmlValidate} from 'html-validate';
import {pages} from './pages';
import {
  feedDot,
  fullerStory,
  inkNamed,
  priceCardScope,
  priceDelta,
  pricePeriod,
  pricePeriodToggle,
  resolved,
  scriptedMarket,
  timelineStories
} from './__test_support';

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

  await expect(priceDelta(page)).toBeVisible({timeout: 30_000});
  await expect(priceDelta(page)).toHaveText(/^\+/);
  await expect(pricePeriodToggle(page)).toBeVisible();
  await expect(pricePeriod(page, 'week')).toBeHidden();

  await pricePeriodToggle(page).click();
  await expect(pricePeriod(page, 'week')).toBeVisible();
});

test('the chosen period glows, and its neighbours do not', async ({page}) => {
  await scriptedMarket(page, [50000, 50100]);
  await page.goto('demos?tab=charts');

  await expect(priceDelta(page)).toBeVisible({timeout: 30_000});
  await pricePeriodToggle(page).click();

  await expect(pricePeriod(page, 'hour')).toHaveCSS('box-shadow', await resolved(page, 'box-shadow', '--press-glow-soft'));
  await expect(pricePeriod(page, 'week')).toHaveCSS('box-shadow', 'none');
});

test('only one fuller story stands open at a time', async ({page}) => {
  await page.goto('');
  const stories = timelineStories(page);

  await fullerStory(stories.nth(0)).click();
  await expect(stories.nth(0)).toHaveAttribute('open', '');
  await expect(stories.nth(1)).not.toHaveAttribute('open', '');

  await fullerStory(stories.nth(1)).click();
  await expect(stories.nth(1)).toHaveAttribute('open', '');
  await expect(stories.nth(0)).not.toHaveAttribute('open', '');
});

const markets = [
  {trend: 'rising', sign: /^\+/, ink: '--mint-ink', prices: [50000, 50100]},
  {trend: 'falling', sign: /^-/, ink: '--internationl-orange-engineering', prices: [50100, 50000]},
];

test('the feed dot glows live', async ({page}) => {
  await scriptedMarket(page, [50000, 50100]);
  await page.goto('demos?tab=charts');

  await expect(priceDelta(page)).toBeVisible({timeout: 30_000});
  await expect.poll(() => feedDot(page)).toBe(await inkNamed(page, '--mint'));
});

for (const {trend, sign, ink, prices} of markets) {
  test(`the ${trend} price card has no accessibility violations`, async ({page}) => {
    await scriptedMarket(page, prices);
    await page.goto('demos?tab=charts');

    await expect(priceDelta(page)).toBeVisible({timeout: 30_000});
    await expect(priceDelta(page)).toHaveText(sign);

    const results = await new AxeBuilder({page}).include(priceCardScope).withTags(['wcag2a', 'wcag2aa']).analyze();

    expect(results.violations.map(v => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.length,
      sample: v.nodes[0]?.html.slice(0, 120)
    }))).toEqual([]);
  });

  test(`the ${trend} price card wears its ink`, async ({page}) => {
    await scriptedMarket(page, prices);
    await page.goto('demos?tab=charts');

    await expect(priceDelta(page)).toBeVisible({timeout: 30_000});
    await expect(priceDelta(page)).toHaveText(sign);
    await expect(priceDelta(page)).toHaveCSS('color', await inkNamed(page, ink));
  });
}
