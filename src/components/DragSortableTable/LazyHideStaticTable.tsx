import {FC, useState} from 'react';
import {has, notEmpty} from '@ryandur/sand';
import {array} from '@components/arrays';
import {join} from '@components/class-names';
import {Column, Shares, TableProps, seededShares} from '@components/Table';
import {useLazyColumnTravel} from './useLazyColumnTravel';
import {useLazyRowTravel} from './useLazyRowTravel';
import {ColumnGhost, RowGhost} from './ghosts';
import {Direction} from './DraggableHeader';
import {DraggableHeader} from './DraggableHeader';
import {DraggableRow} from './DraggableRow';
import './sortable.css';
import './hide.css';

export type LazyHideStaticTableProps = TableProps & {
    draggableColumns?: boolean;
    draggableRows?: boolean;
    sortable?: boolean;
};

type Rule = {
    column: string;
    direction: Direction;
};

const ranked = (rows: TableProps['rows'], dealt: readonly number[], rule: Rule): number[] =>
    [...dealt].sort((left, right) => {
        const gap = (rows[left][rule.column]?.value ?? Number.NEGATIVE_INFINITY) -
            (rows[right][rule.column]?.value ?? Number.NEGATIVE_INFINITY);
        return rule.direction === 'ascending' ? gap : -gap;
    });

export const LazyHideStaticTable: FC<LazyHideStaticTableProps> = (
    {columns, rows, draggableColumns = false, draggableRows = false, sortable, id, ...dress}
) => {
    const [shares, setShares] = useState<Shares>(() => seededShares(columns));
    const [ordered, setOrdered] = useState<Column[]>(() => [...columns]);
    const [seats, setSeats] = useState<number[]>(() => rows.map((_, seat) => seat));
    const [rule, setRule] = useState<Rule>();

    const order = ordered.map(({column}) => String(column));
    const apportioned = ordered.filter(({width}) => has(width)).map(({column}) => String(column));
    const clipped = notEmpty(apportioned);
    const dealt = seats.length === rows.length ? seats : rows.map((_, seat) => seat);
    const standing = has(rule) ? ranked(rows, dealt, rule) : dealt;

    const placedColumn = (column: string, to: number): void =>
        setOrdered(previous => {
            const lifted = previous.find(definition => String(definition.column) === column);
            return has(lifted) ? array.moveToIndex(to, lifted, previous) : previous;
        });
    const settleColumn = (column: string, struck: string): void =>
        placedColumn(column, Math.min(Math.max(order.indexOf(struck), 1), order.length - 2));
    const columnsTravel = useLazyColumnTravel(order, shares, settleColumn);

    const settleRow = (seat: number, struck: number): void =>
        setSeats(array.moveToIndex(seats.indexOf(struck), seat, seats));
    const rowsTravel = useLazyRowTravel(standing, settleRow);

    const ruled = (column: string, direction: Direction | undefined): void =>
        setRule(has(direction) ? {column, direction} : undefined);

    const headerClassName = join(dress.thClassName, dress.cellClassName);
    const rowClassName = join(dress.trClassName, dress.rowClassName);
    const cellClassName = join(dress.tdClassName, dress.cellClassName);
    const aloftColumn = ordered.find(definition => String(definition.column) === columnsTravel.aloft);
    const aloftRow = has(rowsTravel.aloft) ? rows[rowsTravel.aloft] : undefined;
    const surface = has(columnsTravel.aloft) ? columnsTravel.surface : rowsTravel.surface;

    return <>
        <table id={id}
               className={join(
                   dress.tableClassName,
                   clipped && 'apportioned',
                   (draggableColumns || draggableRows) && 'sortable'
               )}>
            <thead className={dress.theadClassName}>
            <tr className={join(
                dress.trClassName,
                dress.headerRowClassName
            )}>{ordered.map((column, position) =>
                <DraggableHeader key={String(column.column)}
                    column={column}
                    order={order}
                    shares={shares}
                    apportioned={apportioned}
                    clipped={clipped}
                    position={position}
                    count={ordered.length}
                    draggable={draggableColumns}
                    aloft={columnsTravel.aloft}
                    rule={rule}
                    className={headerClassName}
                    onLift={columnsTravel.lift}
                    onOrdered={placedColumn}
                    onShared={setShares}
                    onRule={sortable ? ruled : undefined}/>
            )}</tr>
            </thead>
            <tbody className={dress.tbodyClassName}>{standing.map((seat, position) =>
                <DraggableRow key={seat}
                    row={rows[seat]}
                    columns={ordered}
                    position={position}
                    seat={seat}
                    standing={standing}
                    clipped={clipped}
                    gripped={draggableRows}
                    aloft={rowsTravel.aloft}
                    aloftColumn={columnsTravel.aloft}
                    className={rowClassName}
                    cellClassName={cellClassName}
                    onLift={lifted => event => {
                        setRule(undefined);
                        setSeats(standing);
                        rowsTravel.lift(lifted)(event);
                    }}
                    onArranged={after => {
                        setRule(undefined);
                        setSeats(after);
                    }}/>
            )}</tbody>
        </table>
        {has(aloftColumn) &&
            <ColumnGhost at={columnsTravel.flight} drift={columnsTravel.drift} dress={dress}
                         column={aloftColumn} rows={standing.map(seat => rows[seat])}/>}
        {has(aloftRow) &&
            <RowGhost at={rowsTravel.flight} drift={rowsTravel.drift} dress={dress}
                      columns={ordered} shares={shares} row={aloftRow}/>}
        {(has(columnsTravel.aloft) || has(rowsTravel.aloft)) &&
            <article className="drag-surface" {...surface}/>}
    </>;
};
