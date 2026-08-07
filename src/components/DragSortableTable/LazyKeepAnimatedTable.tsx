import {FC, MouseEvent, PointerEvent, useState} from 'react';
import {has} from '@ryandur/sand';
import {array} from '@components/arrays';
import {classNames} from '@components/class-names';
import {Column, Shares, TableProps, seededShares} from '@components/Table';
import {useLazyColumnTravel} from './useLazyColumnTravel';
import {useLazyRowTravel} from './useLazyRowTravel';
import {Shifted, Slid, charted, displaced, shifts} from './chart';
import {ColumnGhost, RowGhost} from './ghosts';
import {Direction} from './DraggableHeader';
import {AnimatedDraggableHeader} from './AnimatedDraggableHeader';
import {AnimatedDraggableRow} from './AnimatedDraggableRow';
import './sortable.css';
import './staged.css';

export type LazyKeepAnimatedTableProps = TableProps & {
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

export const LazyKeepAnimatedTable: FC<LazyKeepAnimatedTableProps> = (
    {columns, rows, draggableColumns = false, draggableRows = false, sortable, id, ...dress}
) => {
    const [shares, setShares] = useState<Shares>(() => seededShares(columns));
    const [ordered, setOrdered] = useState<Column[]>(() => [...columns]);
    const [seats, setSeats] = useState<number[]>(() => rows.map((_, seat) => seat));
    const [rule, setRule] = useState<Rule>();
    const [slid, setSlid] = useState<Slid>();
    const [shifted, setShifted] = useState<Shifted>();

    const order = ordered.map(({column}) => String(column));
    const clipped = ordered.some(({width}) => has(width));
    const dealt = seats.length === rows.length ? seats : rows.map((_, seat) => seat);
    const standing = has(rule) ? ranked(rows, dealt, rule) : dealt;

    const placedColumn = (column: string, to: number): void =>
        setOrdered(previous => {
            const lifted = previous.find(definition => String(definition.column) === column);
            return has(lifted) ? array.moveToIndex(to, lifted, previous) : previous;
        });
    const settleColumn = (column: string, struck: string): void => {
        setSlid(displaced(order, column, struck, shares));
        placedColumn(column, Math.min(Math.max(order.indexOf(struck), 1), order.length - 2));
    };
    const columnsTravel = useLazyColumnTravel(order, shares, settleColumn);

    const settleRow = (seat: number, struck: number, heights: Shifted): void => {
        const after = array.moveToIndex(seats.indexOf(struck), seat, seats);
        const {[seat]: ridden, ...drops} = shifts(heights, seats, after);
        setShifted(drops);
        setSeats(after);
    };
    const rowsTravel = useLazyRowTravel(standing, settleRow);

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
        ordered,
        shares,
        rule,
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
        rows,
        ordered,
        standing,
        gripped: draggableRows,
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

    const aloftColumn = ordered.find(definition => String(definition.column) === columnsTravel.aloft);
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
                <AnimatedDraggableHeader key={String(column.column)} column={column} table={columnState}/>
            )}</tr>
            </thead>
            <tbody className={dress.tbodyClassName}>{standing.map(seat =>
                <AnimatedDraggableRow key={seat} seat={seat} table={rowState}/>
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
