import {useEffect, useState} from 'react';
import {useBanners} from '@components/Banners';
import {useEnv} from '@components/Env';
import {exchange} from './exchange';
import {DemosStore, demosStore, feedReleased, feedRequested} from './store';

export const useExchange = (): DemosStore => {
  const env = useEnv();
  const {raise} = useBanners();
  const [store] = useState(() => demosStore(exchange(env, raise)));

  useEffect(() => {
    store.dispatch(feedRequested());
    return () => store.dispatch(feedReleased());
  }, [store]);

  return store;
};
