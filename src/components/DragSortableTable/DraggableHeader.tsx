import {FC, PointerEvent} from 'react';
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
    hidden: boolean;
    landing?: boolean;
    sorted: Direction | undefined;
    named: string | undefined;
    dress: Dress;
    onLift: (event: PointerEvent<HTMLTableCellElement>) => void;
    onTrade: ((delta: number) => void) | undefined;
    onRule: ((direction: Direction | undefined) => void) | undefined;
};

export const DraggableHeader: FC<Props> = (
    {column, share, clipped, travels, hidden, landing, sorted, named, dress, onLift, onTrade, onRule}
) => {
    const key = String(column.column);
    return <th className={join(
               dress.thClassName, dress.cellClassName, column.className,
               'slot',
               clipped && 'clipped',
               travels && 'grabbable',
               hidden && 'hide',
               landing && 'landing'
           )}
               scope="col"
               aria-sort={sorted}
               onPointerDown={travels ? onLift : undefined}
               style={{
                   ...(has(share) ? {'--share': `${share}%`} : {}),
                   ...(has(named) ? {viewTransitionName: named} : {})
               }}>
        {column.display}
        {has(onRule) &&
            <Menu id={`sort-${key}`} label={`sort ${key}`}
                  toggle={has(sorted) ? glyphs[sorted] : '⇅'}>
                <button type="button" className="item" onClick={() => onRule('ascending')}>ascending</button>
                <button type="button" className="item" onClick={() => onRule('descending')}>descending</button>
                <button type="button" className="item" onClick={() => onRule(undefined)}>as dealt</button>
            </Menu>}
        {has(share) && has(onTrade) &&
            <ResizeHandle column={key} share={share} onTrade={onTrade}/>}
    </th>;
};
