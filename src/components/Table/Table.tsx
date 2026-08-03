import {has, not, notEmpty} from '@ryandur/sand';
import {array} from '@components/arrays';
import {TableProps} from './types';
import {FC, useState} from 'react';
import {join} from '@components/class-names';
import {useTravel} from './useTravel';
import {ColumnGhost, RowGhost} from './ghosts';
import {ResizeHandle} from './ResizeHandle';
import {RowGrip} from './RowGrip';
import {Shares, neighborOf, seededShares, traded} from './shares';
import {Chart, anchored, charted, columnUnder, seatUnder} from './chart';
import './Table.css';

export const Table: FC<TableProps> = ({columns, rows, draggableColumns, draggableRows, id, ...dress}) => {
    const [shares, setShares] = useState<Shares>(() => seededShares(columns));
    const [order, setOrder] = useState<string[]>(() => columns.map(({column}) => String(column)));
    const [seats, setSeats] = useState<number[]>(() => rows.map((_, seat) => seat));
    const [chart, setChart] = useState<Chart>();

    const byKey = new Map(columns.map(definition => [String(definition.column), definition]));
    const ordered = order.map(key => byKey.get(key)).filter(has);
    const apportioned = ordered.filter(({width}) => has(width)).map(({column}) => String(column));
    const clipped = notEmpty(apportioned);
    const arranged = seats.length === rows.length
        ? seats.map(seat => ({row: rows[seat], seat}))
        : rows.map((row, seat) => ({row, seat}));
    const columnsTravel = useTravel<string>(
        draggableColumns,
        columnUnder(chart, order, shares),
        (key, struck) => setOrder(previous => {
            const at = Math.min(Math.max(previous.indexOf(struck), 1), previous.length - 2);
            return array.moveToIndex(at, key, previous);
        }));
    const rowsTravel = useTravel<number>(
        draggableRows,
        seatUnder(chart, seats),
        (seat, struck) => setSeats(previous =>
            array.moveToIndex(previous.indexOf(struck), seat, previous)));

    const nudged = (seat: number) => (toward: 1 | -1): void =>
        setSeats(previous => {
            const to = Math.min(Math.max(previous.indexOf(seat) + toward, 0), previous.length - 1);
            return array.moveToIndex(to, seat, previous);
        });

    const aloftColumn = has(columnsTravel.aloft) ? byKey.get(columnsTravel.aloft) : undefined;
    const aloftRow = has(rowsTravel.aloft) ? rows[rowsTravel.aloft] : undefined;

    return <>
        <table id={id}
               className={join(
                   dress.tableClassName,
                   clipped && 'apportioned',
                   (has(draggableColumns) || has(draggableRows)) && 'sortable'
               )}>
            <thead className={dress.theadClassName}>
            <tr className={join(
                dress.trClassName,
                dress.headerRowClassName
            )}>{ordered.map(({display, column, className, width}, position) => {
                const key = String(column);
                const share = has(width) ? shares[key] : undefined;
                const travels = has(draggableColumns) && not(anchored(position, ordered.length));
                return <th className={join(
                               dress.thClassName, dress.cellClassName, className,
                               clipped && 'clipped',
                               travels && 'grabbable',
                               columnsTravel.hiding && columnsTravel.aloft === key && 'hide'
                           )}
                           key={key}
                           scope="col"
                           onPointerDown={travels
                               ? event => {
                                   const surface = event.currentTarget.closest('table');
                                   if (has(surface)) {
                                       setChart(charted(surface, arranged));
                                   }
                                   columnsTravel.lift(key, event.currentTarget)(event);
                               }
                               : undefined}
                           style={has(share) ? {width: `${share}%`} : undefined}>
                    {display}
                    {has(share) && apportioned.length > 1 &&
                        <ResizeHandle column={key}
                                      share={share}
                                      onTrade={delta => setShares(traded(key, neighborOf(apportioned, key), delta))}/>}
                </th>;
            })}</tr>
            </thead>
            <tbody className={dress.tbodyClassName}>{arranged.map(({row, seat}, position) =>
                <tr className={join(dress.trClassName, dress.rowClassName)}
                    key={seat}>
                    {ordered.map(({column}, columnNumber) => {
                        const cell = row[column];
                        return <td className={join(
                                       dress.tdClassName, dress.cellClassName, cell.className,
                                       clipped && 'ellipsis',
                                       columnsTravel.hiding && columnsTravel.aloft === String(column) && 'hide',
                                       rowsTravel.hiding && rowsTravel.aloft === seat && 'hide-across'
                                   )} key={columnNumber}>
                            {columnNumber === 0 && has(draggableRows) &&
                                <RowGrip row={position + 1}
                                         onLift={event => {
                                             const surface = event.currentTarget.closest('table');
                                             if (has(surface)) {
                                                 setChart(charted(surface, arranged));
                                             }
                                             rowsTravel.lift(seat, event.currentTarget.closest('tr'))(event);
                                         }}
                                         onNudge={nudged(seat)}/>}
                            {cell.display}
                        </td>;
                    })}</tr>
            )}</tbody>
        </table>
        {has(aloftColumn) &&
            <ColumnGhost at={columnsTravel.flight} ghost={columnsTravel.ghost} dress={dress}
                         column={aloftColumn} rows={arranged.map(({row}) => row)}/>}
        {has(aloftRow) &&
            <RowGhost at={rowsTravel.flight} ghost={rowsTravel.ghost} dress={dress}
                      columns={ordered} row={aloftRow}/>}
        {(has(columnsTravel.aloft) || has(rowsTravel.aloft)) &&
            <article className="drag-surface"
                     {...(has(columnsTravel.aloft) ? columnsTravel.surface : rowsTravel.surface)}/>}
    </>;
};
