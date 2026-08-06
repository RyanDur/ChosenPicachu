import {FC, PointerEvent} from 'react';
import {has} from '@ryandur/sand';
import {join} from '@components/class-names';
import {array} from '@components/arrays';
import {Column, Dress, Row} from '@components/Table';
import {Shifted, Slid, charted, shifts} from './chart';
import {RowGrip} from './RowGrip';
import './displaced.css';
import './AnimatedDraggableRow.css';

type Props = {
    row: Row;
    columns: Column[];
    position: number;
    seat: number;
    standing: readonly number[];
    clipped: boolean;
    gripped: boolean;
    hidden?: boolean;
    hiddenColumn?: string;
    slid?: Slid;
    drop?: number;
    dress: Dress;
    onLift: (event: PointerEvent<HTMLElement>) => void;
    onArranged: (after: number[], drops: Shifted) => void;
};

export const AnimatedDraggableRow: FC<Props> = (
    {row, columns, position, seat, standing, clipped, gripped, hidden, hiddenColumn, slid, drop, dress, onLift, onArranged}
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
                    <RowGrip row={position + 1} onLift={onLift}
                             onNudge={(toward, event) => {
                                 const lane = event.currentTarget.closest('tr');
                                 if (has(lane) && (lane.getAnimations?.().length ?? 0) > 0) {
                                     return;
                                 }
                                 const to = Math.min(Math.max(standing.indexOf(seat) + toward, 0), standing.length - 1);
                                 const after = array.moveToIndex(to, seat, standing);
                                 const table = event.currentTarget.closest('table');
                                 onArranged(after, has(table)
                                     ? shifts(charted(table, standing).rowHeights, standing, after)
                                     : {});
                             }}/>}
                {cell.display}
            </td>;
        })}
    </tr>;
