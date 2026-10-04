import {expect, test} from '@playwright/test';
import {pageScrollsSideways, piecesPastTheirParts} from './__test_support';

const tabs = [
  {tab: 'accordions', region: 'Accordions'},
  {tab: 'z-index', region: 'Z-index'},
  {tab: 'dragAndDrop', region: 'Drag sort'},
  {tab: 'charts', region: 'Charts'},
  {tab: 'tables', region: 'Tables'}
];

for (const {width, height} of [{width: 320, height: 568}, {width: 344, height: 882}, {width: 360, height: 760}, {width: 390, height: 844}, {width: 507, height: 1180}, {width: 600, height: 900}]) {
  test.describe(`a ${width}×${height} phone`, () => {
    test.use({viewport: {width, height}, hasTouch: true});

    for (const {tab, region} of tabs) {
      test(`starts the ${tab} tab on the title's left edge, ends it as far from the right, and only scrolls down`, async ({page}) => {
        await page.goto(`demos/?tab=${tab}`);
        const content = page.getByRole('region', {name: region, exact: true});
        const [title, heading, contentEdge] = await Promise.all([
          page.getByRole('heading', {level: 1}).boundingBox(),
          content.getByRole('heading', {level: 2}).first().boundingBox(),
          content.evaluate(section => section.firstElementChild?.getBoundingClientRect().right ?? 0)
        ]);

        expect(heading && Math.round(heading.x)).toBe(title && Math.round(title.x));
        expect(Math.round(width - contentEdge)).toBe(title && Math.round(title.x));
        expect(await piecesPastTheirParts(page)).toEqual([]);
        expect(await pageScrollsSideways(page)).toBe(false);
      });
    }
  });
}

test.describe('a 390×844 phone, in a tutorial step', () => {
  test.use({viewport: {width: 390, height: 844}, hasTouch: true});

  test('gives a line of the step’s words at least 240px', async ({page}) => {
    await page.goto('demos/?tab=tables');
    const step = page.getByRole('region', {name: 'Sketch a design from the need', exact: true});

    expect((await step.getByRole('paragraph').first().boundingBox())?.width).toBeGreaterThanOrEqual(240);
  });
});
