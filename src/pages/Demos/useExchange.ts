import {useEffect, useState} from 'react';
import {useBanners} from '@components/Banners';
import {useEnv} from '@components/Env';
import {troubleWith} from '@transport/trouble';
import {exchange, FeedTrouble} from './exchange';
import {DemosStore, demosStore, feedReleased, feedRequested} from './store';

const sentences = {
  handshakeRefused: 'the live feed refused the handshake',
  hungUp: 'the live feed hung up mid-stream'
};

const said = (trouble: FeedTrouble): string =>
  typeof trouble === 'string' ? sentences[trouble] : troubleWith('the trade history')(trouble.history);

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
