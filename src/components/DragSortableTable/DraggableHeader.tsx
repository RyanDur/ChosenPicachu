import {FC, KeyboardEvent, MouseEvent, PointerEvent} from 'react';
import {has} from '@ryandur/sand';
import {join} from '@components/class-names';
import {array} from '@components/arrays';
import {Column, Dress, ResizeHandle} from '@components/Table';
import {Menu} from '@components/Menu';
import './DraggableHeader.css';

export type Direction = 'ascending' | 'descending';

const glyphs: Record<Direction, string> = {ascending: '▲', descending: '▼'};

type Props = {
    column: Column;
    order: readonly string[];
    share: number | undefined;
    clipped: boolean;
    travels: boolean;
    hidden?: boolean;
    sorted: Direction | undefined;
    dress: Dress;
    onLift: (event: PointerEvent<HTMLTableCellElement>) => void;
    onOrdered: (after: string[]) => void;
    onTrade: ((delta: number) => void) | undefined;
    onRule: ((direction: Direction | undefined, event: MouseEvent<HTMLButtonElement>) => void) | undefined;
};

export const DraggableHeader: FC<Props> = (
    {column, order, share, clipped, travels, hidden, sorted, dress, onLift, onOrdered, onTrade, onRule}
) => {
    const key = String(column.column);
    return <th className={join(
               dress.thClassName, dress.cellClassName, column.className,
               'slot',
               clipped && 'clipped',
               travels && 'grabbable',
               hidden && 'hide'
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
                       const from = order.indexOf(key);
                       const to = Math.min(Math.max(from + (event.key === 'ArrowRight' ? 1 : -1), 1), order.length - 2);
                       if (to === from) {
                           return;
                       }
                       onOrdered(array.moveToIndex(to, key, order));
                   }
                   : undefined}
               style={has(share) ? {'--share': `${share}%`} : undefined}>
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
