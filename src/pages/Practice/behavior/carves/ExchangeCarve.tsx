import {FC} from 'react';
import exchangeSource from '@pages/Demos/Market/exchange.ts?sample';
import {carve, lines, Snippet} from '@pages/Demos/Recipe';

const fromTheSocket = '.onMessage(event =>';

export const ExchangeCarve: FC = () => <Snippet label="TS" lines={[
  ...carve.between(exchangeSource, fromTheSocket, fromTheSocket),
  lines.aside('// …'),
  ...carve.between(exchangeSource, '.onFailure(cause => {', 'dispatch(marketActions.candlesRefused(period));')
]}/>;
