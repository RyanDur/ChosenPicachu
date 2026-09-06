import {FC, PropsWithChildren} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {ColumnContext, ColumnSetting, measuredShares} from '@components/Table';
import {useDispatch, useSelector} from '../context';
import {sortedBy} from '../sorting';
import {columnAloft, ruledBy, sharedAs, tradedBy} from '../table-state';
import '../Header.css';

export const Column: FC<PropsWithChildren<{name: string; className?: string}>> = ({name, className, children}) => {
  const dispatch = useDispatch();
  const shares = useSelector(state => state.shares);
  const aloft = useSelector(state => state.aloft);
  const rule = useSelector(state => state.rule);
  const share = shares?.[name];
  const hidden = columnAloft({aloft}).map(held => held === name).orElse(false);

  const awaken = (table: HTMLTableElement): void =>
    dispatch(current => has(current.shares) ? current : sharedAs(measuredShares(current.order, table))(current));
  const ruled: ColumnContext['onRule'] = direction =>
    dispatch(ruledBy(has(direction) ? {column: name, direction} : undefined));

  return <ColumnSetting.Provider value={{name, share, onAwaken: awaken, onTrade: delta => dispatch(tradedBy(name, delta)), onRule: ruled}}>
    <th className={classNames(
      'cell', className,
      'header-cell',
      hidden && 'hide',
      has(share) && 'shared'
    )}
        scope="col"
        aria-sort={sortedBy(name, rule)}
        style={{viewTransitionName: `header-${name}`, ...(has(share) ? {'--share': `${share}%`} : {})}}>
      <div className="header-cell-content">
        {children}
      </div>
    </th>
  </ColumnSetting.Provider>;
};
