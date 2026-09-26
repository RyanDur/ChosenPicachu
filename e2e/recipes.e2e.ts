import {expect, test} from '@playwright/test';
import {codedStepLayouts, desktop, iPadSideways, iPadUpright} from './__test_support';

const bigPhoneSideways = {viewport: {width: 956, height: 440}, hasTouch: true};
const tutorials = [{name: 'the z-index tutorial', at: 'demos/?tab=z-index&news=top,many'}, {name: 'the price chart tutorial', at: 'demos/charts/price/?graph=price'}];

for (const {reader, device, layout} of [
  {reader: 'a big phone held sideways', device: bigPhoneSideways, layout: 'code below prose'},
  {reader: 'an iPad held upright', device: iPadUpright, layout: 'code below prose'},
  {reader: 'an iPad held sideways', device: iPadSideways, layout: 'code below prose'},
  {reader: 'a desktop', device: desktop, layout: 'code beside prose'}
] as const) {
  test.describe(reader, () => {
    test.use(device);

    for (const tutorial of tutorials) {
      test(`reads ${tutorial.name} with the ${layout} on every step`, async ({page}) => {
        await page.goto(tutorial.at);
        await expect(page.getByRole('code').first()).toBeVisible({timeout: 30_000});

        await expect.poll(async () => [...new Set(await codedStepLayouts(page))]).toEqual([layout]);
      });
    }
  });
}
