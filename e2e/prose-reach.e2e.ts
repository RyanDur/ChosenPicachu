import {expect, test} from '@playwright/test';
import {desktop} from './__test_support';

test.use(desktop);

const rightEdge = (box: {x: number; width: number} | null): number | null => box && Math.round(box.x + box.width);

test('a tutorial’s quote reaches across the part it sits in, as the paragraph above it does', async ({page}) => {
  await page.goto('demos/?tab=z-index');
  const tutorial = page.getByRole('region', {name: 'Z-index', exact: true});
  const quote = tutorial.getByRole('figure').filter({hasText: /When something breaks, tell me/});
  await quote.scrollIntoViewIfNeeded();

  const [quoted, above] = await Promise.all([quote.boundingBox(), tutorial.getByText(/The links go to MDN, Mozilla’s web reference/).boundingBox()]);

  expect(rightEdge(quoted)).toBe(rightEdge(above));
});

test('a chart’s “what am I looking at?” note reaches across its chart', async ({page}) => {
  await page.goto('demos/?tab=charts&charts=price');
  const explainer = page.getByRole('group').filter({has: page.getByText('what am I looking at?', {exact: true})}).first();
  await explainer.getByText('what am I looking at?', {exact: true}).click();

  const [note, bar] = await Promise.all([
    explainer.getByRole('paragraph').first().boundingBox(),
    explainer.getByText('what am I looking at?', {exact: true}).boundingBox()
  ]);

  expect(rightEdge(note)).toBe(rightEdge(bar));
});
