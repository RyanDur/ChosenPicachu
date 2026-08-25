import {FC} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {CellProps} from '@components/Table';
import {useMoved, useRow, useTable} from '../context';
import {RowGrip} from '../RowGrip';
import {RowNudge} from '../survey';
import {baked, columnAloft, lifted, nudgedTo, rowAloft} from '../table-state';
import {Grab, rowLift, animatedRowArrows} from '../travel';

export const Cell: FC<CellProps> = ({column, className, children}) => {
  const {state, standing, clipped, commit} = useTable();
  const {columnsMoved, rowsMove} = useMoved();
  const {row, position, gripped} = useRow();
  const {order} = state;
  const rowHeader = gripped && order[0] === column;
  const displaced = columnsMoved?.[column];
  const dress = classNames(
    'cell', className,
    rowHeader && 'row-header',
    clipped && 'ellipsis',
    columnAloft(state).map(held => held === column).orElse(false) && 'hide',
    rowAloft(state).map(held => held === row).orElse(false) && 'hide-across',
    has(displaced) && 'displaced'
  );
  const drawn = has(displaced)
    ? {'--carried': `${displaced.by}px`, '--toward': displaced.toward === 'left' ? '1' : '-1'}
    : undefined;
  const grabbed = (grab: Grab): void => commit(current => lifted({axis: 'row', held: row}, grab)(baked(current)));
  const walked = (nudge: RowNudge): void => {
    rowsMove(nudge.moved);
    commit(current => nudgedTo(row, nudge.to)(baked(current)));
  };

  return rowHeader
    ? <th scope="row" className={dress} style={drawn}>
      <div className="row-header-content">
        <RowGrip position={position} onLift={rowLift(() => order, () => standing, grabbed)}
                 onArrows={animatedRowArrows(row, () => order, () => standing, walked)}/>
        {children}
      </div>
    </th>
    : <td className={dress} style={drawn}>{children}</td>;
};
