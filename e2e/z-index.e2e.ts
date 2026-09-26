import {expect, test} from '@playwright/test';

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
