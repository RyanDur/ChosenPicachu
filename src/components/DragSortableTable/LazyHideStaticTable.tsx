import {FC, useState} from 'react';
import {has, notEmpty} from '@ryandur/sand';
import {array} from '@components/arrays';
import {join} from '@components/class-names';
import {Shares, TableProps, seededShares} from '@components/Table';
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

const ranked = (rows: TableProps['rows'], dealt: readonly number[], rule: Rule) =>
    dealt.map(seat => ({row: rows[seat], seat}))
        .sort((left, right) => {
            const gap = (left.row[rule.column]?.value ?? Number.NEGATIVE_INFINITY) -
                (right.row[rule.column]?.value ?? Number.NEGATIVE_INFINITY);
            return rule.direction === 'ascending' ? gap : -gap;
        });

export const LazyHideStaticTable: FC<LazyHideStaticTableProps> = (
    {columns, rows, draggableColumns = false, draggableRows = false, sortable, id, ...dress}
) => {
    const [shares, setShares] = useState<Shares>(() => seededShares(columns));
    const [order, setOrder] = useState<string[]>(() => columns.map(({column}) => String(column)));
    const [seats, setSeats] = useState<number[]>(() => rows.map((_, seat) => seat));
    const [rule, setRule] = useState<Rule>();

    const byKey = new Map(columns.map(definition => [String(definition.column), definition]));
    const ordered = order.map(key => byKey.get(key)).filter(has);
    const apportioned = ordered.filter(({width}) => has(width)).map(({column}) => String(column));
    const clipped = notEmpty(apportioned);
    const dealt = seats.length === rows.length ? seats : rows.map((_, seat) => seat);
    const arranged = has(rule)
        ? ranked(rows, dealt, rule)
        : dealt.map(seat => ({row: rows[seat], seat}));
    const standing = arranged.map(({seat}) => seat);

    const settleColumn = (column: string, struck: string): void => {
        setOrder(previous => {
            const at = Math.min(Math.max(previous.indexOf(struck), 1), previous.length - 2);
            return array.moveToIndex(at, column, previous);
        });
    };
    const columnsTravel = useLazyColumnTravel(order, shares, settleColumn);

    const settleRow = (seat: number, struck: number): void => {
        setSeats(array.moveToIndex(seats.indexOf(struck), seat, seats));
    };
    const rowsTravel = useLazyRowTravel(seats, settleRow);

    const ruled = (column: string, direction: Direction | undefined): void =>
        setRule(has(direction) ? {column, direction} : undefined);

    const aloftColumn = has(columnsTravel.aloft) ? byKey.get(columnsTravel.aloft) : undefined;
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
                    dress={dress}
                    onLift={columnsTravel.lift}
                    onOrdered={setOrder}
                    onShared={setShares}
                    onRule={sortable ? ruled : undefined}/>
            )}</tr>
            </thead>
            <tbody className={dress.tbodyClassName}>{arranged.map(({row, seat}, position) =>
                <DraggableRow key={seat}
                    row={row}
                    columns={ordered}
                    position={position}
                    seat={seat}
                    standing={standing}
                    clipped={clipped}
                    gripped={draggableRows}
                    aloft={rowsTravel.aloft}
                    aloftColumn={columnsTravel.aloft}
                    dress={dress}
                    onLift={(lifted, event) => {
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
                         column={aloftColumn} rows={arranged.map(({row}) => row)}/>}
        {has(aloftRow) &&
            <RowGhost at={rowsTravel.flight} drift={rowsTravel.drift} dress={dress}
                      columns={ordered} shares={shares} row={aloftRow}/>}
        {(has(columnsTravel.aloft) || has(rowsTravel.aloft)) &&
            <article className="drag-surface" {...surface}/>}
    </>;
};
