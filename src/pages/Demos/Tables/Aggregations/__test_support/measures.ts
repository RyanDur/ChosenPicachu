import {Measures} from '../cells';

export const measuresFor = (window: string, trades: number): Measures => ({
  window: {display: window},
  trades: {display: String(trades), value: trades},
  buys: {display: '0', value: 0},
  sells: {display: '0', value: 0},
  volume: {display: '0.00', value: 0},
  vwap: {display: '—'},
  change: {display: '—'}
});
