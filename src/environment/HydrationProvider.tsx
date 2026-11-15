import {FC, PropsWithChildren, startTransition, useEffect, useState} from 'react';
import {hydration} from '@components';

// a page drawn at build time is taken over by the script, and React's first draw over it must match the document;
// the draw that follows hydration may not yield, so what the script changes then arrives in a transition
export const HydrationProvider: FC<PropsWithChildren> = ({children}) => {
  const [taken, take] = useState(false);
  useEffect(() => startTransition(() => take(true)), []);
  return <hydration.Taken.Provider value={taken}>{children}</hydration.Taken.Provider>;
};
