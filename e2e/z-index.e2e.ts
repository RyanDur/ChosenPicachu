import {Page, expect, test} from '@playwright/test';
import {type Card, stackingPile} from './__test_support';

test('the z-index cards start in a stack, the button spreads them, and pressing it again stacks them', async ({page}) => {
  await page.goto('demos/?tab=z-index');
  const layers = page.getByRole('region', {name: 'stacking with z-index'}).getByRole('listitem');
  const boxes = async () => [await layers.first().boundingBox(), await layers.last().boundingBox()];
  const stacked = async () => {
    const [first, last] = await boxes();
    return first !== null && last !== null && first.y === last.y;
  };
  const spread = async () => {
    const [first, last] = await boxes();
    return first !== null && last !== null && last.y >= first.y + first.height;
  };
  await expect.poll(stacked).toBe(true);

  await page.getByRole('button', {name: 'Expand'}).click();
  await expect.poll(spread).toBe(true);

  await page.getByRole('button', {name: 'Collapse'}).click();
  await expect.poll(stacked).toBe(true);
});

test('the pile opens with Third on top, then Second, then First, in the order the code lists them', async ({page}) => {
  await page.goto('demos/?tab=z-index');

  await expect.poll(() => stackingPile(page).cardsFromTheTop()).toEqual(['Third', 'Second', 'First']);
});

for (const {input, raising} of [
  {input: 'a pointer', raising: (page: Page, card: Card) => stackingPile(page).raise(card)},
  {input: 'the keyboard', raising: (page: Page, card: Card) => stackingPile(page).raiseByKeyboard(card)}
]) {
  for (const {card, fromTheTop} of [
    {card: 'First', fromTheTop: ['First', 'Third', 'Second']},
    {card: 'Second', fromTheTop: ['Second', 'Third', 'First']}
  ] as const) {
    test(`${card} raised by ${input} lands on top, and the others keep their order under it`, async ({page}) => {
      await page.goto('demos/?tab=z-index');
      await expect.poll(() => stackingPile(page).cardsFromTheTop()).toEqual(['Third', 'Second', 'First']);

      await raising(page, card);

      await expect.poll(() => stackingPile(page).cardsFromTheTop()).toEqual(fromTheTop);
    });
  }
}

test('Second raised while the pile is spread comes down on top when it is collapsed', async ({page}) => {
  await page.goto('demos/?tab=z-index');
  const pile = stackingPile(page);
  await pile.expand();

  await pile.raise('Second');
  await pile.collapse();

  await expect.poll(() => pile.cardsFromTheTop()).toEqual(['Second', 'Third', 'First']);
});
