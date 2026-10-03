import {expect, type Locator} from '@playwright/test';
import {
  accordionsTab,
  desktop,
  firstHeightAfter,
  heightByTheNextFrame,
  heightOnceSettled,
  measuredBuilds,
  motionOf,
  showing,
  textOf,
  type Part
} from './__test_support';
import {evenMotionJourneys, everyBuildJourneys, heightMoved, layoutRounding, test, unevenQuarters} from './__test_support/fold-journeys';

// WebKit stopped starting page.goto after about 90 navigations of these journeys mixed with the tab's others in one worker; a worker of their own keeps them apart
test.use({workerOfItsOwn: 'the measured folds'});

everyBuildJourneys(measuredBuilds);
evenMotionJourneys(measuredBuilds);
test('in the measured radio build, the part that closes when another is pressed slides shut in one even motion', async ({page}) => {
  await page.goto(showing('the measured radio build'));
  const [first, second] = [accordionsTab(page).partOf('the measured radio build', 0), accordionsTab(page).partOf('the measured radio build', 1)];
  await first.open();
  await heightOnceSettled(first.fold);

  const closing = motionOf(first.fold);
  await second.open();
  const frames = await closing;

  heightMoved.closed(frames);
  expect(unevenQuarters(frames)).toEqual([]);
});

const gapUnderItsText = async (part: Part): Promise<number> => {
  const [fold, text] = await Promise.all([part.fold.boundingBox(), textOf(part).boundingBox()]);
  return Math.abs((fold?.y ?? 0) + (fold?.height ?? 0) - (text?.y ?? Infinity) - (text?.height ?? 0));
};

const tallestOf = async (parts: Part[]): Promise<Part> => {
  const heights = await Promise.all(parts.map(part => textOf(part).evaluate(text => text.getBoundingClientRect().height)));
  return parts[heights.indexOf(Math.max(...heights))];
};

test.describe('a desktop', () => {
  test.use(desktop);

  for (const build of measuredBuilds) {
    test(`an open part of ${build} still ends at its text after the window narrows and widens`, async ({page}) => {
      await page.goto(showing(build));
      await expect(accordionsTab(page).firstPartOf(build).fold).toBeVisible();
      const part = await tallestOf(await accordionsTab(page).partsOf(build));
      await part.open();
      await heightOnceSettled(part.fold);

      for (const width of [390, 1440]) {
        await page.setViewportSize({width, height: 900});
        await expect.poll(() => gapUnderItsText(part)).toBeLessThanOrEqual(layoutRounding);
      }
    });
  }
});

const pressesNeverReachTheScript = (): void => ['click', 'change'].forEach(press =>
  window.addEventListener(press, event => event.stopImmediatePropagation(), true));

for (const build of measuredBuilds) {
  test(`with its script never hearing the press, a part of ${build} still opens and closes, at once`, async ({page}) => {
    await page.addInitScript(pressesNeverReachTheScript);
    await page.goto(showing(build));
    const part = accordionsTab(page).firstPartOf(build);
    await expect(part.fold).toBeVisible();
    const closed = await heightByTheNextFrame(part.fold);
    const firstMoved = firstHeightAfter(part.fold, closed);

    await part.open();

    expect(await firstMoved).toBe(await heightOnceSettled(part.fold));
    await part.close();
    await expect.poll(part.showsText).toBe(false);
  });
}

type Turn = {before: number; turned: number; end: number};

const pressedAgainAtAQuarter = async (fold: Locator, first: Locator, second: Locator, travel: {from: number; to: number}): Promise<Turn> =>
  fold.evaluate((element, {firstPress, secondPress, from, to}) => new Promise<Turn>(resolve => {
    const height = (): number => element.getBoundingClientRect().height;
    const moving = (): boolean => element.getAnimations({subtree: true})
      .some(motion => motion instanceof CSSTransition && motion.transitionProperty === 'height');
    const quarter = from + (to - from) / 4;
    const atEnd = (turn: Omit<Turn, 'end'>) => (): void => {
      if (moving()) {
        requestAnimationFrame(atEnd(turn));
      } else {
        resolve({...turn, end: height()});
      }
    };
    const watched = (): void => {
      const before = height();
      if (to > from ? before <= quarter : before >= quarter) {
        requestAnimationFrame(watched);
      } else if (secondPress instanceof HTMLElement) {
        secondPress.click();
        requestAnimationFrame(atEnd({before, turned: height()}));
      }
    };
    if (firstPress instanceof HTMLElement) {
      firstPress.click();
      requestAnimationFrame(watched);
    }
  }), {firstPress: await first.elementHandle(), secondPress: await second.elementHandle(), ...travel});

for (const build of measuredBuilds) {
  for (const {first, start} of [{first: 'open', start: 'shut'}, {first: 'close', start: 'open'}] as const) {
    test(`a part of ${build} pressed again while it moves turns around from where it is, ${first} first`, async ({page}) => {
      await page.goto(showing(build));
      const part = accordionsTab(page).firstPartOf(build);
      const {opens, shuts} = accordionsTab(page).pressesOfTheFirstPart(build);
      const shut = await heightOnceSettled(part.fold);
      await part.open();
      const open = await heightOnceSettled(part.fold);
      if (start === 'shut') {
        await part.close();
        await heightOnceSettled(part.fold);
      }

      const turn = first === 'open'
        ? await pressedAgainAtAQuarter(part.fold, opens, shuts, {from: shut, to: open})
        : await pressedAgainAtAQuarter(part.fold, shuts, opens, {from: open, to: shut});

      for (const height of [turn.before, turn.turned]) {
        expect(height).toBeGreaterThan(shut + layoutRounding);
        expect(height).toBeLessThan(open - layoutRounding);
      }
      expect(Math.abs(turn.end - (first === 'open' ? shut : open))).toBeLessThanOrEqual(layoutRounding);
    });
  }
}

const pressedInTheFrameMotionStarts = async (first: Locator, second: Locator): Promise<void> =>
  first.evaluate((firstPress, secondPress) => new Promise<void>(resolve => {
    if (firstPress instanceof HTMLElement && secondPress instanceof HTMLElement) {
      firstPress.click();
      requestAnimationFrame(() => {
        secondPress.click();
        resolve();
      });
    }
  }), await second.elementHandle());

for (const build of measuredBuilds) {
  test.describe('a desktop', () => {
    test.use(desktop);

    test(`an opening part of ${build} switched to Static mid-motion still ends at its text after the window narrows`, async ({page}) => {
      await page.goto(showing(build));
      const part = accordionsTab(page).firstPartOf(build);
      await heightOnceSettled(part.fold);

      await pressedInTheFrameMotionStarts(
        accordionsTab(page).pressesOfTheFirstPart(build).opens,
        page.getByRole('group', {name: 'fold motion'}).getByRole('radio', {name: 'Static'}));
      await page.setViewportSize({width: 390, height: 900});

      await expect.poll(() => gapUnderItsText(part)).toBeLessThanOrEqual(layoutRounding);
    });

    test(`an open part of ${build} closed and opened again in one frame still ends at its text after the window narrows`, async ({page}) => {
      await page.goto(showing(build));
      const part = accordionsTab(page).firstPartOf(build);
      const {opens, shuts} = accordionsTab(page).pressesOfTheFirstPart(build);
      await part.open();
      await heightOnceSettled(part.fold);

      await shuts.evaluate((shut, open) => {
        if (shut instanceof HTMLElement && open instanceof HTMLElement) {
          shut.click();
          open.click();
        }
      }, await opens.elementHandle());
      await heightOnceSettled(part.fold);
      await page.setViewportSize({width: 390, height: 900});

      await expect.poll(() => gapUnderItsText(part)).toBeLessThanOrEqual(layoutRounding);
    });
  });
}
