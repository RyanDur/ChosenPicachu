import {has, notEmpty} from '@ryandur/sand';
import {array} from '@components/arrays';
import {Column, Row} from './types';
import {FC, useRef, useState} from 'react';
import {join} from '@components/class-names';
import {DragStyle, useTravel} from './useTravel';
import {ColumnGhost, RowGhost} from './Ghosts';
import {ResizeHandle} from './ResizeHandle';
import {RowGrip} from './RowGrip';
import './Table.css';

export type ColumnDragStyle = DragStyle;
export type {DragStyle} from './useTravel';

export type TableProps = {
    columns: Column[];
    rows: Row[];
    draggableColumns?: DragStyle;
    draggableRows?: DragStyle;
    id?: string;
    tableClassName?: string;
    theadClassName?: string;
    tbodyClassName?: string;
    trClassName?: string;
    thClassName?: string;
    tdClassName?: string;
    headerRowClassName?: string;
    rowClassName?: string;
    cellClassName?: string;
}

const SLIMMEST = 5;

type Shares = Readonly<Record<string, number>>;

const seededShares = (columns: Column[]): Shares => {
    const sized = columns.filter(({width}) => has(width));
    const total = sized.reduce((sum, {width}) => sum + (width ?? 0), 0);
    return sized.reduce<Shares>((shares, {column, width}) =>
        ({...shares, [String(column)]: (width ?? 0) / total * 100}), {});
};

const traded = (column: string, neighbor: string, delta: number) => (previous: Shares): Shares => {
    const given = Math.min(
        Math.max(delta, SLIMMEST - previous[column]),
        previous[neighbor] - SLIMMEST
    );
    return {...previous, [column]: previous[column] + given, [neighbor]: previous[neighbor] - given};
};

const within = (x: number, y: number, rect: DOMRect): boolean =>
    x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

const under = <SUBJECT, ELEMENT extends HTMLElement>(
    registry: Map<SUBJECT, ELEMENT>, x: number, y: number
): SUBJECT | undefined => {
    for (const [subject, element] of registry) {
        if (within(x, y, element.getBoundingClientRect())) {
            return subject;
        }
    }
    return undefined;
};

export const Table: FC<TableProps> = (
    {
        columns,
        rows,
        draggableColumns,
        draggableRows,
        id,
        tableClassName,
        theadClassName,
        tbodyClassName,
        trClassName,
        thClassName,
        tdClassName,
        headerRowClassName,
        rowClassName,
        cellClassName
    }
) => {
    const [shares, setShares] = useState<Shares>(() => seededShares(columns));
    const [order, setOrder] = useState<string[]>(() => columns.map(({column}) => String(column)));
    const [seats, setSeats] = useState<number[]>(() => rows.map((_, seat) => seat));
    const headers = useRef(new Map<string, HTMLTableCellElement>());
    const seatings = useRef(new Map<number, HTMLTableRowElement>());

    const byKey = new Map(columns.map(definition => [String(definition.column), definition]));
    const ordered = order.map(key => byKey.get(key)).filter(has);
    const apportioned = ordered.filter(({width}) => has(width)).map(({column}) => String(column));
    const clipped = notEmpty(apportioned);
    const arranged = seats.length === rows.length
        ? seats.map(seat => ({row: rows[seat], seat}))
        : rows.map((row, seat) => ({row, seat}));
    const dress = {
        tableClassName, theadClassName, tbodyClassName, trClassName,
        thClassName, tdClassName, headerRowClassName, rowClassName, cellClassName
    };

    const neighborOf = (key: string): string => {
        const index = apportioned.indexOf(key);
        return apportioned[index + 1] ?? apportioned[index - 1];
    };
    const anchored = (position: number): boolean =>
        position === 0 || position === ordered.length - 1;

    const columnsTravel = useTravel<string>(
        draggableColumns,
        (x, y) => under(headers.current, x, y),
        (key, struck) => setOrder(previous => {
            const at = Math.min(Math.max(previous.indexOf(struck), 1), previous.length - 2);
            return array.moveToIndex(at, key, previous);
        }));
    const rowsTravel = useTravel<number>(
        draggableRows,
        (x, y) => under(seatings.current, x, y),
        (seat, struck) => setSeats(previous =>
            array.moveToIndex(previous.indexOf(struck), seat, previous)));

    const nudged = (seat: number) => (toward: 1 | -1): void =>
        setSeats(previous => {
            const to = Math.min(Math.max(previous.indexOf(seat) + toward, 0), previous.length - 1);
            return array.moveToIndex(to, seat, previous);
        });

    const aloftColumn = has(columnsTravel.aloft) ? byKey.get(columnsTravel.aloft) : undefined;
    const aloftRow = has(rowsTravel.aloft) ? rows[rowsTravel.aloft] : undefined;

    return <>
        <table id={id}
               className={join(
                   tableClassName,
                   clipped && 'apportioned',
                   (has(draggableColumns) || has(draggableRows)) && 'sortable'
               )}>
            <thead className={theadClassName}>
            <tr className={join(
                trClassName,
                headerRowClassName
            )}>{ordered.map(({display, column, className, width}, position) => {
                const key = String(column);
                const share = has(width) ? shares[key] : undefined;
                const travels = has(draggableColumns) && !anchored(position);
                return <th className={join(
                               thClassName, cellClassName, className,
                               clipped && 'clipped',
                               travels && 'grabbable',
                               columnsTravel.hiding && columnsTravel.aloft === key && 'hide'
                           )}
                           key={key}
                           ref={element => {
                               if (element === null) {
                                   headers.current.delete(key);
                               } else {
                                   headers.current.set(key, element);
                               }
                           }}
                           scope="col"
                           onPointerDown={travels
                               ? event => columnsTravel.lift(key, event.currentTarget)(event)
                               : undefined}
                           style={has(share) ? {width: `${share}%`} : undefined}>
                    {display}
                    {has(share) && apportioned.length > 1 &&
                        <ResizeHandle column={key}
                                      share={share}
                                      onTrade={delta => setShares(traded(key, neighborOf(key), delta))}/>}
                </th>;
            })}</tr>
            </thead>
            <tbody className={tbodyClassName}>{arranged.map(({row, seat}, position) =>
                <tr className={join(trClassName, rowClassName)}
                    key={seat}
                    ref={element => {
                        if (element === null) {
                            seatings.current.delete(seat);
                        } else {
                            seatings.current.set(seat, element);
                        }
                    }}>
                    {ordered.map(({column}, columnNumber) => {
                        const cell = row[column];
                        return <td className={join(
                                       tdClassName, cellClassName, cell.className,
                                       clipped && 'ellipsis',
                                       columnsTravel.hiding && columnsTravel.aloft === String(column) && 'hide',
                                       rowsTravel.hiding && rowsTravel.aloft === seat && 'hide-across'
                                   )} key={columnNumber}>
                            {columnNumber === 0 && has(draggableRows) &&
                                <RowGrip row={position + 1}
                                         onLift={event =>
                                             rowsTravel.lift(seat, event.currentTarget.closest('tr'))(event)}
                                         onNudge={nudged(seat)}/>}
                            {cell.display}
                        </td>;
                    })}</tr>
            )}</tbody>
        </table>
        {has(aloftColumn) &&
            <ColumnGhost at={columnsTravel.flight} ghost={columnsTravel.ghost} dress={dress}
                         column={aloftColumn} rows={arranged.map(({row}) => row)}/>}
        {has(aloftRow) &&
            <RowGhost at={rowsTravel.flight} ghost={rowsTravel.ghost} dress={dress}
                      columns={ordered} row={aloftRow}/>}
        {(has(columnsTravel.aloft) || has(rowsTravel.aloft)) &&
            <article className="drag-surface"
                     {...(has(columnsTravel.aloft) ? columnsTravel.surface : rowsTravel.surface)}/>}
    </>;
};

export type {Column, Row} from './types';
