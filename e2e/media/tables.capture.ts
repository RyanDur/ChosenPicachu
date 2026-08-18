import {expect, test} from '@playwright/test';
import {
  boxFor,
  calloutOn,
  chipInto,
  clearCallouts,
  grabbed,
  headerOrder,
  livingCard,
  mediaRoot,
  recording,
  shot,
  slowDrag,
  staged,
  tableFrame
} from './capture';

// the reels are dial-tuned exactly as the prose and the code are: one per variant,
// indexed the way the sources already are, and the parity law makes the footage
// world-agnostic, so the default react world sits for the portrait

const demos = '/ChosenPicachu/demos/';

const variants = ['eager', 'lazy'].flatMap(pace =>
  ['keep', 'hide'].flatMap(origin =>
    ['animated', 'static'].map(motion => ({pace, origin, motion}))));

const urlOf = (params: {pace: string; origin: string; motion: string}) =>
  `${demos}?tab=tables&pace=${params.pace}&origin=${params.origin}&motion=${params.motion}`;

for (const variant of variants) {
  const name = `${variant.pace}-${variant.origin}-${variant.motion}`;

  test(`sort reel: ${name}`, async ({browser}) => {
    const {page, finish} = await recording(browser, urlOf(variant));
    const card = await livingCard(page);
    const frame = await tableFrame(card);
    await shot(page, frame, `${mediaRoot}/sort/poster-${name}.png`);

    const trades = card.getByRole('columnheader', {name: /^trades/});
    const sells = card.getByRole('columnheader', {name: /^sells/});
    const from = await grabbed(page, trades);
    const past = await boxFor(sells);
    await slowDrag(page, from, past.x + past.width * 0.8);
    await page.waitForTimeout(700);
    await page.mouse.up();
    await page.waitForTimeout(1400);

    expect(await headerOrder(card)).toEqual(['window', 'buys', 'sells', 'trades', 'volume', 'vwap', 'change']);
    await finish(`${mediaRoot}/sort/${name}.webm`, frame);
  });
}

test('sort stills: the lift, the strike, the slide', async ({browser}) => {
  const page = await staged(browser, `${demos}?tab=tables&pace=eager&origin=hide&motion=animated`);
  const card = await livingCard(page);
  const frame = await tableFrame(card);

  const trades = card.getByRole('columnheader', {name: /^trades/});
  const buys = card.getByRole('columnheader', {name: /^buys/});
  const neighbour = await boxFor(buys);
  const from = await grabbed(page, trades, 0.9);
  await slowDrag(page, from, from.x + from.width * 0.9 + 24, {steps: 6, anchor: 0.9});

  const ghost = page.locator('table.column-ghost');
  await expect(ghost).toBeVisible();
  const gap = card.locator('thead th.hide');
  await expect(gap).toHaveCount(1);
  await calloutOn(ghost, 'the ghost rides the hand', true);
  await calloutOn(gap, 'the gap stays open behind it');
  await shot(page, frame, `${mediaRoot}/sort/stills/the-lift.png`);
  await clearCallouts(page);

  await slowDrag(page, from, neighbour.x + neighbour.width * 0.2, {steps: 6, anchor: 0.9});
  await expect(gap).toHaveCount(1);
  await calloutOn(buys, 'the inner half earns the swap');
  await shot(page, frame, `${mediaRoot}/sort/stills/the-strike.png`);
  await clearCallouts(page);

  await slowDrag(page, from, neighbour.x + neighbour.width * 0.65, {steps: 2, anchor: 0.9});
  await page.evaluate(() => document.getAnimations().forEach(animation => animation.pause()));
  const displaced = card.locator('thead th[class*="displaced"]');
  await expect(displaced).toHaveCount(1);
  await calloutOn(displaced, 'still drawn where it used to be');
  await shot(page, frame, `${mediaRoot}/sort/stills/the-slide.png`);
  await clearCallouts(page);

  await page.evaluate(() => document.getAnimations().forEach(animation => animation.play()));
  await page.mouse.up();
  expect(await headerOrder(card)).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
});

for (const motion of ['animated', 'static']) {
  test(`menu reel: ${motion}`, async ({browser}) => {
    const {page, finish} = await recording(browser, `${demos}?tab=tables&motion=${motion}`);
    const card = await livingCard(page);
    const frame = await tableFrame(card);
    await shot(page, frame, `${mediaRoot}/menu/poster-${motion}.png`);

    const toggle = card.getByRole('button', {name: 'sort trades'});
    await toggle.hover();
    await page.waitForTimeout(400);
    await toggle.click();
    await page.waitForTimeout(700);
    await page.getByRole('button', {name: 'descending'}).click();
    await page.waitForTimeout(1800);

    await expect(card.getByRole('columnheader', {name: /^trades/}))
      .toHaveAttribute('aria-sort', 'descending');
    await finish(`${mediaRoot}/menu/${motion}.webm`, frame);
  });
}

test('resize reel', async ({browser}) => {
  const {page, finish} = await recording(browser, `${demos}?tab=tables`);
  const card = await livingCard(page);
  const frame = await tableFrame(card);
  await shot(page, frame, `${mediaRoot}/resize/poster.png`);

  const handle = card.getByRole('button', {name: /^resize trades/});
  const from = await grabbed(page, handle);
  await slowDrag(page, from, from.x + from.width / 2 + 90);
  await page.waitForTimeout(400);
  await slowDrag(page, from, from.x + from.width / 2 + 55, {steps: 10});
  await page.mouse.up();
  await page.waitForTimeout(700);

  await expect(card.getByRole('button', {name: /resize trades, \d+%/})).toBeVisible();
  await finish(`${mediaRoot}/resize/reel.webm`, frame);
});

test('keyboard reel', async ({browser}) => {
  const {page, finish} = await recording(browser, `${demos}?tab=tables`, true);
  const card = await livingCard(page);
  const frame = await tableFrame(card);
  await chipInto(page, frame);
  await shot(page, frame, `${mediaRoot}/keyboard/poster.png`);

  const focused = () => page.evaluate(() => {
    const active = document.activeElement;
    return active === null ? '' : active.className;
  });
  let walked = 0;
  while (!(await focused()).includes('trades') && walked < 60) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(120);
    walked += 1;
  }
  expect((await focused()).includes('trades')).toBe(true);

  await page.waitForTimeout(600);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(900);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(900);
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(1100);

  expect(await headerOrder(card)).toEqual(['window', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
  await finish(`${mediaRoot}/keyboard/reel.webm`, frame);
});
