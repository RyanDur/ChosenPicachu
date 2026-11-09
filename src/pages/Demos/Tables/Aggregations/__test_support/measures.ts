import {Lookback, Measures} from '../../../Market';

export const measuresFor = (lookback: Lookback, name: string, trades: number): Measures => ({
  lookback: {display: name, key: lookback},
  trades: {display: String(trades), value: trades},
  buys: {display: '0', value: 0},
  sells: {display: '0', value: 0},
  volume: {display: '0.00', value: 0},
  vwap: {display: '—'},
  change: {display: '—'}
});
