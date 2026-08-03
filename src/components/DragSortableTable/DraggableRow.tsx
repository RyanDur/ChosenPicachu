import {FC, PointerEvent} from 'react';
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
    hidden: boolean;
    hiddenColumn: string | undefined;
    named: string | undefined;
    aloftColumn: string | undefined;
    dress: Dress;
    onLift: (event: PointerEvent<HTMLElement>) => void;
    onNudge: (toward: 1 | -1) => void;
};

export const DraggableRow: FC<Props> = (
    {row, columns, position, clipped, gripped, hidden, hiddenColumn, named, aloftColumn, dress, onLift, onNudge}
) =>
    <tr className={join(dress.trClassName, dress.rowClassName)}>
        {columns.map(({column}, columnNumber) => {
            const cell = row[column];
            return <td className={join(
                           dress.tdClassName, dress.cellClassName, cell.className,
                           clipped && 'ellipsis',
                           hiddenColumn === String(column) && 'hide',
                           hidden && 'hide-across'
                       )}
                       key={columnNumber}
                       style={has(named) && aloftColumn !== String(column)
                           ? {viewTransitionName: `${named}-${String(column)}`}
                           : undefined}>
                {columnNumber === 0 && gripped &&
                    <RowGrip row={position + 1} onLift={onLift} onNudge={onNudge}/>}
                {cell.display}
            </td>;
        })}
    </tr>;
