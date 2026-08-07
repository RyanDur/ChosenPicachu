import {FC, PointerEvent} from 'react';
import {join} from '@components/class-names';
import {array} from '@components/arrays';
import {Column, Dress, Row} from '@components/Table';
import {RowGrip} from './RowGrip';

type Props = {
    row: Row;
    columns: Column[];
    position: number;
    seat: number;
    standing: readonly number[];
    clipped: boolean;
    gripped: boolean;
    aloft?: number;
    aloftColumn?: string;
    dress: Dress;
    onLift: (seat: number) => (event: PointerEvent<HTMLElement>) => void;
    onArranged: (after: number[]) => void;
};

export const DraggableRow: FC<Props> = (
    {row, columns, position, seat, standing, clipped, gripped, aloft, aloftColumn, dress, onLift, onArranged}
) => {
    const hidden = aloft === seat;
    return <tr className={join(dress.trClassName, dress.rowClassName)}>
        {columns.map(({column}, columnNumber) => {
            const cell = row[column];
            const key = String(column);
            return <td className={join(
                           dress.tdClassName, dress.cellClassName, cell.className,
                           clipped && 'ellipsis',
                           aloftColumn === key && 'hide',
                           hidden && 'hide-across'
                       )}
                       key={key}>
                {columnNumber === 0 && gripped &&
                    <RowGrip row={position + 1} onLift={onLift(seat)}
                             onNudge={toward => {
                                 const to = Math.min(Math.max(standing.indexOf(seat) + toward, 0), standing.length - 1);
                                 onArranged(array.moveToIndex(to, seat, standing));
                             }}/>}
                {cell.display}
            </td>;
        })}
    </tr>;
};
