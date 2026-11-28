import {expect, test, type Locator} from '@playwright/test';

const stage = 'http://localhost:4531/ChosenPicachu/';

type Landing = {highlight: string; pill: string; gliding: number};

const landingOnceHydrated = async (radio: Locator): Promise<Landing> => {
  for (;;) {
    const landing = await radio.evaluate((input: HTMLInputElement): Landing | null => {
      const pill = input.parentElement;
      const glider = pill?.parentElement;
      if (input.disabled || !pill || !glider) return null;
      const highlight = getComputedStyle(glider, '::before');
      const gliderBox = glider.getBoundingClientRect();
      const pillBox = pill.getBoundingClientRect();
      const round = (...sides: number[]): string => sides.map(Math.round).join(', ');
      return {
        highlight: round(
          gliderBox.left + glider.clientLeft + parseFloat(highlight.left),
          gliderBox.top + glider.clientTop + parseFloat(highlight.top),
          parseFloat(highlight.width),
          parseFloat(highlight.height)),
        pill: round(pillBox.left, pillBox.top, pillBox.width, pillBox.height),
        gliding: glider.getAnimations({subtree: true}).length
      };
    });
    if (landing) return landing;
  }
};

test('part 2 opened on ?second-position=fixed has its highlight on fixed at hydration, with nothing gliding', async ({browser}) => {
  const context = await browser.newContext({viewport: {width: 1440, height: 900}, reducedMotion: 'no-preference'});
  const page = await context.newPage();
  await page.goto(`${stage}demos/z-index/how-position-places-a-box/?second-position=fixed`);
  test.skip(!await page.evaluate(() => CSS.supports('anchor-scope: --x')),
    'without anchor positioning the chosen pill fills itself, so there is no highlight to glide');
  const fixed = page.getByRole('group', {name: 'Second’s position is'}).getByRole('radio', {name: 'fixed', exact: true});

  const {highlight, pill, gliding} = await landingOnceHydrated(fixed);

  expect(highlight).toBe(pill);
  expect(gliding).toBe(0);
  await context.close();
});
