import {FC, useState} from 'react';
import {has} from '@ryandur/sand';
import {array} from '@components/arrays';
import {classNames} from '@components/class-names';
import {Column, Shares, TableProps, seededShares} from '@components/Table';
import {useEagerColumnTravel} from '../useEagerColumnTravel';
import {useEagerRowTravel} from '../useEagerRowTravel';
import {Aloft} from '../Aloft';
import {interior, placed} from '../chart';
import {Direction, Rule, ranked} from '../sorting';
import {DraggableHeader} from '../DraggableHeader';
import {DraggableRow} from '../DraggableRow';
import '../sortable.css';

export type EagerKeepStaticTableProps = TableProps & {
    draggableColumns?: boolean;
    draggableRows?: boolean;
    sortable?: boolean;
};

export const EagerKeepStaticTable: FC<EagerKeepStaticTableProps> = (
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
        setOrdered(previous => placed(previous, column, to));
    const settleColumn = (column: string, struck: string): void =>
        placedColumn(column, interior(order.indexOf(struck), order.length));
    const columnsTravel = useEagerColumnTravel(order, shares, settleColumn);

    const settleRow = (card: number, struck: number): void =>
        setSeats(array.moveToIndex(seats.indexOf(struck), card, seats));
    const rowsTravel = useEagerRowTravel(standing, settleRow);

    const ruled = (column: string, direction: Direction | undefined): void =>
        setRule(has(direction) ? {column, direction} : undefined);

    const headerClassName = classNames(dress.thClassName, dress.cellClassName);
    const rowClassName = classNames(dress.trClassName, dress.rowClassName);
    const cellClassName = classNames(dress.tdClassName, dress.cellClassName);


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
                <DraggableHeader key={column.column}
                    column={column}
                    order={order}
                    shares={shares}
                    rule={rule}
                    draggable={draggableColumns}
                    className={headerClassName}
                    onLift={columnsTravel.lift}
                    onOrdered={placedColumn}
                    onShared={setShares}
                    onRule={sortable ? ruled : undefined}/>
            )}</tr>
            </thead>
            <tbody className={dress.tbodyClassName}>{standing.map(card =>
                <DraggableRow key={card}
                    card={card}
                    row={rows[card]}
                    columns={order}
                    clipped={clipped}
                    standing={standing}
                    gripped={draggableRows}
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
        <Aloft columnsTravel={columnsTravel} rowsTravel={rowsTravel}
               ordered={ordered} shares={shares} rows={rows} standing={standing} dress={dress}/>
    </>;
};
