import {Page, expect, test} from '@playwright/test';
import {codedStepLayouts, desktop, iPad13Sideways, iPadSideways, iPadUpright, iPhone, roomUnderShutFolds} from './__test_support';

const bigPhoneSideways = {viewport: {width: 956, height: 440}, hasTouch: true};
const tutorials = [
  {name: 'the z-index tutorial', at: 'demos/?tab=z-index&news=top,many', steps: (page: Page) => page.getByRole('region', {name: 'let’s build this feature'})},
  {name: 'the price chart tutorial', at: 'demos/charts/price/?graph=price', steps: (page: Page) => page}
];

for (const {reader, device, layout} of [
  {reader: 'a big phone held sideways', device: bigPhoneSideways, layout: 'code below prose'},
  {reader: 'an iPad held upright', device: iPadUpright, layout: 'code below prose'},
  {reader: 'an iPad held sideways', device: iPadSideways, layout: 'code below prose'},
  {reader: 'a 13-inch iPad held sideways', device: iPad13Sideways, layout: 'code beside prose'},
  {reader: 'a desktop', device: desktop, layout: 'code beside prose'}
] as const) {
  test.describe(reader, () => {
    test.use(device);

    for (const tutorial of tutorials) {
      test(`reads ${tutorial.name} with the ${layout} on every step`, async ({page}) => {
        await page.goto(tutorial.at);
        await expect(page.getByRole('code').first()).toBeVisible({timeout: 30_000});

        await expect.poll(async () => [...new Set(await codedStepLayouts(page, tutorial.steps(page)))]).toEqual([layout]);
      });
    }
  });
}

for (const {reader, device} of [{reader: 'a phone', device: iPhone}, {reader: 'a desktop', device: desktop}] as const) {
  test.describe(reader, () => {
    test.use(device);

    for (const {tab, story} of [
      {tab: 'tables', story: 'The page is a store, and so is the table'},
      {tab: 'tables', story: 'The trader can watch the market live, in windows'}
    ]) {
      test(`a shut “how we built it” in “${story}” leaves the same room under it, however much it holds`, async ({page}) => {
        await page.goto(`demos/?tab=${tab}`);

        expect(new Set(await roomUnderShutFolds(page, story)).size).toBe(1);
      });
    }
  });
}
