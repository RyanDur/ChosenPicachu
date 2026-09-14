import {useEffect, useState} from 'react';
import {useBanners} from '@components/Banners';
import {useEnv} from '@components/Env';
import {troubleWith} from '@transport/trouble';
import {exchange, FeedTrouble} from './exchange';
import {DemosStore, demosStore, feedReleased, feedRequested} from './store';

const said = (trouble: FeedTrouble): string => {
  switch (trouble.type) {
    case 'handshakeRefused':
      return 'the live feed refused the handshake';
    case 'hungUp':
      return 'the live feed hung up mid-stream';
    case 'historyRefused':
      return troubleWith('the trade history')(trouble.cause);
  }
};

export const useExchange = (): DemosStore => {
  const env = useEnv();
  const {raise} = useBanners();
  const [store] = useState(() => demosStore(exchange(env, trouble => raise(said(trouble)))));

  useEffect(() => {
    store.dispatch(feedRequested());
    return () => store.dispatch(feedReleased());
  }, [store]);

  return store;
};
