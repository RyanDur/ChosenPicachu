import {PropsWithChildren, ReactNode, useSyncExternalStore} from 'react';
import {MarketContext} from './MarketContext';
import {marketSlice} from '../marketSlice';
import {MarketStore} from '../marketStore';

export const MarketProvider = ({store, children}: PropsWithChildren<{store: MarketStore}>): ReactNode => {
  const state = useSyncExternalStore(store.subscribe, () => store.state, () => marketSlice.initial);

  return <MarketContext.Provider value={{state, dispatch: store.dispatch}}>
    {children}
  </MarketContext.Provider>;
};
