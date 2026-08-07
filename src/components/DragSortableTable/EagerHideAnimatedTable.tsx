import {FC, MouseEvent, PointerEvent, useState} from 'react';
import {has} from '@ryandur/sand';
import {array} from '@components/arrays';
import {classNames} from '@components/class-names';
import {Column, Shares, TableProps, seededShares} from '@components/Table';
import {useEagerColumnTravel} from './useEagerColumnTravel';
import {useEagerRowTravel} from './useEagerRowTravel';
import {Shifted, Slid, charted, displaced, shifts} from './chart';
import {ColumnGhost, RowGhost} from './ghosts';
import {Direction} from './SortMenu';
import {AnimatedDraggableHeader} from './AnimatedDraggableHeader';
import {AnimatedDraggableRow} from './AnimatedDraggableRow';
import './sortable.css';
import './hide.css';
import './staged.css';

export type EagerHideAnimatedTableProps = TableProps & {
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

export const EagerHideAnimatedTable: FC<EagerHideAnimatedTableProps> = (
    {columns, rows, draggableColumns = false, draggableRows = false, sortable, id, ...dress}
) => {
    const [shares, setShares] = useState<Shares>(() => seededShares(columns));
    const [ordered, setOrdered] = useState<Column[]>(() => [...columns]);
    const [seats, setSeats] = useState<number[]>(() => rows.map((_, card) => card));
    const [rule, setRule] = useState<Rule>();
    const [slid, setSlid] = useState<Slid>();
    const [shifted, setShifted] = useState<Shifted>();

    const order = ordered.map(({column}) => column);
    const clipped = ordered.some(({width}) => has(width));
    const dealt = seats.length === rows.length ? seats : rows.map((_, card) => card);
    const standing = has(rule) ? ranked(rows, dealt, rule) : dealt;

    const placedColumn = (column: string, to: number): void =>
        setOrdered(previous => {
            const lifted = previous.find(definition => definition.column === column);
            return has(lifted) ? array.moveToIndex(to, lifted, previous) : previous;
        });
    const settleColumn = (column: string, struck: string): void => {
        setSlid(displaced(order, column, struck, shares));
        placedColumn(column, Math.min(Math.max(order.indexOf(struck), 1), order.length - 2));
    };
    const columnsTravel = useEagerColumnTravel(order, shares, settleColumn);

    const settleRow = (card: number, struck: number, heights: Shifted): void => {
        const after = array.moveToIndex(seats.indexOf(struck), card, seats);
        const {[card]: ridden, ...drops} = shifts(heights, seats, after);
        setShifted(drops);
        setSeats(after);
    };
    const rowsTravel = useEagerRowTravel(standing, settleRow);

    const ruled = (column: string, direction: Direction | undefined, event: MouseEvent<HTMLButtonElement>): void => {
        const next = has(direction) ? {column, direction} : undefined;
        const table = event.currentTarget.closest('table');
        if (has(table)) {
            const after = has(next)
                ? ranked(rows, dealt, next)
                : dealt;
            setShifted(shifts(charted(table, standing).rowHeights, standing, after));
        }
        setRule(next);
    };

    const columnState = {
        order,
        shares,
        rule,
        aloft: columnsTravel.aloft,
        slid,
        draggable: draggableColumns,
        className: classNames(dress.thClassName, dress.cellClassName),
        onLift: columnsTravel.lift,
        onOrdered: (column: string, to: number, marks: Slid) => {
            setSlid(marks);
            placedColumn(column, to);
        },
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
        slid,
        shifted,
        className: classNames(dress.trClassName, dress.rowClassName),
        cellClassName: classNames(dress.tdClassName, dress.cellClassName),
        onLift: (lifted: number) => (event: PointerEvent<HTMLElement>) => {
            setRule(undefined);
            setSeats(standing);
            rowsTravel.lift(lifted)(event);
        },
        onArranged: (after: number[], drops: Shifted) => {
            setShifted(drops);
            setRule(undefined);
            setSeats(after);
        }
    };

    const ghostDress = {
        table: classNames(dress.tableClassName),
        thead: classNames(dress.theadClassName),
        headerRow: classNames(dress.trClassName, dress.headerRowClassName),
        header: classNames(dress.thClassName, dress.cellClassName),
        tbody: classNames(dress.tbodyClassName),
        row: classNames(dress.trClassName, dress.rowClassName),
        cell: classNames(dress.tdClassName, dress.cellClassName)
    };
    const aloftColumn = ordered.find(definition => definition.column === columnsTravel.aloft);
    const aloftRow = has(rowsTravel.aloft) ? rows[rowsTravel.aloft] : undefined;
    const surface = has(columnsTravel.aloft) ? columnsTravel.surface : rowsTravel.surface;

    return <>
        <table id={id}
               onAnimationEnd={event => {
                   if (event.animationName === 'displaced') {
                       setSlid(undefined);
                   }
                   if (event.animationName === 'shifted') {
                       setShifted(undefined);
                   }
               }}
               className={classNames(
                   dress.tableClassName,
                   'staged',
                   clipped && 'apportioned',
                   (draggableColumns || draggableRows) && 'sortable'
               )}>
            <thead className={dress.theadClassName}>
            <tr className={classNames(
                dress.trClassName,
                dress.headerRowClassName
            )}>{ordered.map(column =>
                <AnimatedDraggableHeader key={column.column} column={column} table={columnState}/>
            )}</tr>
            </thead>
            <tbody className={dress.tbodyClassName}>{standing.map(card =>
                <AnimatedDraggableRow key={card} card={card} row={rows[card]} table={rowState}/>
            )}</tbody>
        </table>
        {has(aloftColumn) &&
            <ColumnGhost at={columnsTravel.flight} drift={columnsTravel.drift} dress={ghostDress}
                         column={aloftColumn} rows={standing.map(card => rows[card])}/>}
        {has(aloftRow) &&
            <RowGhost at={rowsTravel.flight} drift={rowsTravel.drift} dress={ghostDress}
                      columns={ordered} shares={shares} row={aloftRow}/>}
        {(has(columnsTravel.aloft) || has(rowsTravel.aloft)) &&
            <article className="drag-surface" {...surface}/>}
    </>;
};
