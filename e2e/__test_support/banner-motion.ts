import type {Locator, Page} from '@playwright/test';

export type Frame = {track: number; seen: boolean; gone: boolean};

const sampled = (page: Page, which: 'newest' | 'oldest', sideways: boolean): Promise<Frame[]> => page.evaluate(({which, sideways}) =>
  new Promise<Frame[]>(resolve => {
    const list = document.querySelector('#banners ul');
    if (list === null) throw new Error('the banners have no list');
    const before = [...list.children];
    const frames: Frame[] = [];
    const start = performance.now();
    let watched: Element | null = which === 'oldest' ? before[0] ?? null : null;
    const sample = (): void => {
      watched ??= [...list.children].find(item => !before.includes(item)) ?? null;
      if (watched !== null) {
        const gone = !watched.isConnected;
        const box = watched.getBoundingClientRect();
        const news = watched.firstElementChild?.getBoundingClientRect() ?? new DOMRect(-1, -1, 0, 0);
        const seen = !gone && news.bottom > 0 && news.top < innerHeight && news.right > 0 && news.left < innerWidth;
        frames.push({track: gone ? 0 : Math.round(sideways ? box.width : box.height), seen, gone});
        if (gone) {
          resolve(frames);
          return;
        }
      }
      if (performance.now() - start > 2500) resolve(frames);
      else requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  }), {which, sideways});

export const bannerMotion = (page: Page, raise: Locator, sideways: boolean) => ({
  arriving: async (): Promise<Frame[]> => {
    const frames = sampled(page, 'newest', sideways);
    await raise.click();
    return frames;
  },
  leaving: async (): Promise<Frame[]> => {
    const frames = sampled(page, 'oldest', sideways);
    await page.getByRole('button', {name: /^dismiss /}).first().click();
    return frames;
  }
});

export const gapOpensBeforeTheBannerIsSeen = (frames: Frame[]): string[] => {
  const full = Math.max(...frames.map(({track}) => track));
  const firstSeen = frames.findIndex(({seen}) => seen);
  return [
    ...(frames.some(({track, seen}) => track > 0 && track < full && !seen) ? [] : ['no frame shows the gap opening with the banner off screen']),
    ...(firstSeen >= 0 && frames.slice(firstSeen).every(({track}) => track >= full - 1) ? [] : ['the banner was seen before its gap had opened']),
    ...(frames[frames.length - 1]?.seen ? [] : ['the banner never came on screen'])
  ];
};

export const bannerLeavesBeforeTheGapCloses = (frames: Frame[]): string[] => {
  const full = frames[0]?.track ?? 0;
  const firstShrunk = frames.findIndex(({track}) => track < full - 1);
  return [
    ...(firstShrunk > 0 && frames.slice(firstShrunk).every(({seen}) => !seen) ? [] : ['the gap closed while the banner was still on screen']),
    ...(frames[frames.length - 1]?.gone ? [] : ['the banner never left the list'])
  ];
};
