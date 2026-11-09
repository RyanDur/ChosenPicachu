const framesHeldStill = 2;
const framesBeforeLandingAnyway = 120;
const millisecondsLookingForTheTarget = 3000;

// a fold's ::details-content opens a few frames after its open attribute and grows the page under a target that
// is already laid out, and Chromium lists no animation for it, so the landing waits for the page to stop growing
export type Measured = {readonly top: number; readonly pageHeight: number; readonly visible: boolean};
export type Watch = {readonly last?: Measured; readonly held: number; readonly waited: number; readonly since: number};

const watching = (since: number): Watch => ({held: 0, waited: 0, since});

const unmoved = (now: Measured, last?: Measured): boolean =>
  last?.top === now.top && last.pageHeight === now.pageHeight;

const watched = (watch: Watch, now: Measured): Watch | 'land' => {
  const held = now.visible && unmoved(now, watch.last) ? watch.held + 1 : 0;
  return held >= framesHeldStill || watch.waited >= framesBeforeLandingAnyway
    ? 'land'
    : {...watch, last: now, held, waited: watch.waited + 1};
};

const lookedFor = (watch: Watch, now: number): Watch | 'given up' =>
  now - watch.since >= millisecondsLookingForTheTarget ? 'given up' : watch;

export const landing = {watching, watched, lookedFor};
