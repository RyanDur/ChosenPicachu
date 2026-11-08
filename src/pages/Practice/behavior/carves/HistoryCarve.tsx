import {FC} from 'react';
import exchangeSource from '@pages/Demos/Market/exchange.ts?sample';
import {Snippet, carve} from '@pages/Demos/Recipe';

export const HistoryCarve: FC = () =>
  <Snippet label="TS" lines={carve.span(exchangeSource, 'const fetching = recentTrades.load(', "onTrouble({type: 'historyRefused', cause})")}/>;
