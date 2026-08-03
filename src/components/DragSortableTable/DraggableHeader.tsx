import {FC, PointerEvent} from 'react';
import {has} from '@ryandur/sand';
import {join} from '@components/class-names';
import {Column, Dress, ResizeHandle} from '@components/Table';

type Props = {
    column: Column;
    share: number | undefined;
    clipped: boolean;
    travels: boolean;
    hidden: boolean;
    dress: Dress;
    onLift: (event: PointerEvent<HTMLTableCellElement>) => void;
    onTrade: ((delta: number) => void) | undefined;
};

export const DraggableHeader: FC<Props> = ({column, share, clipped, travels, hidden, dress, onLift, onTrade}) =>
    <th className={join(
            dress.thClassName, dress.cellClassName, column.className,
            clipped && 'clipped',
            travels && 'grabbable',
            hidden && 'hide'
        )}
        scope="col"
        onPointerDown={travels ? onLift : undefined}
        style={has(share) ? {width: `${share}%`} : undefined}>
        {column.display}
        {has(share) && has(onTrade) &&
            <ResizeHandle column={String(column.column)} share={share} onTrade={onTrade}/>}
    </th>;
