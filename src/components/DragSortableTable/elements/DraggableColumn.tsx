import {FC, PropsWithChildren} from 'react';
import {has, not} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {ColumnContext, ColumnSetting, measuredShares} from '@components/Table';
import {useDispatch, useStanding, useSelector} from '../context';
import {sortedBy} from '../sorting';
import {columnAloft, lifted, orderedTo, ruledBy, sharedAs, tradedBy} from '../table-state';
import {anchored} from '../survey';
import {Grab, columnArrows, columnLift} from '../travel';
import '../Header.css';

export const DraggableColumn: FC<PropsWithChildren<{name: string; className?: string}>> = ({name, className, children}) => {
  const dispatch = useDispatch();
  const standing = useStanding();
  const order = useSelector(state => state.order);
  const shares = useSelector(state => state.shares);
  const aloft = useSelector(state => state.aloft);
  const rule = useSelector(state => state.rule);
  const share = shares?.[name];
  const hidden = columnAloft({aloft}).map(held => held === name).orElse(false);
  const travels = not(anchored(order.indexOf(name), order.length));
  const grabbed = (grab: Grab): void => dispatch(lifted({axis: 'column', held: name}, grab));
  const walked = ({to}: {from: number; to: number}): void => dispatch(orderedTo(order.indexOf(name), to));

  const awaken = (table: HTMLTableElement): void =>
    dispatch(current => has(current.shares) ? current : sharedAs(measuredShares(current.order, table))(current));
  const ruled: ColumnContext['onRule'] = direction =>
    dispatch(ruledBy(has(direction) ? {column: name, direction} : undefined));

  return <ColumnSetting.Provider value={{name, share, onAwaken: awaken, onTrade: delta => dispatch(tradedBy(name, delta)), onRule: ruled}}>
    <th className={classNames(
      'cell', className,
      'header-cell',
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
      <div className="header-cell-content">
        {children}
      </div>
    </th>
  </ColumnSetting.Provider>;
};
