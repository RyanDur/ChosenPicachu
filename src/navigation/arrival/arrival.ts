import {DataRouter, Location, NavigationType, RouterState} from 'react-router';
import {empty, Maybe, maybe, notEmpty} from '@ryandur/sand';
import {landing, Measured, Watch} from './landing';

const targetNamedBy = (id: string): Maybe<Element> => maybe(document.getElementById(id));

const measured = (target: Element): Measured => ({
  top: target.getBoundingClientRect().top + window.scrollY,
  pageHeight: document.documentElement.scrollHeight,
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

const landOnceItHoldsStill = (id: string): (() => void) => {
  let frameRequest = 0;
  const readerMoved = new AbortController();
  const stop = (): void => {
    cancelAnimationFrame(frameRequest);
    readerMoved.abort();
  };
  const lookNextFrame = (foldsOpened: boolean, watch?: Watch): void => {
    frameRequest = requestAnimationFrame(now => {
      const looking = watch ?? landing.watching(now);
      const target = targetNamedBy(id);
      const opened = foldsOpened || target.map(found => {
        openFoldsAround(found);
        return true;
      }).orElse(false);
      const next = target.map(found => landing.watched(looking, measured(found)))
        .orElse(landing.lookedFor(looking, now));
      if (next === 'land') target.map(landedOn);
      if (next === 'land' || next === 'given up') readerMoved.abort();
      else lookNextFrame(opened, next);
    });
  };
  readerMoves.forEach(move =>
    window.addEventListener(move, stop, {capture: true, passive: true, signal: readerMoved.signal}));
  lookNextFrame(false);
  return stop;
};

const nothingToStop = (): void => undefined;

const landWhereAsked = (hash: string): (() => void) =>
  maybe(hash.slice(1), notEmpty).map(landOnceItHoldsStill).orElse(nothingToStop);

const followers = new Set<(location: Location) => void>();

const drawn = (location: Location): void => followers.forEach(follower => follower(location));

// the browser resolves a fragment before the page has drawn it, and restores back and forward by itself; the router
// moves on before React draws the page it leads to, so arrival lands only on a location React has drawn
const follow = (router: DataRouter): (() => void) => {
  let followedKey = '';
  let stopLanding = nothingToStop;
  const arrivedAt = (location: Location): void => {
    const {location: current, historyAction, navigation} = router.state;
    if (navigation.state !== 'idle' || location.key !== current.key || location.key === followedKey) return;
    const opening = empty(followedKey);
    followedKey = location.key;
    stopLanding();
    stopLanding = opening || historyAction !== NavigationType.Pop ? landWhereAsked(location.hash) : nothingToStop;
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

export const arrival = {follow, drawn};
