import {FC, KeyboardEvent, MouseEvent, PointerEvent} from 'react';
import {has, not} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {Column, ResizeHandle, Shares, neighborOf, traded} from '@components/Table';
import {anchored, interior} from '../survey';
import {Direction, SortMenu} from '../SortMenu';
import '../Header.css';

type Props = {
  column: Column;
  order: readonly string[];
  share?: number;
  resizable: boolean;
  rule?: { column: string; direction: Direction };
  aloft?: string;
  draggable: boolean;
  className: string;
  onLift: (column: string) => (event: PointerEvent<HTMLTableCellElement>) => void;
  onOrdered: (column: string, to: number) => void;
  onAwaken: (table: HTMLTableElement) => void;
  onShared: (update: (previous: Shares | undefined) => Shares | undefined) => void;
  onRule?: (column: string, direction: Direction | undefined, event: MouseEvent<HTMLButtonElement>) => void;
};

export const Header: FC<Props> = (
  {column, order, share, resizable, rule, aloft, draggable, className, onLift, onOrdered, onAwaken, onShared, onRule}
) => {
  const columnName = column.column;
  const position = order.indexOf(columnName);
  const travels = draggable && not(anchored(position, order.length));
  const hidden = aloft === columnName;
  const sorted = rule?.column === columnName ? rule.direction : undefined;

  return <th className={classNames(
    className, column.className,
    'header-cell',
    resizable && 'clipped',
    travels && 'grabbable',
    hidden && 'hide',
    has(share) && 'shared'
  )}
             scope="col"
             aria-sort={sorted}
             tabIndex={travels ? 0 : undefined}
             onPointerDown={travels ? onLift(columnName) : undefined}
             onKeyDown={travels
               ? (event: KeyboardEvent<HTMLTableCellElement>) => {
                 if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
                   return;
                 }
                 event.preventDefault();
                 const from = order.indexOf(columnName);
                 const to = interior(from + (event.key === 'ArrowRight' ? 1 : -1), order.length);
                 if (to === from) {
                   return;
                 }
                 onOrdered(columnName, to);
               }
               : undefined}
             style={has(share) ? {'--share': `${share}%`} : undefined}>
    <div className="header-cell-content">
      {column.display}
      {has(onRule) && position > 0 &&
          <SortMenu column={columnName} sorted={sorted} onRule={onRule}/>}
      {resizable && order.length > 1 &&
          <ResizeHandle column={columnName} share={share}
                        onAwaken={onAwaken}
                        onTrade={delta => onShared(previous =>
                          previous && traded(columnName, neighborOf(order, columnName), delta)(previous))}/>}
    </div>
  </th>;
};
