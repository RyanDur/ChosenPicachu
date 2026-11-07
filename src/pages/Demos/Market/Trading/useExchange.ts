import {useEffect, useState} from 'react';
import {useBanners} from '@components/Banners';
import {useEnv} from '@components/Env';
import {troubleWith} from '@transport/trouble';
import {exchange, FeedTrouble} from '../exchange';
import {marketActions} from '../marketActions';
import {MarketStore, marketStore} from '../marketStore';

const said = (trouble: FeedTrouble): string => {
  switch (trouble.type) {
    case 'handshakeRefused':
      return 'the live feed refused the handshake';
    case 'hungUp':
      return 'the live feed hung up mid-stream';
    case 'historyRefused':
      return troubleWith('the trade history')(trouble.cause);
    case 'candlesRefused':
      return troubleWith('the candle history')(trouble.cause);
  }
};

export const useExchange = (): MarketStore => {
  const env = useEnv();
  const {raise} = useBanners();
  const [store] = useState(() => marketStore(exchange(env, trouble => raise(said(trouble)))));

  useEffect(() => {
    store.dispatch(marketActions.feedRequested());
    return () => store.dispatch(marketActions.feedReleased());
  }, [store]);

  return store;
};
