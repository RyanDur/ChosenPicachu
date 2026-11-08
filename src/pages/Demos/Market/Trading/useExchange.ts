import {useEffect, useState} from 'react';
import {bannerChange, useBannerDispatch} from '@notices/Banners';
import {useEnv} from '@page';
import {trouble} from '@transport';
import {exchange, FeedTrouble} from '../exchange';
import {marketActions} from '../marketActions';
import {MarketStore, marketStore} from '../marketStore';

const said = (feedTrouble: FeedTrouble): string => {
  switch (feedTrouble.type) {
    case 'handshakeRefused':
      return 'the live feed refused the handshake';
    case 'hungUp':
      return 'the live feed hung up mid-stream';
    case 'historyRefused':
      return trouble.with('the trade history')(feedTrouble.cause);
    case 'candlesRefused':
      return trouble.with('the candle history')(feedTrouble.cause);
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
