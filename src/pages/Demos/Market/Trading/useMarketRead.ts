import {useContext} from 'react';
import {MarketContext} from './MarketContext';
import {MarketState} from '../marketSlice';

export const useMarketRead = <Answer>(read: (state: MarketState) => Answer): Answer =>
  read(useContext(MarketContext).state);
