import {classNames} from '../classNames';
import {ComponentProps, FC} from 'react';
import {useTableRead} from './useTableRead';
import {tableReads} from './model';
import {placed} from './placing';

export const Row: FC<ComponentProps<'tr'>> = ({className, children, ...tr}) => {
  const order = useTableRead(tableReads.order);

  return <tr {...tr} className={classNames('row', className, 'hover-approached')}>{placed(children, order, 'column')}</tr>;
};
