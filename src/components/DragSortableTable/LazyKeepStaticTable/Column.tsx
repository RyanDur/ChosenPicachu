import {FC} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {ColumnContext, ColumnProps, ColumnSetting, carries, measuredShares} from '@components/Table';
import {ResizeHandle} from '@components/Table/ResizeHandle';
import {useTable} from '../context';
import {SortMenu} from '../SortMenu';
import {sortedBy} from '../sorting';
import {columnAloft, ruledBy, sharedAs, tradedBy} from '../table-state';
import '../Header.css';

export const Column: FC<ColumnProps> = ({name, className, children}) => {
  const {state, clipped, commit} = useTable();
  const {order} = state;
  const share = state.shares?.[name];
  const hidden = columnAloft(state).map(held => held === name).orElse(false);
  const rankable = carries(children, SortMenu);
  const resizable = carries(children, ResizeHandle);

  const awaken = (table: HTMLTableElement): void =>
    commit(current => has(current.shares) ? current : sharedAs(measuredShares(current.order, table))(current));
  const ruled: ColumnContext['onRule'] = direction =>
    commit(ruledBy(has(direction) ? {column: name, direction} : undefined));

  return <ColumnSetting.Provider value={{name, share, onAwaken: awaken, onTrade: delta => commit(tradedBy(name, delta)), onRule: ruled}}>
    <th className={classNames(
      'cell', className,
      'header-cell',
      clipped && 'clipped',
      hidden && 'hide',
      has(share) && 'shared'
    )}
        scope="col"
        aria-sort={sortedBy(name, state.rule)}
        style={has(share) ? {'--share': `${share}%`} : undefined}>
      <div className={classNames('header-cell-content',
        rankable && 'rankable',
        resizable && order.length > 1 && 'resizable')}>
        {children}
      </div>
    </th>
  </ColumnSetting.Provider>;
};
