import {FC, PointerEvent, useState} from 'react';
import {has} from '@ryandur/sand';
import {array} from '@components/arrays';
import {classNames} from '@components/class-names';
import {Column, Shares, TableProps, seededShares} from '@components/Table';
import {useLazyColumnTravel} from './useLazyColumnTravel';
import {useLazyRowTravel} from './useLazyRowTravel';
import {Aloft} from './Aloft';
import {Direction, Rule, ranked} from './sorting';
import {DraggableHeader} from './DraggableHeader';
import {DraggableRow} from './DraggableRow';
import './sortable.css';
import './hide.css';

export type LazyHideStaticTableProps = TableProps & {
    draggableColumns?: boolean;
    draggableRows?: boolean;
    sortable?: boolean;
};

export const LazyHideStaticTable: FC<LazyHideStaticTableProps> = (
    {columns, rows, draggableColumns = false, draggableRows = false, sortable, id, ...dress}
) => {
    const [shares, setShares] = useState<Shares>(() => seededShares(columns));
    const [ordered, setOrdered] = useState<Column[]>(() => [...columns]);
    const [seats, setSeats] = useState<number[]>(() => rows.map((_, card) => card));
    const [rule, setRule] = useState<Rule>();

    const order = ordered.map(({column}) => column);
    const clipped = ordered.some(({width}) => has(width));
    const dealt = seats.length === rows.length ? seats : rows.map((_, card) => card);
    const standing = has(rule) ? ranked(rows, dealt, rule) : dealt;

    const placedColumn = (column: string, to: number): void =>
        setOrdered(previous => {
            const lifted = previous.find(definition => definition.column === column);
            return has(lifted) ? array.moveToIndex(to, lifted, previous) : previous;
        });
    const settleColumn = (column: string, struck: string): void =>
        placedColumn(column, Math.min(Math.max(order.indexOf(struck), 1), order.length - 2));
    const columnsTravel = useLazyColumnTravel(order, shares, settleColumn);

    const settleRow = (card: number, struck: number): void =>
        setSeats(array.moveToIndex(seats.indexOf(struck), card, seats));
    const rowsTravel = useLazyRowTravel(standing, settleRow);

    const ruled = (column: string, direction: Direction | undefined): void =>
        setRule(has(direction) ? {column, direction} : undefined);

    const columnState = {
        order,
        shares,
        rule,
        aloft: columnsTravel.aloft,
        draggable: draggableColumns,
        className: classNames(dress.thClassName, dress.cellClassName),
        onLift: columnsTravel.lift,
        onOrdered: placedColumn,
        onShared: setShares,
        onRule: sortable ? ruled : undefined
    };

    const rowState = {
        columns: order,
        clipped,
        standing,
        gripped: draggableRows,
        aloft: rowsTravel.aloft,
        aloftColumn: columnsTravel.aloft,
        className: classNames(dress.trClassName, dress.rowClassName),
        cellClassName: classNames(dress.tdClassName, dress.cellClassName),
        onLift: (lifted: number) => (event: PointerEvent<HTMLElement>) => {
            setRule(undefined);
            setSeats(standing);
            rowsTravel.lift(lifted)(event);
        },
        onArranged: (after: number[]) => {
            setRule(undefined);
            setSeats(after);
        }
    };


    return <>
        <table id={id}
               className={classNames(
                   dress.tableClassName,
                   clipped && 'apportioned',
                   (draggableColumns || draggableRows) && 'sortable'
               )}>
            <thead className={dress.theadClassName}>
            <tr className={classNames(
                dress.trClassName,
                dress.headerRowClassName
            )}>{ordered.map(column =>
                <DraggableHeader key={column.column} column={column} table={columnState}/>
            )}</tr>
            </thead>
            <tbody className={dress.tbodyClassName}>{standing.map(card =>
                <DraggableRow key={card} card={card} row={rows[card]} table={rowState}/>
            )}</tbody>
        </table>
        <Aloft columnsTravel={columnsTravel} rowsTravel={rowsTravel}
               ordered={ordered} shares={shares} rows={rows} standing={standing} dress={dress}/>
    </>;
};
