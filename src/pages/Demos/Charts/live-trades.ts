import {Trade} from './coinbase';

export type LiveTradesState = {
  status: 'connecting' | 'streaming' | 'failed';
  trades: readonly Trade[];
};

export const statusCopy: Record<LiveTradesState['status'], string> = {
  connecting: 'connecting to the live feed…',
  streaming: 'live',
  failed: 'live feed unavailable'
};

export const lampOf: Record<LiveTradesState['status'], string> = {
  connecting: 'lamp-dim-before',
  streaming: 'lamp-lit-before',
  failed: 'lamp-alarm-before'
};

export const opening: LiveTradesState = {status: 'connecting', trades: []};
