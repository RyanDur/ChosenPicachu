import {FC, useState} from 'react';
import {has, not, notEmpty} from '@ryandur/sand';
import {array} from '@components/arrays';
import {join} from '@components/class-names';
import {Shares, TableProps, neighborOf, seededShares, traded} from '@components/Table';
import {useEagerColumnTravel} from './useEagerColumnTravel';
import {useEagerRowTravel} from './useEagerRowTravel';
import {anchored} from './chart';
import {ColumnGhost, RowGhost} from './ghosts';
import {DraggableHeader, Direction} from './DraggableHeader';
import {DraggableRow} from './DraggableRow';
import './sortable.css';
import './hide.css';

export type EagerHideStaticTableProps = TableProps & {
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

export const EagerHideStaticTable: FC<EagerHideStaticTableProps> = (
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

    const settleColumn = (key: string, struck: string): void => {
        setOrder(previous => {
            const at = Math.min(Math.max(previous.indexOf(struck), 1), previous.length - 2);
            return array.moveToIndex(at, key, previous);
        });
    };
    const columnsTravel = useEagerColumnTravel(order, shares, settleColumn);

    const settleRow = (seat: number, struck: number): void => {
        setSeats(array.moveToIndex(seats.indexOf(struck), seat, seats));
    };
    const rowsTravel = useEagerRowTravel(seats, settleRow);


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
            )}>{ordered.map((column, position) => {
                const key = String(column.column);
                return <DraggableHeader key={key}
                                        column={column}
                                        order={order}
                                        share={has(column.width) ? shares[key] : undefined}
                                        clipped={clipped}
                                        travels={draggableColumns && not(anchored(position, ordered.length))}
                                        hidden={columnsTravel.aloft === key}
                                        sorted={rule?.column === key ? rule.direction : undefined}
                                        dress={dress}
                                        onLift={columnsTravel.lift(key)}
                                        onOrdered={setOrder}
                                        onTrade={apportioned.length > 1
                                            ? delta => setShares(traded(key, neighborOf(apportioned, key), delta))
                                            : undefined}
                                        onRule={sortable && position > 0
                                            ? direction => setRule(has(direction) ? {column: key, direction} : undefined)
                                            : undefined}/>;
            })}</tr>
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
                              hidden={rowsTravel.aloft === seat}
                              hiddenColumn={columnsTravel.aloft}
                              dress={dress}
                              onLift={event => {
                          setRule(undefined);
                          setSeats(standing);
                          rowsTravel.lift(seat)(event);
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
