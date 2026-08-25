import {FC} from 'react';
import {classNames} from '@components/class-names';
import {CellProps} from '@components/Table';
import {useRow, useTable} from '../context';
import {RowGrip} from '../RowGrip';
import {baked, columnAloft, lifted, nudgedTo, rowAloft} from '../table-state';
import {Grab, rowLift, staticRowArrows} from '../travel';

export const Cell: FC<CellProps> = ({column, className, children}) => {
  const {state, standing, clipped, commit} = useTable();
  const {row, position, gripped} = useRow();
  const {order} = state;
  const rowHeader = gripped && order[0] === column;
  const dress = classNames(
    'cell', className,
    rowHeader && 'row-header',
    clipped && 'ellipsis',
    columnAloft(state).map(held => held === column).orElse(false) && 'hide',
    rowAloft(state).map(held => held === row).orElse(false) && 'hide-across'
  );
  const grabbed = (grab: Grab): void => commit(current => lifted({axis: 'row', held: row}, grab)(baked(current)));
  const walked = ({to}: {to: number; after: number[]}): void => commit(current => nudgedTo(row, to)(baked(current)));

  return rowHeader
    ? <th scope="row" className={dress}>
      <div className="row-header-content">
        <RowGrip position={position} onLift={rowLift(() => order, () => standing, grabbed)}
                 onArrows={staticRowArrows(row, () => standing, walked)}/>
        {children}
      </div>
    </th>
    : <td className={dress}>{children}</td>;
};
