import {ComponentProps, FC} from 'react';
import {classNames} from '../classNames';
import {HeaderEvents, tableContexts} from './tableContexts';
import {useTableRead} from './useTableRead';
import {tableReads} from './model';
import {placed} from './placing';

export const Headers: FC<ComponentProps<'tr'> & HeaderEvents> = ({onColumnMoved, onSorted, className, children, ...tr}) => {
  const order = useTableRead(tableReads.order);

  return <tableContexts.Header.Provider value={{onColumnMoved, onSorted}}>
    <tr {...tr} className={classNames('row', className)}>{placed(children, order, 'column')}</tr>
  </tableContexts.Header.Provider>;
};
