import {FC, PropsWithChildren} from 'react';
import {useExchange} from './useExchange';
import {MarketProvider} from './MarketProvider';

export const Trading: FC<PropsWithChildren> = ({children}) => {
  const store = useExchange();

  return <MarketProvider store={store}>
    {children}
  </MarketProvider>;
};
