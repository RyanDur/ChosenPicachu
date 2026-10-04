import {Locator, expect, test} from '@playwright/test';
import {pageScrollsSideways, piecesPastTheirParts} from './__test_support';

const tabs: {tab: string; region: string; opening: (content: Locator) => Locator}[] = [
  {tab: 'accordions', region: 'Accordions', opening: content => content.getByRole('heading', {level: 2}).first()},
  {tab: 'z-index', region: 'Z-index', opening: content => content.getByRole('heading', {level: 2}).first()},
  {tab: 'dragAndDrop', region: 'Drag sort', opening: content => content.getByRole('list', {name: 'sortable list'})},
  {tab: 'charts', region: 'Charts', opening: content => content.getByRole('heading', {level: 2}).first()},
  {tab: 'tables', region: 'Tables', opening: content => content.getByRole('region', {name: 'live aggregations'})}
];

for (const {width, height} of [{width: 320, height: 568}, {width: 344, height: 882}, {width: 360, height: 760}, {width: 390, height: 844}, {width: 507, height: 1180}, {width: 600, height: 900}]) {
  test.describe(`a ${width}×${height} phone`, () => {
    test.use({viewport: {width, height}, hasTouch: true});

    for (const {tab, region, opening} of tabs) {
      test(`starts the ${tab} tab on the title's left edge, ends it as far from the right, and only scrolls down`, async ({page}) => {
        await page.goto(`demos/?tab=${tab}`);
        const content = page.getByRole('region', {name: region, exact: true});
        const [title, first] = await Promise.all([
          page.getByRole('heading', {level: 1}).boundingBox(),
          opening(content).boundingBox()
        ]);

        expect(first && Math.round(first.x)).toBe(title && Math.round(title.x));
        expect(first && Math.round(width - first.x - first.width)).toBe(title && Math.round(title.x));
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
