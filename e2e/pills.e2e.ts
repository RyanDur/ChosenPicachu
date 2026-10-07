import {Locator, Page, expect, test} from '@playwright/test';
import {demoSettings, desktop, fingerTap, iPadUpright, iPhone, phoneSideways, pillSwitch} from './__test_support';

const choicesOn = [
  {demo: 'the accordions demo', at: 'demos/?tab=accordions', groups: ['fold type', 'fold motion']},
  {demo: 'the tables demo', at: 'demos/?tab=tables', groups: ['world', 'pace', 'origin', 'motion']},
  {demo: 'the z-index demo', at: 'demos/?tab=z-index', groups: ['card raised', 'side', 'align', 'entrance', 'stack']}
];

const pillsOf = async (page: Page, group: string): Promise<{pills: Locator; names: string[]}> => {
  const pills = page.getByRole('group', {name: group, exact: true, includeHidden: true}).first();
  await expect(pills.getByRole('radio', {includeHidden: true}).first()).toBeAttached();
  if (await pills.isHidden()) await demoSettings(page).press();
  const names = await pills.getByRole('radio', {includeHidden: true}).evaluateAll(radios => radios.map(radio =>
    radio instanceof HTMLInputElement ? radio.labels?.item(0)?.textContent.trim() ?? '' : ''));
  return {pills, names};
};

for (const {reader, device} of [
  {reader: 'a phone', device: iPhone},
  {reader: 'an iPad held upright', device: iPadUpright},
  {reader: 'a phone held sideways', device: phoneSideways}
]) {
  test.describe(reader, () => {
    test.use(device);

    for (const {demo, at, groups} of choicesOn) {
      test(`every pill on ${demo} is chosen by a finger that lands just off its middle`, async ({page}) => {
        await page.goto(at);

        for (const group of groups) {
          const {pills, names} = await pillsOf(page, group);
          for (const name of names) {
            await fingerTap(page, pills.getByText(name, {exact: true}).first());
            await expect(pills.getByRole('radio', {name, exact: true, includeHidden: true}), `${group}: ${name}`).toBeChecked();
          }
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

for (const {reader, device} of [{reader: 'a desktop', device: desktop}, {reader: 'a phone', device: iPhone}]) {
  test.describe(`${reader}, choosing a pill`, () => {
    test.use(device);

    test('the pill chosen is checked, and the pill left behind is not', async ({page}) => {
      await page.goto('demos/?tab=tables');
      const world = pillSwitch(page, 'world');
      await expect(world.pill('React')).toBeChecked();

      await world.choose('Vanilla');

      await expect(world.pill('Vanilla')).toBeChecked();
      await expect(world.pill('React')).not.toBeChecked();
    });
  });
}
