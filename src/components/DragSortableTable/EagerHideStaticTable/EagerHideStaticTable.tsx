import {FC, useState} from 'react';
import {has} from '@ryandur/sand';
import {array} from '@components/arrays';
import {classNames} from '@components/class-names';
import {Column, Shares, TableProps, measuredShares} from '@components/Table';
import {useColumnTravel} from './useColumnTravel';
import {useRowTravel} from './useRowTravel';
import {Aloft} from '../Aloft';
import {interior, placed} from '../survey';
import {Direction, Rule, ranked} from '../sorting';
import {Header} from './Header';
import {Row} from './Row';
import '../sortable.css';
import './EagerHideStaticTable.css';

export type EagerHideStaticTableProps = TableProps & {
    draggableColumns?: boolean;
    draggableRows?: boolean;
    sortable?: boolean;
};

export const EagerHideStaticTable: FC<EagerHideStaticTableProps> = (
    {columns, rows, draggableColumns = false, draggableRows = false, resizableColumns = false, sortable, id, ...dress}
) => {
    const [shares, setShares] = useState<Shares>();
    const [ordered, setOrdered] = useState<Column[]>(() => [...columns]);
    const [seats, setSeats] = useState<number[]>(() => rows.map((_, row) => row));
    const [rule, setRule] = useState<Rule>();

    const order = ordered.map(({column}) => column);
    const awaken = (table: HTMLTableElement): void =>
        setShares(previous => previous ?? measuredShares(order, table));
    const clipped = resizableColumns;
    const dealt = seats.length === rows.length ? seats : rows.map((_, row) => row);
    const standing = has(rule) ? ranked(rows, dealt, rule) : dealt;

    const placedColumn = (column: string, to: number): void =>
        setOrdered(previous => placed(previous, column, to));
    const settleColumn = (column: string, struck: string): void =>
        placedColumn(column, interior(order.indexOf(struck), order.length));
    const columnsTravel = useColumnTravel(order, standing, settleColumn);

    const settleRow = (row: number, struck: number): void =>
        setSeats(array.moveToIndex(seats.indexOf(struck), row, seats));
    const rowsTravel = useRowTravel(order, standing, settleRow);

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
                <Header key={column.column}
                    column={column}
                    order={order}
                    share={shares?.[column.column]}
                    resizable={resizableColumns}
                    onAwaken={awaken}
                    rule={rule}
                    aloft={columnsTravel.aloft}
                    draggable={draggableColumns}
                    className={headerClassName}
                    onLift={columnsTravel.lift}
                    onOrdered={placedColumn}
                    onShared={setShares}
                    onRule={sortable ? ruled : undefined}/>
            )}</tr>
            </thead>
            <tbody className={dress.tbodyClassName}>{standing.map(row =>
                <Row key={row}
                    row={row}
                    cells={rows[row]}
                    columns={order}
                    clipped={clipped}
                    standing={standing}
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
        <Aloft columnsTravel={columnsTravel} rowsTravel={rowsTravel}
               ordered={ordered} rows={rows} standing={standing} dress={dress}/>
    </>;
};
