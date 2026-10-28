import {useSyncExternalStore} from 'react';

const neverNotifies = () => () => undefined;

// a page drawn at build time is taken over by the script, and React's first draw over it must match the document
export const useHydrated = (): boolean => useSyncExternalStore(neverNotifies, () => true, () => false);
