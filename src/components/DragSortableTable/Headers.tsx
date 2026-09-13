import {ComponentProps, FC} from 'react';
import {Header, HeaderEvents, useTableSelector} from './context';
import {selectOrder} from './selectors';
import {placed} from './placing';

export const Headers: FC<ComponentProps<'tr'> & HeaderEvents> = ({onColumnMoved, onSorted, children, ...tr}) => {
  const order = useTableSelector(selectOrder);

  return <Header.Provider value={{onColumnMoved, onSorted}}>
    <tr {...tr}>{placed(children, order, 'column')}</tr>
  </Header.Provider>;
};
