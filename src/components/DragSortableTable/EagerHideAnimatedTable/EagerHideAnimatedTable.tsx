import {FC, MouseEvent, useState} from 'react';
import {has} from '@ryandur/sand';
import {array} from '@components/arrays';
import {classNames} from '@components/class-names';
import {Column, Shares, TableProps, measuredShares} from '@components/Table';
import {useColumnTravel} from './useColumnTravel';
import {useRowTravel} from './useRowTravel';
import {Bounds, Shifted, Slid, surveyed, displaced, interior, placed, shifts} from '../survey';
import {Aloft} from '../Aloft';
import {Direction, Rule, ranked} from '../sorting';
import {Header} from './Header';
import {Row} from './Row';
import '../sortable.css';
import './EagerHideAnimatedTable.css';

export type EagerHideAnimatedTableProps = TableProps & {
    draggableColumns?: boolean;
    draggableRows?: boolean;
    sortable?: boolean;
};

export const EagerHideAnimatedTable: FC<EagerHideAnimatedTableProps> = (
    {columns, rows, draggableColumns = false, draggableRows = false, resizableColumns = false, sortable, id, ...dress}
) => {
    const [shares, setShares] = useState<Shares>();
    const [ordered, setOrdered] = useState<Column[]>(() => [...columns]);
    const [seats, setSeats] = useState<number[]>(() => rows.map((_, card) => card));
    const [rule, setRule] = useState<Rule>();
    const [slid, setSlid] = useState<Slid>();
    const [shifted, setShifted] = useState<Shifted>();

    const order = ordered.map(({column}) => column);
    const awaken = (table: HTMLTableElement): void =>
        setShares(previous => previous ?? measuredShares(order, table));
    const clipped = resizableColumns;
    const dealt = seats.length === rows.length ? seats : rows.map((_, card) => card);
    const standing = has(rule) ? ranked(rows, dealt, rule) : dealt;

    const placedColumn = (column: string, to: number): void =>
        setOrdered(previous => placed(previous, column, to));
    const settleColumn = (column: string, struck: string, survey: Bounds): void => {
        setSlid(displaced(order, column, struck, survey));
        placedColumn(column, interior(order.indexOf(struck), order.length));
    };
    const columnsTravel = useColumnTravel(order, settleColumn);

    const settleRow = (card: number, struck: number, heights: Shifted): void => {
        const after = array.moveToIndex(seats.indexOf(struck), card, seats);
        setShifted(shifts(heights, seats, after, card));
        setSeats(after);
    };
    const rowsTravel = useRowTravel(order, standing, settleRow);

    const ruled = (column: string, direction: Direction | undefined, event: MouseEvent<HTMLButtonElement>): void => {
        const next = has(direction) ? {column, direction} : undefined;
        const table = event.currentTarget.closest('table');
        if (has(table)) {
            const after = has(next)
                ? ranked(rows, dealt, next)
                : dealt;
            setShifted(shifts(surveyed(table, order, standing).rowHeights, standing, after));
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
                   clipped && 'apportioned',
                   (draggableColumns || draggableRows) && 'sortable'
               )}>
            <thead className={dress.theadClassName}>
            <tr className={classNames(
                dress.trClassName,
                dress.headerRowClassName
            )}>{ordered.map(column =>
                <Header key={column.column}
                    column={column}
                    order={order}
                    share={shares?.[column.column]}
                    resizable={resizableColumns}
                    onAwaken={awaken}
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
                <Row key={card}
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
               ordered={ordered} rows={rows} standing={standing} dress={dress}/>
    </>;
};
