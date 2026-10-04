import {expect, test} from '@playwright/test';
import {desktop, reachesAcross} from './__test_support';

test.use(desktop);

test('a tutorial’s quote reaches across the tutorial it sits in', async ({page}) => {
  await page.goto('demos/?tab=z-index');
  const tutorial = page.getByRole('region', {name: 'let’s build this feature', exact: true});
  const quote = tutorial.getByRole('figure').filter({hasText: /When something breaks, tell me/});
  await quote.scrollIntoViewIfNeeded();

  await expect.poll(() => reachesAcross(quote, tutorial)).toBe(true);
});

test('a chart’s “what am I looking at?” note reaches across the explainer it sits in', async ({page}) => {
  await page.goto('demos/?tab=charts&charts=price');
  const explainer = page.getByRole('group').filter({has: page.getByText('what am I looking at?', {exact: true})}).first();
  await explainer.getByText('what am I looking at?', {exact: true}).click();

  await expect.poll(() => reachesAcross(explainer.getByRole('paragraph').first(), explainer)).toBe(true);
});
