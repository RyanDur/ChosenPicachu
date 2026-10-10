import {FC, PropsWithChildren} from 'react';
import {useExchange} from './useExchange';
import {DemosProvider} from './Provider';

export const Trading: FC<PropsWithChildren> = ({children}) => {
  const store = useExchange();

  return <DemosProvider store={store}>
    {children}
  </DemosProvider>;
};
