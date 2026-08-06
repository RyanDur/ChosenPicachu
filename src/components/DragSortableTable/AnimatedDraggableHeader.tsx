import {FC, KeyboardEvent, MouseEvent, PointerEvent} from 'react';
import {has} from '@ryandur/sand';
import {join} from '@components/class-names';
import {array} from '@components/arrays';
import {Column, Dress, ResizeHandle, Shares} from '@components/Table';
import {Slid} from './chart';
import {Menu} from '@components/Menu';
import {Direction} from './DraggableHeader';

const glyphs: Record<Direction, string> = {ascending: '▲', descending: '▼'};

type Props = {
    column: Column;
    order: readonly string[];
    shares: Shares;
    share: number | undefined;
    clipped: boolean;
    travels: boolean;
    hidden?: boolean;
    displaced?: {toward: 'left' | 'right'; by: number};
    sorted: Direction | undefined;
    dress: Dress;
    onLift: (event: PointerEvent<HTMLTableCellElement>) => void;
    onOrdered: (after: string[], marks: Slid) => void;
    onTrade: ((delta: number) => void) | undefined;
    onRule: ((direction: Direction | undefined, event: MouseEvent<HTMLButtonElement>) => void) | undefined;
};

export const AnimatedDraggableHeader: FC<Props> = (
    {column, order, shares, share, clipped, travels, hidden, displaced, sorted, dress, onLift, onOrdered, onTrade, onRule}
) => {
    const key = String(column.column);
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
               onPointerDown={travels ? onLift : undefined}
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
        {has(onRule) &&
            <Menu id={`sort-${key}`} label={`sort ${key}`}
                  toggle={has(sorted) ? glyphs[sorted] : '⇅'}>
                <button type="button" className="item" onClick={event => onRule('ascending', event)}>ascending</button>
                <button type="button" className="item" onClick={event => onRule('descending', event)}>descending</button>
                <button type="button" className="item" onClick={event => onRule(undefined, event)}>as dealt</button>
            </Menu>}
        {has(share) && has(onTrade) &&
            <ResizeHandle column={key} share={share} onTrade={onTrade}/>}
    </th>;
};
