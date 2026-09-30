import {Page, expect, test} from '@playwright/test';
import {desktop, fingerTap, iPadUpright, iPhone, phoneSideways} from './__test_support';

const choicesOn = [
  {at: 'demos/?tab=accordions', groups: ['fold type', 'fold motion']},
  {at: 'demos/?tab=tables', groups: ['world', 'pace', 'origin', 'motion']},
  {at: 'demos/?tab=z-index', groups: ['side', 'align', 'entrance', 'stack']}
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

    for (const {at, groups} of choicesOn) {
      test(`every pill on ${at} takes a finger`, async ({page}) => {
        await page.goto(at);

        for (const group of groups) {
          expect((await pillHeights(page, group)).filter(height => height < 44), group).toEqual([]);
        }
      });

      test(`a finger just off a pill's middle on ${at} chooses it`, async ({page}) => {
        await page.goto(at);
        const pills = page.getByRole('group', {name: groups[0], exact: true}).first().getByRole('radio', {includeHidden: true});
        const unchosen = pills.and(page.getByRole('radio', {checked: false, includeHidden: true})).first();
        const name = await unchosen.getAttribute('value') ?? '';
        const pill = page.getByRole('group', {name: groups[0], exact: true}).first().getByText(new RegExp(`^${name}$`, 'i'));

        await fingerTap(page, pill);

        await expect(pills.and(page.getByRole('radio', {checked: true, includeHidden: true}))).toHaveAttribute('value', name);
      });
    }
  });
}

test.describe('a desktop with a mouse', () => {
  test.use(desktop);

  for (const {at, groups} of choicesOn) {
    test(`every pill on ${at} keeps its 40px`, async ({page}) => {
      await page.goto(at);

      for (const group of groups) {
        expect((await pillHeights(page, group)).filter(height => height !== 40), group).toEqual([]);
      }
    });
  }
});
