import {DataRouter, Location, NavigationType, RouterState} from 'react-router';
import {empty, Maybe, maybe, notEmpty} from '@ryandur/sand';
import {landing, Measured, Watch} from './landing';

export type Page =
  Pick<Window, 'document' | 'scrollY' | 'requestAnimationFrame' | 'cancelAnimationFrame' | 'addEventListener'>;

export type Arrival = {
  readonly follow: (router: DataRouter) => () => void;
  readonly drawn: (location: Location) => void;
};

type Follower = Arrival['drawn'];

const targetNamedBy = (page: Page, id: string): Maybe<Element> => maybe(page.document.getElementById(id));

const measured = (page: Page, target: Element): Measured => ({
  top: target.getBoundingClientRect().top + page.scrollY,
  pageHeight: page.document.documentElement.scrollHeight,
  visible: target.checkVisibility()
});

const landingAround = (target: Element): Element => target.closest('[tabindex="-1"]') ?? target;

const openFoldsAround = (target: Element): void => {
  const fold = target.closest('details:not([open])');
  if (fold instanceof HTMLDetailsElement) {
    fold.open = true;
    openFoldsAround(fold);
  }
};

const landedOn = (target: Element): void => {
  target.scrollIntoView();
  const around = landingAround(target);
  if (around instanceof HTMLElement) around.focus({preventScroll: true});
};

const readerMoves = ['pointerdown', 'wheel', 'touchmove', 'keydown'] as const;

const landOnceItHoldsStill = (page: Page, id: string): (() => void) => {
  let frameRequest = 0;
  const readerMoved = new AbortController();
  const stop = (): void => {
    page.cancelAnimationFrame(frameRequest);
    readerMoved.abort();
  };
  const lookNextFrame = (foldsOpened: boolean, watch?: Watch): void => {
    frameRequest = page.requestAnimationFrame(now => {
      const looking = watch ?? landing.watching(now);
      const target = targetNamedBy(page, id);
      const opened = foldsOpened || target.map(found => {
        openFoldsAround(found);
        return true;
      }).orElse(false);
      const next = target.map(found => landing.watched(looking, measured(page, found)))
        .orElse(landing.lookedFor(looking, now));
      if (next === 'land') target.map(landedOn);
      if (next === 'land' || next === 'given up') readerMoved.abort();
      else lookNextFrame(opened, next);
    });
  };
  readerMoves.forEach(move =>
    page.addEventListener(move, stop, {capture: true, passive: true, signal: readerMoved.signal}));
  lookNextFrame(false);
  return stop;
};

const nothingToStop = (): void => undefined;

const landWhereAsked = (page: Page, hash: string): (() => void) =>
  maybe(hash.slice(1), notEmpty).map(id => landOnceItHoldsStill(page, id)).orElse(nothingToStop);

// the browser resolves a fragment before the page has drawn it, and restores back and forward by itself; the router
// moves on before React draws the page it leads to, so arrival lands only on a location React has drawn
const following = (page: Page, followers: Set<Follower>) => (router: DataRouter): (() => void) => {
  let followedKey = '';
  let stopLanding = nothingToStop;
  const arrivedAt = (location: Location): void => {
    const {location: current, historyAction, navigation} = router.state;
    if (navigation.state !== 'idle' || location.key !== current.key || location.key === followedKey) return;
    const opening = empty(followedKey);
    followedKey = location.key;
    stopLanding();
    stopLanding = opening || historyAction !== NavigationType.Pop ? landWhereAsked(page, location.hash) : nothingToStop;
  };
  const routerMoved = ({initialized, location, navigation}: RouterState): void => {
    if (navigation.state !== 'idle') stopLanding();
    else if (initialized && empty(followedKey)) arrivedAt(location);
  };
  routerMoved(router.state);
  followers.add(arrivedAt);
  const unsubscribe = router.subscribe(routerMoved);
  return () => {
    unsubscribe();
    followers.delete(arrivedAt);
    stopLanding();
  };
};

export const arrival = (page: Page): Arrival => {
  const followers = new Set<Follower>();
  return {
    follow: following(page, followers),
    drawn: location => followers.forEach(follower => follower(location))
  };
};
