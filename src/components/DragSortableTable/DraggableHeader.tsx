import {FC, KeyboardEvent, MouseEvent, PointerEvent} from 'react';
import {has, not} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {Column, ResizeHandle, Shares, neighborOf, traded} from '@components/Table';
import {Menu} from '@components/Menu';
import {anchored} from './chart';
import './DraggableHeader.css';

export type Direction = 'ascending' | 'descending';

const glyphs: Record<Direction, string> = {ascending: '▲', descending: '▼'};

type Props = {
    column: Column;
    order: readonly string[];
    shares: Shares;
    apportioned: readonly string[];
    clipped: boolean;
    position: number;
    count: number;
    draggable: boolean;
    aloft?: string;
    rule?: {column: string; direction: Direction};
    className: string;
    onLift: (column: string) => (event: PointerEvent<HTMLTableCellElement>) => void;
    onOrdered: (column: string, to: number) => void;
    onShared: (update: (previous: Shares) => Shares) => void;
    onRule?: (column: string, direction: Direction | undefined, event: MouseEvent<HTMLButtonElement>) => void;
};

export const DraggableHeader: FC<Props> = (
    {column, order, shares, apportioned, clipped, position, count, draggable, aloft, rule, className, onLift, onOrdered, onShared, onRule}
) => {
    const key = String(column.column);
    const share = has(column.width) ? shares[key] : undefined;
    const travels = draggable && not(anchored(position, count));
    const hidden = aloft === key;
    const sorted = rule?.column === key ? rule.direction : undefined;
    return <th className={classNames(
               className, column.className,
               'slot',
               clipped && 'clipped',
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
                <button type="button" className="item" onClick={event => onRule(key, 'descending', event)}>descending</button>
                <button type="button" className="item" onClick={event => onRule(key, undefined, event)}>as dealt</button>
            </Menu>}
        {has(share) && apportioned.length > 1 &&
            <ResizeHandle column={key} share={share}
                          onTrade={delta => onShared(traded(key, neighborOf(apportioned, key), delta))}/>}
    </th>;
};
