import {FC, MouseEvent, useState} from 'react';
import {has} from '@ryandur/sand';
import {array} from '@components/arrays';
import {classNames} from '@components/class-names';
import {Column, Shares, TableProps, seededShares} from '@components/Table';
import {useEagerColumnTravel} from '../useEagerColumnTravel';
import {useEagerRowTravel} from '../useEagerRowTravel';
import {Shifted, Slid, charted, displaced, interior, placed, shifts} from '../chart';
import {Aloft} from '../Aloft';
import {Direction, Rule, ranked} from '../sorting';
import {AnimatedDraggableHeader} from '../AnimatedDraggableHeader';
import {AnimatedDraggableRow} from '../AnimatedDraggableRow';
import '../sortable.css';
import '../hide.css';
import '../staged.css';

export type EagerHideAnimatedTableProps = TableProps & {
    draggableColumns?: boolean;
    draggableRows?: boolean;
    sortable?: boolean;
};

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
        setOrdered(previous => placed(previous, column, to));
    const settleColumn = (column: string, struck: string): void => {
        setSlid(displaced(order, column, struck, shares));
        placedColumn(column, interior(order.indexOf(struck), order.length));
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

    const headerClassName = classNames(dress.thClassName, dress.cellClassName);
    const rowClassName = classNames(dress.trClassName, dress.rowClassName);
    const cellClassName = classNames(dress.tdClassName, dress.cellClassName);


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
                <AnimatedDraggableHeader key={column.column}
                    column={column}
                    order={order}
                    shares={shares}
                    rule={rule}
                    aloft={columnsTravel.aloft}
                    slid={slid}
                    draggable={draggableColumns}
                    className={headerClassName}
                    onLift={columnsTravel.lift}
                    onOrdered={(column, to, marks) => {
                        setSlid(marks);
                        placedColumn(column, to);
                    }}
                    onShared={setShares}
                    onRule={sortable ? ruled : undefined}/>
            )}</tr>
            </thead>
            <tbody className={dress.tbodyClassName}>{standing.map(card =>
                <AnimatedDraggableRow key={card}
                    card={card}
                    row={rows[card]}
                    columns={order}
                    clipped={clipped}
                    standing={standing}
                    gripped={draggableRows}
                    aloft={rowsTravel.aloft}
                    aloftColumn={columnsTravel.aloft}
                    slid={slid}
                    shifted={shifted}
                    className={rowClassName}
                    cellClassName={cellClassName}
                    onLift={lifted => event => {
                        setRule(undefined);
                        setSeats(standing);
                        rowsTravel.lift(lifted)(event);
                    }}
                    onArranged={(after, drops) => {
                        setShifted(drops);
                        setRule(undefined);
                        setSeats(after);
                    }}/>
            )}</tbody>
        </table>
        <Aloft columnsTravel={columnsTravel} rowsTravel={rowsTravel}
               ordered={ordered} shares={shares} rows={rows} standing={standing} dress={dress}/>
    </>;
};
