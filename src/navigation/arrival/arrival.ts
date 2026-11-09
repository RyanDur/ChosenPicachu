import {DataRouter, NavigationType} from 'react-router';
import {Maybe, maybe, notEmpty} from '@ryandur/sand';
import {landing, Measured, Watch} from './landing';

const notDrawnYet: Measured = {top: 0, pageHeight: 0, visible: false};

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
      const next = landing.watched(watch, target.map(measured).orElse(notDrawnYet));
      if (next !== 'land') {
        watched(next, opened);
      } else if (router.state.location.hash === hash) {
        target.map(landedOn);
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
  landWhereAsked(router, router.state.location.hash);
  let followedKey = router.state.location.key;
  return router.subscribe(({location, historyAction, navigation}) => {
    if (navigation.state !== 'idle' || location.key === followedKey) return;
    followedKey = location.key;
    if (historyAction !== NavigationType.Pop) landWhereAsked(router, location.hash);
  });
};

export const arrival = {follow};
