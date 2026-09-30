import {expect, test} from '@playwright/test';
import {codedStepLayouts, desktop, iPad13Sideways, iPadSideways, iPadUpright} from './__test_support';

const bigPhoneSideways = {viewport: {width: 956, height: 440}, hasTouch: true};
const tutorials = [{name: 'the z-index tutorial', at: 'demos/?tab=z-index&news=top,many'}, {name: 'the price chart tutorial', at: 'demos/charts/price/?graph=price'}];

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

        await expect.poll(async () => [...new Set(await codedStepLayouts(page))]).toEqual([layout]);
      });
    }
  });
}

test.describe('a desktop', () => {
  test.use(desktop);

  test('sees the tables recipe\'s slots drawing centred under its prose and above its code', async ({page}) => {
    await page.goto('demos/?tab=tables&sort=column');
    const step = page.getByRole('article').filter({has: page.getByRole('heading', {name: 'Find the neighbour under the pointer, with a dead zone'})});
    await step.getByText('how we built it').click();
    const drawing = step.getByRole('figure').getByRole('img', {includeHidden: true});
    await expect(drawing).toBeVisible();

    const [drawn, prose, code] = await Promise.all([
      drawing.boundingBox(),
      step.getByRole('paragraph').filter({hasText: 'This step is JavaScript alone'}).boundingBox(),
      step.getByRole('code').first().boundingBox()
    ]);

    const centreOf = (box: typeof drawn): number => (box?.x ?? Infinity) + (box?.width ?? 0) / 2;
    expect(drawn?.y).toBeGreaterThanOrEqual((prose?.y ?? Infinity) + (prose?.height ?? 0));
    expect((drawn?.y ?? Infinity) + (drawn?.height ?? 0)).toBeLessThanOrEqual(code?.y ?? -Infinity);
    expect(centreOf(drawn)).toBeCloseTo(centreOf(prose), 0);
  });
});
