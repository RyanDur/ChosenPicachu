import {FC, KeyboardEvent, MouseEvent, PointerEvent} from 'react';
import {has, not} from '@ryandur/sand';
import {join} from '@components/class-names';
import {array} from '@components/arrays';
import {Column, Dress, ResizeHandle, Shares, neighborOf, traded} from '@components/Table';
import {Slid, anchored} from './chart';
import {Menu} from '@components/Menu';
import {Direction} from './DraggableHeader';
import './DraggableHeader.css';
import './displaced.css';

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
    slid?: Slid;
    rule?: {column: string; direction: Direction};
    dress: Dress;
    onLift: (column: string) => (event: PointerEvent<HTMLTableCellElement>) => void;
    onOrdered: (after: string[], marks: Slid) => void;
    onShared: (update: (previous: Shares) => Shares) => void;
    onRule?: (column: string, direction: Direction | undefined, event: MouseEvent<HTMLButtonElement>) => void;
};

export const AnimatedDraggableHeader: FC<Props> = (
    {column, order, shares, apportioned, clipped, position, count, draggable, aloft, slid, rule, dress, onLift, onOrdered, onShared, onRule}
) => {
    const key = String(column.column);
    const share = has(column.width) ? shares[key] : undefined;
    const travels = draggable && not(anchored(position, count));
    const hidden = aloft === key;
    const displaced = slid?.[key];
    const sorted = rule?.column === key ? rule.direction : undefined;
    return <th className={join(
               dress.thClassName, dress.cellClassName, column.className,
               'slot',
               clipped && 'clipped',
               travels && 'grabbable',
               hidden && 'hide',
               has(displaced) && `displaced-${displaced.toward}`
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
                       if ((event.currentTarget.getAnimations?.().length ?? 0) > 0) {
                           return;
                       }
                       const toward = event.key === 'ArrowRight' ? 1 : -1;
                       const from = order.indexOf(key);
                       const to = Math.min(Math.max(from + toward, 1), order.length - 2);
                       if (to === from) {
                           return;
                       }
                       const neighbour = order[to];
                       onOrdered(array.moveToIndex(to, key, order), {
                           [key]: {toward: toward > 0 ? 'right' : 'left', by: shares[neighbour] ?? 0},
                           [neighbour]: {toward: toward > 0 ? 'left' : 'right', by: shares[key] ?? 0}
                       });
                   }
                   : undefined}
               style={{
                   ...(has(share) ? {'--share': `${share}%`} : {}),
                   ...(has(displaced) ? {'--carried': `${displaced.by}`} : {})
               }}>
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
