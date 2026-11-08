import {useEffect, useState} from 'react';
import {bannerChange, useBannerDispatch} from '@frame/notices/Banners';
import {useEnv} from '@frame/state';
import {troubleWith} from '@transport';
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
  const dispatchBanner = useBannerDispatch();
  const [store] = useState(() =>
    marketStore(exchange(env, trouble => dispatchBanner(bannerChange.raised(said(trouble))))));

  useEffect(() => {
    store.dispatch(marketActions.feedRequested());
    return () => store.dispatch(marketActions.feedReleased());
  }, [store]);

  return store;
};
