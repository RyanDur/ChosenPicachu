import {Page, expect, test} from '@playwright/test';
import {fingerTap, iPadUpright, iPhone, phoneSideways} from './__test_support';

const choicesOn = [
  {demo: 'the accordions demo', at: 'demos/?tab=accordions', groups: ['fold type', 'fold motion']},
  {demo: 'the tables demo', at: 'demos/?tab=tables', groups: ['world', 'pace', 'origin', 'motion']},
  {demo: 'the z-index demo', at: 'demos/?tab=z-index', groups: ['side', 'align', 'entrance', 'stack']}
];

const pillHeights = async (page: Page, group: string): Promise<number[]> => {
  const pills = page.getByRole('group', {name: group, exact: true, includeHidden: true}).first().getByRole('radio', {includeHidden: true});
  await expect(pills.first()).toBeAttached();
  return pills.evaluateAll(radios => radios.map(radio =>
    radio instanceof HTMLInputElement ? Math.round(radio.labels?.item(0)?.getBoundingClientRect().height ?? 0) : 0));
};

for (const {reader, device} of [
  {reader: 'a phone', device: iPhone},
  {reader: 'an iPad held upright', device: iPadUpright},
  {reader: 'a phone held sideways', device: phoneSideways}
]) {
  test.describe(reader, () => {
    test.use(device);

    for (const {demo, at, groups} of choicesOn) {
      test(`every pill on ${demo} takes a finger`, async ({page}) => {
        await page.goto(at);

        for (const group of groups) {
          expect((await pillHeights(page, group)).filter(height => height < 44), group).toEqual([]);
        }
      });
    }

    test('a finger just off a pill\'s middle chooses it', async ({page}) => {
      await page.goto('demos/?tab=tables');
      const world = page.getByRole('group', {name: 'world', exact: true});

      await fingerTap(page, world.getByText('Vanilla', {exact: true}));

      await expect(world.getByRole('radio', {name: 'Vanilla', includeHidden: true})).toBeChecked();
    });
  });
}
