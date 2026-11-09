import {DataRouter, NavigationType, RouterState} from 'react-router';
import {empty, Maybe, maybe, not, notEmpty} from '@ryandur/sand';
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

// the router changes the address before React draws the page it leads to, and a fold opening grows the page for a
// few frames after, so the landing looks for its target each frame and waits for it to hold still
const landOnceItHoldsStill = (router: DataRouter, hash: string, id: string): void => {
  const watched = (watch: Watch, foldsOpened: boolean): void => {
    requestAnimationFrame(() => {
      const target = targetNamedBy(id);
      const opened = foldsOpened || target.map(found => {
        openFoldsAround(found);
        return true;
      }).orElse(false);
      const next = target.map(found => landing.watched(watch, measured(found))).orElse(landing.lookedFor(watch));
      if (next === 'land') {
        if (router.state.location.hash === hash) target.map(landedOn);
      } else if (next !== 'given up') {
        watched(next, opened);
      }
    });
  };
  watched(landing.watching, false);
};

const landWhereAsked = (router: DataRouter, hash: string): void => {
  maybe(hash.slice(1), notEmpty).map(id => landOnceItHoldsStill(router, hash, id));
};

// the browser resolves a fragment before the page has drawn it, and restores back and forward by itself
const follow = (router: DataRouter): (() => void) => {
  let followedKey = '';
  const arrived = ({initialized, location, historyAction, navigation}: RouterState): void => {
    if (not(initialized) || navigation.state !== 'idle' || location.key === followedKey) return;
    const opening = empty(followedKey);
    followedKey = location.key;
    if (opening || historyAction !== NavigationType.Pop) landWhereAsked(router, location.hash);
  };
  arrived(router.state);
  return router.subscribe(arrived);
};

export const arrival = {follow};
