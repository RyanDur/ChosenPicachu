import {LiveTradesState} from '../Market';

const words: Record<LiveTradesState['status'], string> = {
  connecting: 'connecting to the live feed…',
  streaming: 'live',
  failed: 'live feed unavailable'
};

const lamp: Record<LiveTradesState['status'], string> = {
  connecting: 'lamp-dim-before',
  streaming: 'lamp-lit-before',
  failed: 'lamp-alarm-before'
};

export const feedStatus = {words, lamp};
