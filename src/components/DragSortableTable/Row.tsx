import {ComponentProps, FC} from 'react';
import {useTableSelector} from './context';
import {selectOrder} from './selectors';
import {placed} from './placing';

export const Row: FC<ComponentProps<'tr'> & {row: string}> = ({row: _row, children, ...tr}) => {
  const order = useTableSelector(selectOrder);

  return <tr {...tr}>{placed(children, order, 'column')}</tr>;
};
