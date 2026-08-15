import {useEffect, useState} from 'react';
import {useBanners} from '@components/Banners';
import {LiveTradesState, liveTrades, opening} from './live-trades';

export type {LiveTradesState} from './live-trades';
export {statusCopy} from './live-trades';

export const useLiveTrades = (url: string, product: string): LiveTradesState => {
  const [state, setState] = useState<LiveTradesState>(opening);
  const {raise} = useBanners();

  useEffect(() => {
    setState(opening);
    const stream = liveTrades(url, product, setState, raise);
    return () => stream.close();
  }, [url, product, raise]);

  return state;
};
