import {startTransition, useEffect, useState} from 'react';

let hydrated = false;

// a page drawn at build time is taken over by the script, and React's first draw over it must match the document;
// the draw that follows hydration may not yield, so what the script changes then arrives in a transition
export const useHydrated = (): boolean => {
  const [taken, take] = useState(hydrated);
  useEffect(() => {
    if (!taken) startTransition(() => {
      hydrated = true;
      take(true);
    });
  }, [taken]);
  return taken;
};
