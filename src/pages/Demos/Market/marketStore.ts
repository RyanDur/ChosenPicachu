import {Middleware, store, Store} from '@components/store';
import {MarketAction} from './marketActions';
import {MarketState, marketSlice} from './marketSlice';

export type MarketStore = Store<MarketState, MarketAction>;
export type MarketMiddleware = Middleware<MarketState, MarketAction>;

export const marketStore = (...middleware: MarketMiddleware[]): MarketStore =>
  store({slice: marketSlice, middleware});
