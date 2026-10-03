import {expect, test as base} from '@playwright/test';
import {accordionsTab, showing, type Build, type Part, textOf} from './accordions';
import {desktop, iPhone} from './devices';
import {firstHeightAfter, heightByTheNextFrame, heightOnceSettled, motionOf, type Frame, type Moment} from './motion';

export const test = base.extend<object, {workerOfItsOwn: string}>({workerOfItsOwn: ['the accordions tab', {scope: 'worker', option: true}]});

export const layoutRounding = 1;

export const heightMoved = {
  open: (frames: Pick<Frame, 'height'>[]): void => expect(frames.at(-1)?.height).toBeGreaterThan(frames.at(0)?.height ?? 0),
  closed: (frames: Pick<Frame, 'height'>[]): void => expect(frames.at(-1)?.height).toBeLessThan(frames.at(0)?.height ?? 0)
};

const shareOfTheTimeForEachQuarter = (frames: Moment[]): number[] => {
  const from = frames.at(0);
  const to = frames.at(-1);
  if (!from || !to) {
    return [];
  }
  const settled = frames.find(({height}) => height === to.height) ?? to;
  const duration = settled.at - from.at;
  const travel = to.height - from.height;
  const reached = (share: number): number =>
    (frames.find(({height}) => (height - from.height) / travel >= share) ?? settled).at - from.at;
  const marks = [0, reached(0.25), reached(0.5), reached(0.75), duration];
  return marks.slice(1).map((mark, at) => Math.round((mark - marks[at]) / duration * 100) / 100);
};

export const unevenQuarters = (frames: Moment[]): number[] =>
  shareOfTheTimeForEachQuarter(frames).filter(share => !(share >= 1 / 10 && share <= 1 / 2));

const motionSliding = {
  open: async (part: Part): Promise<Moment[]> => {
    await expect(part.fold).toBeVisible();
    const moving = motionOf(part.fold);
    await part.open();
    return moving;
  },
  closed: async (part: Part): Promise<Moment[]> => {
    await part.open();
    await heightOnceSettled(part.fold);
    const moving = motionOf(part.fold);
    await part.close();
    return moving;
  }
};

const putAway = async (part: Part): Promise<void> => {
  await heightOnceSettled(part.fold);
  if (await part.isOpen()) {
    await part.close();
    await heightOnceSettled(part.fold);
  }
};

const byTextLength = async (parts: Part[]): Promise<Part[]> => {
  const lengths = await Promise.all(parts.map(async part => (await textOf(part).textContent() ?? '').length));
  return parts.map((part, at) => ({part, length: lengths[at]})).sort((one, other) => other.length - one.length).map(({part}) => part);
};

export const everyBuildJourneys = (fold: readonly Build[]): void => {
  for (const build of fold) {
    test(`a reader who asks for less motion gets ${build} open at once`, async ({page, browserName}) => {
      test.skip(build.includes('details') && browserName !== 'chromium', 'only chromium animates a details element to its natural height');
      await page.emulateMedia({reducedMotion: 'reduce'});
      await page.goto(showing(build));
      const part = accordionsTab(page).firstPartOf(build);
      await expect(part.fold).toBeVisible();
      const closed = await heightByTheNextFrame(part.fold);

      const firstMoved = firstHeightAfter(part.fold, closed);
      await part.open();
      await expect.poll(part.isOpen).toBe(true);

      expect(await firstMoved).toBeGreaterThan(closed);
      expect(await firstMoved).toBe(await heightOnceSettled(part.fold));
    });
  }

  for (const build of fold.filter(build => build !== 'the details build')) {
    test(`a keyboard reader opens the first fold of ${build} and reads its text`, async ({page}) => {
      await page.goto(showing(build));
      const part = accordionsTab(page).firstPartOf(build);
      await expect(part.fold).toBeVisible();

      await part.openByKeyboard();

      await expect.poll(part.isOpen).toBe(true);
      await expect.poll(part.showsText).toBe(true);
    });
  }

  for (const build of fold) {
    test(`a reader who asks for less motion gets ${build} open at once under the drawer`, async ({page}) => {
      await page.emulateMedia({reducedMotion: 'reduce'});
      await page.goto(showing(build, 'drawer'));
      const part = accordionsTab(page).firstPartOf(build);
      const closed = await heightByTheNextFrame(part.fold);
      const firstMoved = firstHeightAfter(part.fold, closed);

      await part.open();

      expect(await firstMoved).toBeGreaterThan(closed);
      expect(await firstMoved).toBe(await heightOnceSettled(part.fold));
    });
  }

  for (const build of fold) {
    test(`with Static chosen, a fold in ${build} opens fully in one frame`, async ({page}) => {
      await page.goto(showing(build, 'static'));
      const part = accordionsTab(page).firstPartOf(build);
      const closedHeight = await heightByTheNextFrame(part.fold);
      const firstMoved = firstHeightAfter(part.fold, closedHeight);

      await part.open();

      expect(await firstMoved).toBeGreaterThan(closedHeight);
      expect(await firstMoved).toBe(await heightOnceSettled(part.fold));
    });
  }
};

export const evenMotionJourneys = (fold: readonly Build[]): void => {
  for (const {size, device} of [{size: 390, device: iPhone}, {size: 1440, device: desktop}]) {
    test.describe(`at ${size} wide`, () => {
      test.use(device);

      for (const build of fold) {
        for (const style of ['reveal', 'drawer'] as const) {
          for (const direction of ['open', 'closed'] as const) {
            test(`the longest and shortest parts of ${build} slide ${direction} by the ${style} in one even motion`, async ({page}) => {
              await page.goto(showing(build, style));
              await expect(accordionsTab(page).firstPartOf(build).fold).toBeVisible();
              const parts = await byTextLength(await accordionsTab(page).partsOf(build));
              const longest = await motionSliding[direction](parts[0]);
              await putAway(parts[0]);
              const shortest = await motionSliding[direction](parts.at(-1) ?? parts[0]);

              for (const frames of [longest, shortest]) {
                heightMoved[direction](frames);
                expect(unevenQuarters(frames)).toEqual([]);
              }
            });
          }
        }
      }
    });
  }
};
