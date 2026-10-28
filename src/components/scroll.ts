import * as schema from 'schemawax';
import {maybe} from '@ryandur/sand';

export const gotoTopOfPage = (): void => {
  window.scrollTo(0, 0);
};

export const placeKept = 'the reader’s place kept';

export type ReadersPlaces = {
  readonly keep: () => () => void;
  readonly returnTo: () => void;
};

const keptUnder = 'the reader’s places';
const placesByKey = schema.record(schema.number);

const keyOf = (state: unknown): string | undefined =>
  typeof state === 'object' && state !== null && 'key' in state && typeof state.key === 'string' ? state.key : undefined;

const entryKey = (): string | undefined => keyOf(window.history.state);

// a document opened by its address carries no key from the router, and every such document would share one place
const keyTheEntry = (): void => maybe(entryKey()).either(
  () => undefined,
  () => window.history.replaceState({...window.history.state, key: crypto.randomUUID()}, ''));

const kept = (): Record<string, number> => {
  try {
    return placesByKey.decode(JSON.parse(sessionStorage.getItem(keptUnder) ?? '{}')) ?? {};
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
    maybe(entryKey()).map(key => {
      at[key] = window.scrollY;
    });
  };
  const save = (): void => {
    note();
    storedIfAllowed(at);
  };
  return {
    keep: () => maybe(window.navigation).map(navigation => {
      // the browser restores the scroll on Back before the router has drawn the page it returns to
      window.history.scrollRestoration = 'manual';
      keyTheEntry();
      navigation.addEventListener('navigate', note);
      addEventListener('pagehide', save);
      return () => {
        navigation.removeEventListener('navigate', note);
        removeEventListener('pagehide', save);
        window.history.scrollRestoration = 'auto';
      };
    }).orElse(() => undefined),
    returnTo: () => {
      maybe(entryKey()).mBind(key => maybe(at[key])).map(top => window.scrollTo(0, top));
    }
  };
};
