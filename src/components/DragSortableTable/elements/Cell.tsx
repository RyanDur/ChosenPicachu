import {FC, PropsWithChildren} from 'react';
import {classNames} from '@components/class-names';
import {useSelector} from '../context';
import {columnAloft, rowAloft} from '../table-state';

export const Cell: FC<PropsWithChildren<{seat: number; column: string; className?: string}>> = ({seat, column, className, children}) => {
  const aloft = useSelector(state => state.aloft);
  const hidden = columnAloft({aloft}).map(held => held === column).orElse(false);
  const carried = rowAloft({aloft}).map(held => held === seat).orElse(false);

  return <td className={classNames('cell', className, hidden && 'hide', carried && 'hide-across')}
             style={{viewTransitionName: `cell-${seat}-${column}`}}>
    {children}
  </td>;
};
