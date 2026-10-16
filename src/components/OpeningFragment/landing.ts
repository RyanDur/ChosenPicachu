const framesHeldStill = 2;
const framesBeforeLandingAnyway = 120;

// a fold's ::details-content opens a few frames after its open attribute and grows the page under a target that
// is already laid out, and Chromium lists no animation for it, so the landing waits for the page to stop growing
export type Measured = {readonly top: number; readonly pageHeight: number; readonly visible: boolean};
export type Watch = {readonly last?: Measured; readonly held: number; readonly waited: number};

export const watching: Watch = {held: 0, waited: 0};

const unmoved = (now: Measured, last?: Measured): boolean => last?.top === now.top && last.pageHeight === now.pageHeight;

export const watched = (watch: Watch, now: Measured): Watch | 'land' => {
  const held = now.visible && unmoved(now, watch.last) ? watch.held + 1 : 0;
  return held >= framesHeldStill || watch.waited >= framesBeforeLandingAnyway
    ? 'land'
    : {last: now, held, waited: watch.waited + 1};
};
