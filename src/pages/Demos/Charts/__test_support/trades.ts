import {Trade} from '../coinbase';

export const aTrade = (overrides: Partial<Trade> = {}): Trade =>
  ({id: 1, price: 65000, tradedAt: 1700000000000, size: 1, side: 'sell', ...overrides});

export const bought = (size: number, overrides: Partial<Trade> = {}): Trade => aTrade({...overrides, size, side: 'sell'});

export const sold = (size: number, overrides: Partial<Trade> = {}): Trade => aTrade({...overrides, size, side: 'buy'});
