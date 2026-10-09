import {classNames} from '@components/class-names';
import {ComponentProps, FC} from 'react';
import {useTableSelector} from './context';
import {selectOrder} from './selectors';
import {placed} from './placing';

export const Row: FC<ComponentProps<'tr'>> = ({className, children, ...tr}) => {
  const order = useTableSelector(selectOrder);

  return <tr {...tr} className={classNames('row', className, 'hover-approached')}>{placed(children, order, 'column')}</tr>;
};
