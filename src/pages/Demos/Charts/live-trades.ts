import {streaming} from '@ryandur/sand';
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

export const opening: LiveTradesState = {status: 'connecting', trades: []};

const live = (previous: LiveTradesState): LiveTradesState => ({...previous, status: 'streaming'});

const failed = (previous: LiveTradesState): LiveTradesState => ({...previous, status: 'failed'});

const appendTrade = (trade: Trade) => (previous: LiveTradesState): LiveTradesState => ({
  ...previous,
  trades: [...previous.trades, trade].slice(-LATEST_TRADES_CAP)
});

type Advance = (next: (previous: LiveTradesState) => LiveTradesState) => void;

export const liveTrades = (url: string, product: string, onState: Advance, onTrouble: (trouble: string) => void): {close: () => void} => {
  const stream = streaming(url, () => 'the live feed refused the handshake')
    .onOpen(socket => {
      socket.send(subscribeTo(product));
      onState(live);
    })
    .onMessage(event => decodeTrade(event.data)
      .map(trade => onState(appendTrade(trade))))
    .onClose(() => {
      onState(failed);
      onTrouble('the live feed hung up mid-stream');
    })
    .onFailure(trouble => {
      onState(failed);
      onTrouble(trouble);
    });
  return {close: () => stream.close()};
};
