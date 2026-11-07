import {Dispatch, useContext} from 'react';
import {MarketContext} from './MarketContext';
import {MarketAction} from '../marketActions';

export const useMarketDispatch = (): Dispatch<MarketAction> => useContext(MarketContext).dispatch;
