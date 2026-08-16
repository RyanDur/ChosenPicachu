import {FC, KeyboardEvent, MouseEvent, PointerEvent} from 'react';
import {Maybe, has, maybe, not, nothing} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {Column, ResizeHandle, Shares, neighborOf, traded} from '@components/Table';
import {Slid, anchored, bounded, columnNudge, columnSteps} from '../survey';
import {Direction, SortMenu} from '../SortMenu';
import {sortedBy} from '../sorting';
import '../Header.css';

type Props = {
  column: Column;
  order: readonly string[];
  share?: number;
  resizable: boolean;
  rule?: { column: string; direction: Direction };
  aloft?: Maybe<string>;
  slid?: Slid;
  draggable: boolean;
  className: string;
  onLift: (column: string) => (event: PointerEvent<HTMLTableCellElement>) => void;
  onOrdered: (column: string, to: number, marks: Slid) => void;
  onAwaken: (table: HTMLTableElement) => void;
  onShared: (update: (previous: Shares | undefined) => Shares | undefined) => void;
  onRule?: (column: string, direction: Direction | undefined, event: MouseEvent<HTMLButtonElement>) => void;
};

export const Header: FC<Props> = (
  {
    column,
    order,
    share,
    resizable,
    rule,
    aloft = nothing(),
    slid,
    draggable,
    className,
    onLift,
    onOrdered,
    onAwaken,
    onShared,
    onRule
  }
) => {
  const columnName = column.column;
  const position = order.indexOf(columnName);
  const travels = draggable && not(anchored(position, order.length));
  const hidden = aloft.map(held => held === columnName).orElse(false);
  const displaced = slid?.[columnName];
  const sorted = sortedBy(columnName, rule);

  return <th className={classNames(
    className, column.className,
    'header-cell',
    resizable && 'clipped',
    travels && 'grabbable',
    hidden && 'hide',
    has(displaced) && 'displaced',
    has(share) && 'shared'
  )}
             scope="col"
             aria-sort={sorted}
             tabIndex={travels ? 0 : undefined}
             onPointerDown={travels ? onLift(columnName) : undefined}
             onKeyDown={travels
               ? (event: KeyboardEvent<HTMLTableCellElement>) =>
                 maybe(columnSteps[event.key]).map(toward => {
                   event.preventDefault();
                   if (event.currentTarget.getAnimations().length > 0) {
                     return;
                   }
                   maybe(event.currentTarget.closest('table')).map(table => {
                     const nudge = columnNudge(order, bounded(table, order))(columnName, toward);
                     if (has(nudge)) {
                       onOrdered(columnName, nudge.to, nudge.marks);
                     }
                   });
                 })
               : undefined}
             style={{
               ...(has(share) ? {'--share': `${share}%`} : {}),
               ...(has(displaced)
                 ? {'--carried': `${displaced.by}px`, '--toward': displaced.toward === 'left' ? '1' : '-1'}
                 : {})
             }}>
    <div className={classNames('header-cell-content',
      has(onRule) && column.sortable && 'rankable',
      resizable && order.length > 1 && 'resizable')}>
      {column.display}
      {has(onRule) && column.sortable &&
          <SortMenu column={columnName} sorted={sorted} onRule={onRule}/>}
      {resizable && order.length > 1 &&
          <ResizeHandle column={columnName} share={share}
                        onAwaken={onAwaken}
                        onTrade={delta => onShared(previous =>
                          previous && traded(columnName, neighborOf(order, columnName), delta)(previous))}/>}
    </div>
  </th>;
};
