import {FC, PointerEvent, useState} from 'react';
import {has, not, notEmpty} from '@ryandur/sand';
import {array} from '@components/arrays';
import {join} from '@components/class-names';
import {Shares, TableProps, neighborOf, seededShares, traded} from '@components/Table';
import {DragStyle, useTravel} from './useTravel';
import {Chart, anchored, charted, columnUnder, seatUnder} from './chart';
import {ColumnGhost, RowGhost} from './ghosts';
import {DraggableHeader} from './DraggableHeader';
import {DraggableRow} from './DraggableRow';
import './DragSortableTable.css';

export type DragSortableTableProps = TableProps & {
    draggableColumns?: DragStyle;
    draggableRows?: DragStyle;
};

export const DragSortableTable: FC<DragSortableTableProps> = (
    {columns, rows, draggableColumns, draggableRows, id, ...dress}
) => {
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

    const liftColumn = (key: string) => (event: PointerEvent<HTMLTableCellElement>): void => {
        const surface = event.currentTarget.closest('table');
        if (has(surface)) {
            setChart(charted(surface, arranged));
        }
        columnsTravel.lift(key, event.currentTarget)(event);
    };
    const liftRow = (seat: number) => (event: PointerEvent<HTMLElement>): void => {
        const surface = event.currentTarget.closest('table');
        if (has(surface)) {
            setChart(charted(surface, arranged));
        }
        rowsTravel.lift(seat, event.currentTarget.closest('tr'))(event);
    };

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
            )}>{ordered.map((column, position) => {
                const key = String(column.column);
                return <DraggableHeader key={key}
                                        column={column}
                                        share={has(column.width) ? shares[key] : undefined}
                                        clipped={clipped}
                                        travels={has(draggableColumns) && not(anchored(position, ordered.length))}
                                        hidden={columnsTravel.hiding && columnsTravel.aloft === key}
                                        dress={dress}
                                        onLift={liftColumn(key)}
                                        onTrade={apportioned.length > 1
                                            ? delta => setShares(traded(key, neighborOf(apportioned, key), delta))
                                            : undefined}/>;
            })}</tr>
            </thead>
            <tbody className={dress.tbodyClassName}>{arranged.map(({row, seat}, position) =>
                <DraggableRow key={seat}
                              row={row}
                              columns={ordered}
                              position={position}
                              clipped={clipped}
                              gripped={has(draggableRows)}
                              hidden={rowsTravel.hiding && rowsTravel.aloft === seat}
                              hiddenColumn={columnsTravel.hiding ? columnsTravel.aloft : undefined}
                              dress={dress}
                              onLift={liftRow(seat)}
                              onNudge={nudged(seat)}/>
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
