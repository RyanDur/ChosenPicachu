import {expect, test} from '@playwright/test';
import {headingsBrokenMidWord, iPadUpright, iPhone, phoneSideways, stages} from './__test_support';

for (const {reader, device} of [{reader: 'a phone', device: iPhone}, {reader: 'a phone held sideways', device: phoneSideways}]) {
  test.describe(reader, () => {
    test.use(device);

    test('reads every roster heading as a word', async ({page}) => {
      await page.goto('users');
      const roster = page.getByRole('region', {name: 'User Candidates'});
      await expect(roster.getByRole('columnheader').first()).toBeVisible({timeout: 30_000});

      await expect.poll(() => headingsBrokenMidWord(roster)).toEqual([]);
    });
  });
}

for (const stage of stages) {
  for (const {reader, device} of [{reader: 'an iPad held upright', device: iPadUpright}, {reader: 'a phone', device: iPhone}]) {
    test.describe(`${reader}, in ${stage.name}`, () => {
      test.use(device);

      test('reads every table heading as a word', async ({page}) => {
        await page.goto(stage.at);
        const table = stage.table(page);
        await expect(table.getByRole('columnheader', {name: 'trades'})).toBeVisible({timeout: 30_000});

        await expect.poll(() => headingsBrokenMidWord(table)).toEqual([]);
      });
    });
  }
}
