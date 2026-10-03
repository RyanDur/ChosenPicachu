import {expect} from '@playwright/test';
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

const heightsWhile = (part: Part, act: () => Promise<void>): Promise<number[]> => Promise.all([
  part.fold.evaluate(fold => new Promise<number[]>(resolve => {
    const heights: number[] = [];
    const until = performance.now() + 900;
    const record = (): void => {
      heights.push(fold.getBoundingClientRect().height);
      if (performance.now() < until) {
        requestAnimationFrame(record);
      } else {
        resolve(heights);
      }
    };
    requestAnimationFrame(record);
  })),
  act()
]).then(([heights]) => heights);

const largestStep = (heights: number[]): number =>
  Math.max(...heights.slice(1).map((height, at) => Math.abs(height - heights[at])));

for (const build of measuredBuilds) {
  for (const {first, second, start} of [
    {first: 'open', second: 'close', start: 'shut'},
    {first: 'close', second: 'open', start: 'open'}
  ] as const) {
    test(`a part of ${build} pressed again while it moves turns around from where it is, ${first} then ${second}`, async ({page}) => {
      await page.goto(showing(build));
      const part = accordionsTab(page).firstPartOf(build);
      const shut = await heightOnceSettled(part.fold);
      await part.open();
      const open = await heightOnceSettled(part.fold);
      if (start === 'shut') {
        await part.close();
        await heightOnceSettled(part.fold);
      }

      const heights = await heightsWhile(part, async () => {
        await part[first]();
        await page.waitForTimeout(100);
        await part[second]();
      });

      expect(largestStep(heights)).toBeLessThan((open - shut) * 0.3);
    });
  }
}
