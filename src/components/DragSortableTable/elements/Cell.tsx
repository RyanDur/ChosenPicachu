import {FC} from 'react';
import {classNames} from '@components/class-names';
import {CellProps} from '@components/Table';
import {useRow, useTable, useTableState} from '../context';
import {RowGrip} from '../RowGrip';
import {baked, columnAloft, lifted, nudgedTo, rowAloft} from '../table-state';
import {Grab, rowArrows, rowLift} from '../travel';

export const Cell: FC<CellProps> = ({column, className, children}) => {
  const {store, standing, clipped, settle} = useTable();
  const {row, position, gripped} = useRow();
  const order = useTableState(state => state.order);
  const aloft = useTableState(state => state.aloft);
  const rowHeader = gripped && order[0] === column;
  const dress = classNames(
    'cell', className,
    rowHeader && 'row-header',
    clipped && 'ellipsis',
    columnAloft({aloft}).map(held => held === column).orElse(false) && 'hide',
    rowAloft({aloft}).map(held => held === row).orElse(false) && 'hide-across'
  );
  const drawn = {viewTransitionName: `cell-${row}-${column}`};
  const grabbed = (grab: Grab): void => store.commit(current => lifted({axis: 'row', held: row}, grab)(baked(current)));
  const walked = ({to}: {to: number; after: number[]}): void => settle(current => nudgedTo(row, to)(baked(current)));

  return rowHeader
    ? <th scope="row" className={dress} style={drawn}>
      <div className="row-header-content">
        <RowGrip position={position} onLift={rowLift(() => order, () => standing, grabbed)}
                 onArrows={rowArrows(row, () => standing, walked)}/>
        {children}
      </div>
    </th>
    : <td className={dress} style={drawn}>{children}</td>;
};
