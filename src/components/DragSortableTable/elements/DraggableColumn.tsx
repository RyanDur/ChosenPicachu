import {FC} from 'react';
import {has, not} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {ColumnContext, ColumnProps, ColumnSetting, carries, measuredShares} from '@components/Table';
import {ResizeHandle} from '@components/Table/ResizeHandle';
import {useTable, useTableState} from '../context';
import {SortMenu} from '../SortMenu';
import {sortedBy} from '../sorting';
import {columnAloft, lifted, orderedTo, ruledBy, sharedAs, tradedBy} from '../table-state';
import {anchored} from '../survey';
import {Grab, columnArrows, columnLift} from '../travel';
import '../Header.css';

export const DraggableColumn: FC<ColumnProps> = ({name, className, children}) => {
  const {store, standing, clipped, settle} = useTable();
  const order = useTableState(state => state.order);
  const shares = useTableState(state => state.shares);
  const aloft = useTableState(state => state.aloft);
  const rule = useTableState(state => state.rule);
  const share = shares?.[name];
  const hidden = columnAloft({aloft}).map(held => held === name).orElse(false);
  const rankable = carries(children, SortMenu);
  const resizable = carries(children, ResizeHandle);
  const travels = not(anchored(order.indexOf(name), order.length));
  const grabbed = (grab: Grab): void => store.commit(lifted({axis: 'column', held: name}, grab));
  const walked = ({to}: {from: number; to: number}): void => settle(orderedTo(order.indexOf(name), to));

  const awaken = (table: HTMLTableElement): void =>
    store.commit(current => has(current.shares) ? current : sharedAs(measuredShares(current.order, table))(current));
  const ruled: ColumnContext['onRule'] = direction =>
    settle(ruledBy(has(direction) ? {column: name, direction} : undefined));

  return <ColumnSetting.Provider value={{name, share, onAwaken: awaken, onTrade: delta => store.commit(tradedBy(name, delta)), onRule: ruled}}>
    <th className={classNames(
      'cell', className,
      'header-cell',
      clipped && 'clipped',
      travels && 'grabbable',
      hidden && 'hide',
      has(share) && 'shared'
    )}
        scope="col"
        aria-sort={sortedBy(name, rule)}
        tabIndex={travels ? 0 : undefined}
        onPointerDown={travels ? columnLift(name, () => order, () => standing, grabbed) : undefined}
        onKeyDown={travels ? columnArrows(name, () => order, walked) : undefined}
        style={{viewTransitionName: `header-${name}`, ...(has(share) ? {'--share': `${share}%`} : {})}}>
      <div className={classNames('header-cell-content',
        rankable && 'rankable',
        resizable && order.length > 1 && 'resizable')}>
        {children}
      </div>
    </th>
  </ColumnSetting.Provider>;
};
