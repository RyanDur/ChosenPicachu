import {FC, KeyboardEvent, MouseEvent, PointerEvent} from 'react';
import {has, not} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {Column, ResizeHandle, Shares, neighborOf, traded} from '@components/Table';
import {anchored, interior} from './chart';
import {Direction, SortMenu} from './SortMenu';
import './DraggableHeader.css';

type Table = {
  order: readonly string[];
  shares: Shares;
  rule?: { column: string; direction: Direction };
  aloft?: string;
  draggable: boolean;
  className: string;
  onLift: (column: string) => (event: PointerEvent<HTMLTableCellElement>) => void;
  onOrdered: (column: string, to: number) => void;
  onShared: (update: (previous: Shares) => Shares) => void;
  onRule?: (column: string, direction: Direction | undefined, event: MouseEvent<HTMLButtonElement>) => void;
};

type Props = {
  column: Column;
  table: Table;
};

export const DraggableHeader: FC<Props> = ({column, table}) => {
  const {order, shares, rule, aloft, draggable, className, onLift, onOrdered, onShared, onRule} = table;
  const columnName = column.column;
  const apportioned = order.filter(name => name in shares);
  const position = order.indexOf(columnName);
  const share = has(column.width) ? shares[columnName] : undefined;
  const travels = draggable && not(anchored(position, order.length));
  const hidden = aloft === columnName;
  const sorted = rule?.column === columnName ? rule.direction : undefined;

  return <th className={classNames(
    className, column.className,
    'slot',
    apportioned.length > 0 && 'clipped',
    travels && 'grabbable',
    hidden && 'hide'
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
    {column.display}
    {has(onRule) && position > 0 &&
        <SortMenu column={columnName} sorted={sorted} onRule={onRule}/>}
    {has(share) && apportioned.length > 1 &&
        <ResizeHandle column={columnName} share={share}
                      onTrade={delta => onShared(traded(columnName, neighborOf(apportioned, columnName), delta))}/>}
  </th>;
};
