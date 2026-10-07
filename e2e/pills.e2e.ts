import {Page, expect, test} from '@playwright/test';
import {demoSettings, desktop, fingerTap, iPadUpright, iPhone, phoneSideways, pillSwitch} from './__test_support';

const choicesOn = [
  {demo: 'the accordions demo', at: 'demos/?tab=accordions', groups: ['fold type', 'fold motion']},
  {demo: 'the tables demo', at: 'demos/?tab=tables', groups: ['world', 'pace', 'origin', 'motion']},
  {demo: 'the z-index demo', at: 'demos/?tab=z-index', groups: ['card raised', 'side', 'align', 'entrance', 'stack']}
];

const shownGroup = async (page: Page, group: string): Promise<void> => {
  const hidden = page.getByRole('group', {name: group, exact: true, includeHidden: true}).first();
  await expect(hidden.getByRole('radio', {includeHidden: true}).first()).toBeAttached();
  if (await hidden.isHidden()) await demoSettings(page).press();
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
          await shownGroup(page, group);
          const pills = pillSwitch(page, group);
          const [names, startedOn] = [await pills.names(), await pills.chosen()];
          expect(names.length, group).toBeGreaterThan(1);
          const eachTapMovesTheChoice = [...names.filter(name => name !== startedOn), startedOn];

          for (const name of eachTapMovesTheChoice) {
            await fingerTap(page, pills.wordsOf(name));
            await expect(pills.pill(name), `${group}: ${name}`).toBeChecked();
          }
        }
      });
    }
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
