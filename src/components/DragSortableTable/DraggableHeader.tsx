import {FC, KeyboardEvent, MouseEvent, PointerEvent} from 'react';
import {has, not} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {Column, ResizeHandle, Shares, neighborOf, traded} from '@components/Table';
import {Menu} from '@components/Menu';
import {anchored} from './chart';
import './DraggableHeader.css';

export type Direction = 'ascending' | 'descending';

const glyphs: Record<Direction, string> = {ascending: '▲', descending: '▼'};

type Table = {
  ordered: readonly Column[];
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
  const {ordered, shares, rule, aloft, draggable, className, onLift, onOrdered, onShared, onRule} = table;
  const key = column.column;
  const order = ordered.map(definition => definition.column);
  const apportioned = order.filter(name => name in shares);
  const position = ordered.indexOf(column);
  const share = has(column.width) ? shares[key] : undefined;
  const travels = draggable && not(anchored(position, ordered.length));
  const hidden = aloft === key;
  const sorted = rule?.column === key ? rule.direction : undefined;

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
             onPointerDown={travels ? onLift(key) : undefined}
             onKeyDown={travels
               ? (event: KeyboardEvent<HTMLTableCellElement>) => {
                 if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
                   return;
                 }
                 event.preventDefault();
                 const from = order.indexOf(key);
                 const to = Math.min(Math.max(from + (event.key === 'ArrowRight' ? 1 : -1), 1), order.length - 2);
                 if (to === from) {
                   return;
                 }
                 onOrdered(key, to);
               }
               : undefined}
             style={has(share) ? {'--share': `${share}%`} : undefined}>
    {column.display}
    {has(onRule) && position > 0 &&
        <Menu id={`sort-${key}`} label={`sort ${key}`}
              toggle={has(sorted) ? glyphs[sorted] : '⇅'}>
            <button type="button" className="item" onClick={event => onRule(key, 'ascending', event)}>ascending</button>
            <button type="button" className="item" onClick={event => onRule(key, 'descending', event)}>descending
            </button>
            <button type="button" className="item" onClick={event => onRule(key, undefined, event)}>as dealt</button>
        </Menu>}
    {has(share) && apportioned.length > 1 &&
        <ResizeHandle column={key} share={share}
                      onTrade={delta => onShared(traded(key, neighborOf(apportioned, key), delta))}/>}
  </th>;
};
