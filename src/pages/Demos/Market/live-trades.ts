import {Trade} from './coinbase';

export type LiveTradesState = {
  status: 'connecting' | 'streaming' | 'failed';
  trades: readonly Trade[];
};

type LiveTrades = {
  cap: number;
  opening: LiveTradesState;
};

export const liveTrades: LiveTrades = {cap: 1500, opening: {status: 'connecting', trades: []}};
