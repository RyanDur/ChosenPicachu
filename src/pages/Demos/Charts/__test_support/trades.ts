import {Trade} from '../../Market';

export const aTrade = (overrides: Partial<Trade> = {}): Trade =>
  ({id: 1, price: 65000, tradedAt: 1700000000000, size: 1, takerSide: 'buy', ...overrides});

export const bought = (size: number, overrides: Partial<Trade> = {}): Trade => aTrade({...overrides, size, takerSide: 'buy'});

export const sold = (size: number, overrides: Partial<Trade> = {}): Trade => aTrade({...overrides, size, takerSide: 'sell'});
