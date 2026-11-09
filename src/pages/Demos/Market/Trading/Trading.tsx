import {FC, PropsWithChildren, useSyncExternalStore} from 'react';
import {useExchange} from './useExchange';
import {MarketContext} from './MarketContext';
import {marketSlice} from '../marketSlice';

export const Trading: FC<PropsWithChildren> = ({children}) => {
  const store = useExchange();
  const state = useSyncExternalStore(store.subscribe, () => store.state, () => marketSlice.initial);

  return <MarketContext.Provider value={{state, dispatch: store.dispatch}}>
    {children}
  </MarketContext.Provider>;
};
