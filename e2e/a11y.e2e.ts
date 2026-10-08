import {expect, test} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {HtmlValidate} from 'html-validate';
import {pages} from './pages';
import {chartsPage, markets, scriptedMarket, violationsOf} from './__test_support';

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

    expect(violationsOf(results)).toEqual([]);
  });
}

test('the home page has no accessibility violations with its folds open', async ({page}) => {
  const home = pages.find(({name}) => name === 'home');
  await page.goto(home?.path ?? '');
  for (const door of await page.getByText('how I organize it').all()) await door.click();
  await page.getByRole('heading', {name: 'The research'}).click();

  const found = [];
  for (const story of await page.getByText('the fuller story').all()) {
    await story.click();
    found.push(...violationsOf(await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa']).analyze()));
  }

  expect(found).toEqual([]);
});

for (const {name, path, ready, loaded} of pages) {
  test(`the ${name} page is conforming html`, async ({page}) => {
    await page.goto(path);
    await expect(page.getByRole(ready).first()).toBeVisible({timeout: 30_000});
    if (loaded) await expect(loaded(page)).toBeVisible({timeout: 30_000});

    const report = await validator.validateString(await page.content());

    expect(report.results.flatMap(result => result.messages.map(message =>
      `${message.ruleId}: ${message.message} [${message.selector}]`
    ))).toEqual([]);
  });
}

for (const {trend, sign, prices} of markets) {
  test(`the ${trend} price card has no accessibility violations`, async ({page}) => {
    const charts = chartsPage(page);
    await scriptedMarket(page, prices);
    await page.goto('demos?tab=charts');

    await expect(charts.priceDelta).toBeVisible({timeout: 30_000});
    await expect(charts.priceDelta).toHaveText(sign);

    const results = await new AxeBuilder({page}).include(await charts.priceCardScope()).withTags(['wcag2a', 'wcag2aa']).analyze();

    expect(violationsOf(results)).toEqual([]);
  });
}
