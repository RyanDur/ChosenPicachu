import {Dispatch, createContext} from 'react';
import {MarketAction} from '../marketActions';
import {MarketState, marketSlice} from '../marketSlice';

type Market = {
  state: MarketState;
  dispatch: Dispatch<MarketAction>;
};

export const MarketContext = createContext<Market>({state: marketSlice.initial, dispatch: () => undefined});
