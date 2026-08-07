import {FC, KeyboardEvent, MouseEvent, PointerEvent} from 'react';
import {has, not} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {Column, ResizeHandle, Shares, neighborOf, traded} from '@components/Table';
import {Slid, anchored} from './chart';
import {Menu} from '@components/Menu';
import {Direction} from './DraggableHeader';
import './DraggableHeader.css';
import './displaced.css';

const glyphs: Record<Direction, string> = {ascending: '▲', descending: '▼'};

type Table = {
  ordered: readonly Column[];
  shares: Shares;
  rule?: { column: string; direction: Direction };
  aloft?: string;
  slid?: Slid;
  draggable: boolean;
  className: string;
  onLift: (column: string) => (event: PointerEvent<HTMLTableCellElement>) => void;
  onOrdered: (column: string, to: number, marks: Slid) => void;
  onShared: (update: (previous: Shares) => Shares) => void;
  onRule?: (column: string, direction: Direction | undefined, event: MouseEvent<HTMLButtonElement>) => void;
};

type Props = {
  column: Column;
  table: Table;
};

export const AnimatedDraggableHeader: FC<Props> = ({column, table}) => {
  const {ordered, shares, rule, aloft, slid, draggable, className, onLift, onOrdered, onShared, onRule} = table;
  const columnName = column.column;
  const order = ordered.map(definition => definition.column);
  const apportioned = order.filter(name => name in shares);
  const position = ordered.indexOf(column);
  const share = has(column.width) ? shares[columnName] : undefined;
  const travels = draggable && not(anchored(position, ordered.length));
  const hidden = aloft === columnName;
  const displaced = slid?.[columnName];
  const sorted = rule?.column === columnName ? rule.direction : undefined;
  return <th className={classNames(
    className, column.className,
    'slot',
    apportioned.length > 0 && 'clipped',
    travels && 'grabbable',
    hidden && 'hide',
    has(displaced) && 'displaced'
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
                 if ((event.currentTarget.getAnimations?.().length ?? 0) > 0) {
                   return;
                 }
                 const toward = event.key === 'ArrowRight' ? 1 : -1;
                 const from = order.indexOf(columnName);
                 const to = Math.min(Math.max(from + toward, 1), order.length - 2);
                 if (to === from) {
                   return;
                 }
                 const neighbour = order[to];
                 onOrdered(columnName, to, {
                   [columnName]: {toward: toward > 0 ? 'right' : 'left', by: shares[neighbour] ?? 0},
                   [neighbour]: {toward: toward > 0 ? 'left' : 'right', by: shares[columnName] ?? 0}
                 });
               }
               : undefined}
             style={{
               ...(has(share) ? {'--share': `${share}%`} : {}),
               ...(has(displaced)
                 ? {'--carried': `${displaced.by}`, '--toward': displaced.toward === 'left' ? '1' : '-1'}
                 : {})
             }}>
    {column.display}
    {has(onRule) && position > 0 &&
        <Menu id={`sort-${columnName}`} label={`sort ${columnName}`}
              toggle={has(sorted) ? glyphs[sorted] : '⇅'}>
            <button type="button" className="item" onClick={event => onRule(columnName, 'ascending', event)}>ascending</button>
            <button type="button" className="item" onClick={event => onRule(columnName, 'descending', event)}>descending
            </button>
            <button type="button" className="item" onClick={event => onRule(columnName, undefined, event)}>as dealt</button>
        </Menu>}
    {has(share) && apportioned.length > 1 &&
        <ResizeHandle column={columnName} share={share}
                      onTrade={delta => onShared(traded(columnName, neighborOf(apportioned, columnName), delta))}/>}
  </th>;
};
