import * as schema from 'schemawax';
import {maybe} from '@ryandur/sand';

export const gotoTopOfPage = (): void => {
  window.scrollTo(0, 0);
};

export type ReadersPlaces = {
  readonly keep: () => () => void;
  readonly returnTo: () => void;
};

const keptUnder = 'the reader’s places';
const places = schema.record(schema.number);

const entry = (): string => {
  const {state} = window.history;
  return typeof state === 'object' && state !== null && 'key' in state && typeof state.key === 'string' ? state.key : 'default';
};

const kept = (): Record<string, number> => {
  try {
    return places.decode(JSON.parse(sessionStorage.getItem(keptUnder) ?? '{}')) ?? {};
  } catch {
    return {};
  }
};

const storedIfAllowed = (places: Record<string, number>): void => {
  try {
    sessionStorage.setItem(keptUnder, JSON.stringify(places));
  } catch {
    // a private window or a full quota refuses storage
  }
};

export const readersPlaces = (): ReadersPlaces => {
  const at = kept();
  const note = (): void => {
    at[entry()] = window.scrollY;
  };
  const save = (): void => {
    note();
    storedIfAllowed(at);
  };
  return {
    keep: () => maybe(window.navigation).map(navigation => {
      // the browser restores the scroll on Back before the router has drawn the page it returns to
      window.history.scrollRestoration = 'manual';
      navigation.addEventListener('navigate', note);
      addEventListener('pagehide', save);
      return () => {
        navigation.removeEventListener('navigate', note);
        removeEventListener('pagehide', save);
        window.history.scrollRestoration = 'auto';
      };
    }).orElse(() => undefined),
    returnTo: () => {
      maybe(at[entry()]).map(top => window.scrollTo(0, top));
    }
  };
};
