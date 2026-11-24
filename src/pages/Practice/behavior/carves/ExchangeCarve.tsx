import {FC} from 'react';
import exchangeSource from '@pages/Demos/Market/exchange.ts?sample';
import {carve, lines, Snippet} from '@pages/Demos/Recipe';

const theTradesArrive = 'dispatch(marketActions.tradesArrived(trades));';

export const ExchangeCarve: FC = () => <Snippet label="TS" lines={[
  ...carve.between(exchangeSource, theTradesArrive, theTradesArrive),
  lines.aside('// …'),
  ...carve.between(exchangeSource, '.onFailure(cause => {', 'dispatch(marketActions.candlesRefused(period));')
]}/>;
