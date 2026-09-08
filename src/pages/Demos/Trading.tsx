import {FC} from 'react';
import {Outlet} from 'react-router';
import {useExchange} from './useExchange';
import {DemosProvider} from './Provider';

export const Trading: FC = () => {
  const store = useExchange();

  return <DemosProvider store={store}>
    <Outlet/>
  </DemosProvider>;
};
