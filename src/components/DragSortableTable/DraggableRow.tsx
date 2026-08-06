import {FC, KeyboardEvent, PointerEvent} from 'react';
import {has} from '@ryandur/sand';
import {join} from '@components/class-names';
import {Column, Dress, Row} from '@components/Table';
import {RowGrip} from './RowGrip';

type Props = {
    row: Row;
    columns: Column[];
    position: number;
    clipped: boolean;
    gripped: boolean;
    hidden?: boolean;
    hiddenColumn?: string;
    slid?: Readonly<Record<string, {toward: 'left' | 'right'; by: number}>>;
    drop?: number;
    dress: Dress;
    onLift: (event: PointerEvent<HTMLElement>) => void;
    onNudge: (toward: 1 | -1, event: KeyboardEvent<HTMLElement>) => void;
};

export const DraggableRow: FC<Props> = (
    {row, columns, position, clipped, gripped, hidden, hiddenColumn, slid, drop, dress, onLift, onNudge}
) =>
    <tr className={join(dress.trClassName, dress.rowClassName, has(drop) && 'shifted')}
        style={has(drop) ? {'--drop': `${drop}px`} : undefined}>
        {columns.map(({column}, columnNumber) => {
            const cell = row[column];
            const key = String(column);
            const displaced = slid?.[key];
            return <td className={join(
                           dress.tdClassName, dress.cellClassName, cell.className,
                           clipped && 'ellipsis',
                           hiddenColumn === key && 'hide',
                           hidden && 'hide-across',
                           has(displaced) && `displaced-${displaced.toward}`
                       )}
                       key={key}
                       style={has(displaced) ? {'--carried': `${displaced.by}`} : undefined}>
                {columnNumber === 0 && gripped &&
                    <RowGrip row={position + 1} onLift={onLift} onNudge={onNudge}/>}
                {cell.display}
            </td>;
        })}
    </tr>;
