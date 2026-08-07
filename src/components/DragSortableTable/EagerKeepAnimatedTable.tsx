import {FC, MouseEvent, PointerEvent, useState} from 'react';
import {has} from '@ryandur/sand';
import {array} from '@components/arrays';
import {classNames} from '@components/class-names';
import {Column, Shares, TableProps, seededShares} from '@components/Table';
import {useEagerColumnTravel} from './useEagerColumnTravel';
import {useEagerRowTravel} from './useEagerRowTravel';
import {Shifted, Slid, charted, displaced, shifts} from './chart';
import {Aloft} from './Aloft';
import {Direction, Rule, ranked} from './sorting';
import {AnimatedDraggableHeader} from './AnimatedDraggableHeader';
import {AnimatedDraggableRow} from './AnimatedDraggableRow';
import './sortable.css';
import './staged.css';

export type EagerKeepAnimatedTableProps = TableProps & {
    draggableColumns?: boolean;
    draggableRows?: boolean;
    sortable?: boolean;
};

export const EagerKeepAnimatedTable: FC<EagerKeepAnimatedTableProps> = (
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
        setShifted(shifts(heights, seats, after, card));
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
        <Aloft columnsTravel={columnsTravel} rowsTravel={rowsTravel}
               ordered={ordered} shares={shares} rows={rows} standing={standing} dress={dress}/>
    </>;
};
