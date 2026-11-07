import {useContext} from 'react';
import {MarketContext} from './MarketContext';
import {MarketState} from '../marketSlice';

export const useMarketSelector = <Slice>(select: (state: MarketState) => Slice): Slice =>
  select(useContext(MarketContext).state);
