import {ComponentProps, FC} from 'react';
import {classNames} from '@components/class-names';
import {Header, HeaderEvents, useTableSelector} from './context';
import {selectOrder} from './selectors';
import {placed} from './placing';

export const Headers: FC<ComponentProps<'tr'> & HeaderEvents> = ({onColumnMoved, onSorted, className, children, ...tr}) => {
  const order = useTableSelector(selectOrder);

  return <Header.Provider value={{onColumnMoved, onSorted}}>
    <tr {...tr} className={classNames('row', className)}>{placed(children, order, 'column')}</tr>
  </Header.Provider>;
};
