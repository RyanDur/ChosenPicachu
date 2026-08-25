import {FC} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {ColumnContext, ColumnProps, ColumnSetting, carries, measuredShares} from '@components/Table';
import {ResizeHandle} from '@components/Table/ResizeHandle';
import {useMoved, useTable} from '../context';
import {SortMenu} from '../SortMenu';
import {ranked, sortedBy} from '../sorting';
import {columnAloft, ruledBy, sharedAs, tradedBy} from '../table-state';
import {shifts, surveyed} from '../survey';
import '../Header.css';

export const Column: FC<ColumnProps> = ({name, className, children}) => {
  const {state, rows, standing, clipped, commit} = useTable();
  const {columnsMoved, rowsMove} = useMoved();
  const {order} = state;
  const share = state.shares?.[name];
  const hidden = columnAloft(state).map(held => held === name).orElse(false);
  const displaced = columnsMoved?.[name];
  const rankable = carries(children, SortMenu);
  const resizable = carries(children, ResizeHandle);

  const awaken = (table: HTMLTableElement): void =>
    commit(current => has(current.shares) ? current : sharedAs(measuredShares(current.order, table))(current));
  const ruled: ColumnContext['onRule'] = (direction, event) => {
    const next = has(direction) ? {column: name, direction} : undefined;
    const table = event.currentTarget.closest('table');
    if (has(table)) {
      const after = has(next) ? ranked(rows, state.seats, next) : state.seats;
      rowsMove(shifts(surveyed(table, order, standing).rowHeights, standing, after));
    }
    commit(ruledBy(next));
  };

  return <ColumnSetting.Provider value={{name, share, onAwaken: awaken, onTrade: delta => commit(tradedBy(name, delta)), onRule: ruled}}>
    <th className={classNames(
      'cell', className,
      'header-cell',
      clipped && 'clipped',
      hidden && 'hide',
      has(displaced) && 'displaced',
      has(share) && 'shared'
    )}
        scope="col"
        aria-sort={sortedBy(name, state.rule)}
        style={{
          ...(has(share) ? {'--share': `${share}%`} : {}),
          ...(has(displaced)
            ? {'--carried': `${displaced.by}px`, '--toward': displaced.toward === 'left' ? '1' : '-1'}
            : {})
        }}>
      <div className={classNames('header-cell-content',
        rankable && 'rankable',
        resizable && order.length > 1 && 'resizable')}>
        {children}
      </div>
    </th>
  </ColumnSetting.Provider>;
};
