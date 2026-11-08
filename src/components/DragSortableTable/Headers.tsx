import {ComponentProps, FC} from 'react';
import {classNames} from '@components/class-names';
import {HeaderEvents, tableContexts} from './tableContexts';
import {useTableSelector} from './useTableSelector';
import {tableSelectors} from './model';
import {placed} from './placing';

export const Headers: FC<ComponentProps<'tr'> & HeaderEvents> = ({onColumnMoved, onSorted, className, children, ...tr}) => {
  const order = useTableSelector(tableSelectors.order);

  return <tableContexts.Header.Provider value={{onColumnMoved, onSorted}}>
    <tr {...tr} className={classNames('row', className)}>{placed(children, order, 'column')}</tr>
  </tableContexts.Header.Provider>;
};
