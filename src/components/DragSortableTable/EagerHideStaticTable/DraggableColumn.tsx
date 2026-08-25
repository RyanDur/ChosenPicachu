import {FC} from 'react';
import {has, not} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {ColumnContext, ColumnProps, ColumnSetting, carries, measuredShares} from '@components/Table';
import {ResizeHandle} from '@components/Table/ResizeHandle';
import {useTable} from '../context';
import {SortMenu} from '../SortMenu';
import {sortedBy} from '../sorting';
import {columnAloft, lifted, orderedTo, ruledBy, sharedAs, tradedBy} from '../table-state';
import {anchored} from '../survey';
import {columnLift, Grab, staticColumnArrows} from '../travel';
import '../Header.css';

export const DraggableColumn: FC<ColumnProps> = ({name, className, children}) => {
  const {state, standing, clipped, commit} = useTable();
  const {order} = state;
  const share = state.shares?.[name];
  const hidden = columnAloft(state).map(held => held === name).orElse(false);
  const rankable = carries(children, SortMenu);
  const resizable = carries(children, ResizeHandle);
  const travels = not(anchored(order.indexOf(name), order.length));
  const grabbed = (grab: Grab): void => commit(lifted({axis: 'column', held: name}, grab));
  const walked = ({to}: {from: number; to: number}): void => commit(orderedTo(order.indexOf(name), to));

  const awaken = (table: HTMLTableElement): void =>
    commit(current => has(current.shares) ? current : sharedAs(measuredShares(current.order, table))(current));
  const ruled: ColumnContext['onRule'] = direction =>
    commit(ruledBy(has(direction) ? {column: name, direction} : undefined));

  return <ColumnSetting.Provider value={{name, share, onAwaken: awaken, onTrade: delta => commit(tradedBy(name, delta)), onRule: ruled}}>
    <th className={classNames(
      'cell', className,
      'header-cell',
      clipped && 'clipped',
      travels && 'grabbable',
      hidden && 'hide',
      has(share) && 'shared'
    )}
        scope="col"
        aria-sort={sortedBy(name, state.rule)}
        tabIndex={travels ? 0 : undefined}
        onPointerDown={travels ? columnLift(name, () => order, () => standing, grabbed) : undefined}
        onKeyDown={travels ? staticColumnArrows(name, () => order, walked) : undefined}
        style={has(share) ? {'--share': `${share}%`} : undefined}>
      <div className={classNames('header-cell-content',
        rankable && 'rankable',
        resizable && order.length > 1 && 'resizable')}>
        {children}
      </div>
    </th>
  </ColumnSetting.Provider>;
};
