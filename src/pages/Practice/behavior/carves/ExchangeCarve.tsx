import {FC} from 'react';
import exchangeSource from '@pages/Demos/Market/exchange.ts?sample';
import {Snippet, lines, carve} from '@pages/Demos/Recipe';

const fromTheSocket = '.onMessage(event =>';

export const ExchangeCarve: FC = () => <Snippet label="TS" lines={[
  ...carve.span(exchangeSource, fromTheSocket, fromTheSocket),
  lines.aside('// …'),
  ...carve.span(exchangeSource, '.onFailure(cause => {', 'dispatch(marketActions.candlesRefused(period));')
]}/>;
