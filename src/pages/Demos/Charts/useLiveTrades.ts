import {useEffect, useState} from 'react';
import {connecting} from '@ryandur/sand';
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

const streaming = (previous: LiveTradesState): LiveTradesState => ({...previous, status: 'streaming'});
const failed = (previous: LiveTradesState): LiveTradesState => ({...previous, status: 'failed'});

const appendTrade = (trade: Trade) => (previous: LiveTradesState): LiveTradesState => ({
  ...previous,
  trades: [...previous.trades, trade].slice(-LATEST_TRADES_CAP)
});

export const useLiveTrades = (url: string, product: string): LiveTradesState => {
  const [liveTrades, setLiveTrades] = useState<LiveTradesState>(opening);

  useEffect(() => {
    setLiveTrades(opening);
    const frame = (event: MessageEvent): void =>
      decodeTrade(event.data).either(
        trade => setLiveTrades(appendTrade(trade)),
        () => undefined
      );
    const streamFrom = (socket: WebSocket): void => {
      socket.addEventListener('message', frame);
      socket.addEventListener('close', () => setLiveTrades(failed));
      socket.send(subscribeTo(product));
      setLiveTrades(streaming);
    };
    const handshake = connecting(url, () => undefined)
      .onSuccess(streamFrom)
      .onFailure(() => setLiveTrades(failed));
    return () => handshake.cancel();
  }, [url, product]);

  return liveTrades;
};
