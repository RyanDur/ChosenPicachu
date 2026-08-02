import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {connecting} from '@ryandur/sand';
import {decodeTrade, Trade} from '@transport/binance';

export type LiveTradesState = {
  status: 'connecting' | 'streaming' | 'failed';
  trades: readonly Trade[];
};

type SetLiveTrades = Dispatch<SetStateAction<LiveTradesState>>;

const LATEST_TRADES_CAP = 3;

const opening: LiveTradesState = {status: 'connecting', trades: []};

const streaming = (previous: LiveTradesState): LiveTradesState => ({...previous, status: 'streaming'});
const failed = (previous: LiveTradesState): LiveTradesState => ({...previous, status: 'failed'});

const appendTrade = (trade: Trade) => (previous: LiveTradesState): LiveTradesState => ({
  ...previous,
  trades: [...previous.trades, trade].slice(-LATEST_TRADES_CAP)
});

const onFrame = (setLiveTrades: SetLiveTrades) => (event: MessageEvent): void =>
  decodeTrade(event.data).either(
    trade => setLiveTrades(appendTrade(trade)),
    () => undefined
  );

const beginStreaming = (setLiveTrades: SetLiveTrades) => (socket: WebSocket): void => {
  socket.addEventListener('message', onFrame(setLiveTrades));
  socket.addEventListener('close', () => setLiveTrades(failed));
  setLiveTrades(streaming);
};

export const useLiveTrades = (url: string): LiveTradesState => {
  const [liveTrades, setLiveTrades] = useState<LiveTradesState>(opening);

  useEffect(() => {
    setLiveTrades(opening);
    const handshake = connecting(url, () => undefined)
      .onSuccess(beginStreaming(setLiveTrades))
      .onFailure(() => setLiveTrades(failed));
    return () => handshake.cancel();
  }, [url]);

  return liveTrades;
};
