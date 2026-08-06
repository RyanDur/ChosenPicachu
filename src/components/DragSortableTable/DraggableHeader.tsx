import {FC, KeyboardEvent, MouseEvent, PointerEvent} from 'react';
import {has} from '@ryandur/sand';
import {join} from '@components/class-names';
import {Column, Dress, ResizeHandle} from '@components/Table';
import {Menu} from '@components/Menu';

export type Direction = 'ascending' | 'descending';

const glyphs: Record<Direction, string> = {ascending: '▲', descending: '▼'};

type Props = {
    column: Column;
    share: number | undefined;
    clipped: boolean;
    travels: boolean;
    hidden?: boolean;
    displaced?: {toward: 'left' | 'right'; by: number};
    sorted: Direction | undefined;
    dress: Dress;
    onLift: (event: PointerEvent<HTMLTableCellElement>) => void;
    onNudge: (toward: 1 | -1) => void;
    onTrade: ((delta: number) => void) | undefined;
    onRule: ((direction: Direction | undefined, event: MouseEvent<HTMLButtonElement>) => void) | undefined;
};

export const DraggableHeader: FC<Props> = (
    {column, share, clipped, travels, hidden, displaced, sorted, dress, onLift, onNudge, onTrade, onRule}
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
                       onNudge(event.key === 'ArrowRight' ? 1 : -1);
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
