import {useEffect, useState} from 'react';
import {streaming} from '@ryandur/sand';
import {useBanners} from '@components/Banners';
import {decodeTrade, subscribeTo, Trade} from './coinbase';

export type LiveTradesState = {
  status: 'connecting' | 'streaming' | 'failed';
  trades: readonly Trade[];
};

export const statusCopy: Record<LiveTradesState['status'], string> = {
  connecting: 'connecting to the live feed…',
  streaming: 'live',
  failed: 'live feed unavailable'
};

const LATEST_TRADES_CAP = 1500;

const opening: LiveTradesState = {status: 'connecting', trades: []};

const live = (previous: LiveTradesState): LiveTradesState => ({...previous, status: 'streaming'});

const failed = (previous: LiveTradesState): LiveTradesState => ({...previous, status: 'failed'});

const appendTrade = (trade: Trade) => (previous: LiveTradesState): LiveTradesState => ({
  ...previous,
  trades: [...previous.trades, trade].slice(-LATEST_TRADES_CAP)
});

export const useLiveTrades = (url: string, product: string): LiveTradesState => {
  const [liveTrades, setLiveTrades] = useState<LiveTradesState>(opening);
  const {raise} = useBanners();

  useEffect(() => {
    setLiveTrades(opening);
    const stream = streaming(url, () => 'the live feed refused the handshake')
      .onOpen(socket => {
        socket.send(subscribeTo(product));
        setLiveTrades(live);
      })
      .onMessage(event => decodeTrade(event.data)
        .map(trade => setLiveTrades(appendTrade(trade))))
      .onClose(() => {
        setLiveTrades(failed);
        raise('the live feed hung up mid-stream');
      })
      .onFailure(trouble => {
        setLiveTrades(failed);
        raise(trouble);
      });
    return () => stream.close();
  }, [url, product, raise]);

  return liveTrades;
};
