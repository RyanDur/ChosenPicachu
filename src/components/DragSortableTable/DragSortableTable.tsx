import {FC, PointerEvent, useState} from 'react';
import {has, not, notEmpty} from '@ryandur/sand';
import {array} from '@components/arrays';
import {join} from '@components/class-names';
import {KeyboardEvent} from 'react';
import {Shares, TableProps, neighborOf, seededShares, traded} from '@components/Table';
import {DragStyle, useTravel} from './useTravel';
import {Chart, anchored, charted, columnUnder, seatUnder, shifts} from './chart';
import {ColumnGhost, RowGhost} from './ghosts';
import {DraggableHeader, Direction} from './DraggableHeader';
import {DraggableRow} from './DraggableRow';
import './DragSortableTable.css';

export type DragSortableTableProps = TableProps & {
    draggableColumns?: DragStyle;
    draggableRows?: DragStyle;
    sortable?: boolean;
    animated?: boolean;
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

export const DragSortableTable: FC<DragSortableTableProps> = (
    {columns, rows, draggableColumns, draggableRows, sortable, animated, id, ...dress}
) => {
    const [shares, setShares] = useState<Shares>(() => seededShares(columns));
    const [order, setOrder] = useState<string[]>(() => columns.map(({column}) => String(column)));
    const [seats, setSeats] = useState<number[]>(() => rows.map((_, seat) => seat));
    const [chart, setChart] = useState<Chart>();
    const [rule, setRule] = useState<Rule>();
    const [slid, setSlid] = useState<Readonly<Record<string, {toward: 'left' | 'right'; by: number}>>>();
    const [shifted, setShifted] = useState<Readonly<Record<number, number>>>();

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
        if (animated) {
            const from = order.indexOf(key);
            const to = Math.min(Math.max(order.indexOf(struck), 1), order.length - 2);
            const displaced = from < to ? order.slice(from + 1, to + 1) : order.slice(to, from);
            setSlid(Object.fromEntries(displaced.map(seat =>
                [seat, {toward: from < to ? 'left' : 'right', by: shares[key] ?? 0}])));
        }
        setOrder(previous => {
            const at = Math.min(Math.max(previous.indexOf(struck), 1), previous.length - 2);
            return array.moveToIndex(at, key, previous);
        });
    };
    const columnsTravel = useTravel<string>(
        draggableColumns, columnUnder(chart, order, shares), settleColumn);
    const shifting = (heights: Readonly<Record<number, number>>, before: readonly number[], after: readonly number[]): void =>
        setShifted(shifts(heights, before, after));

    const settleRow = (seat: number, struck: number): void => {
        const after = array.moveToIndex(seats.indexOf(struck), seat, seats);
        if (animated && has(chart)) {
            const {[seat]: carried, ...displaced} = shifts(chart.rowHeights, seats, after);
            setShifted(displaced);
        }
        setSeats(after);
    };
    const rowsTravel = useTravel<number>(draggableRows, seatUnder(chart, seats), settleRow);

    const nudgedColumn = (key: string) => (toward: 1 | -1): void => {
        const from = order.indexOf(key);
        const to = Math.min(Math.max(from + toward, 1), order.length - 2);
        if (to === from) {
            return;
        }
        const neighbor = order[to];
        if (animated) {
            setSlid({
                [key]: {toward: toward > 0 ? 'right' : 'left', by: shares[neighbor] ?? 0},
                [neighbor]: {toward: toward > 0 ? 'left' : 'right', by: shares[key] ?? 0}
            });
        }
        setOrder(array.moveToIndex(to, key, order));
    };

    const nudged = (seat: number) => (toward: 1 | -1, event: KeyboardEvent<HTMLElement>): void => {
        const lane = event.currentTarget.closest('tr');
        if (has(lane) && (lane.getAnimations?.().length ?? 0) > 0) {
            return;
        }
        const to = Math.min(Math.max(standing.indexOf(seat) + toward, 0), standing.length - 1);
        const after = array.moveToIndex(to, seat, standing);
        const table = event.currentTarget.closest('table');
        if (animated && has(table)) {
            shifting(charted(table, arranged).rowHeights, standing, after);
        }
        setRule(undefined);
        setSeats(after);
    };

    const liftColumn = (key: string) => (event: PointerEvent<HTMLTableCellElement>): void => {
        const table = event.currentTarget.closest('table');
        if (has(table)) {
            setChart(charted(table, arranged));
        }
        columnsTravel.lift(key, event.currentTarget)(event);
    };
    const liftRow = (seat: number) => (event: PointerEvent<HTMLElement>): void => {
        setRule(undefined);
        setSeats(standing);
        const table = event.currentTarget.closest('table');
        if (has(table)) {
            setChart(charted(table, arranged));
        }
        rowsTravel.lift(seat, event.currentTarget.closest('tr'))(event);
    };

    const aloftColumn = has(columnsTravel.aloft) ? byKey.get(columnsTravel.aloft) : undefined;
    const aloftRow = has(rowsTravel.aloft) ? rows[rowsTravel.aloft] : undefined;
    const surface = has(columnsTravel.aloft) ? columnsTravel.surface : rowsTravel.surface;

    return <>
        <div className="table-stage">
        <table id={id}
               onAnimationEnd={event => {
                   if (event.animationName.startsWith('displaced-')) {
                       setSlid(undefined);
                   }
                   if (event.animationName === 'shifted') {
                       setShifted(undefined);
                   }
               }}
               className={join(
                   dress.tableClassName,
                   clipped && 'apportioned',
                   (has(draggableColumns) || has(draggableRows)) && 'sortable'
               )}>
            <thead className={dress.theadClassName}>
            <tr className={join(
                dress.trClassName,
                dress.headerRowClassName
            )}>{ordered.map((column, position) => {
                const key = String(column.column);
                return <DraggableHeader key={key}
                                        displaced={slid?.[key]}
                                        column={column}
                                        share={has(column.width) ? shares[key] : undefined}
                                        clipped={clipped}
                                        travels={has(draggableColumns) && not(anchored(position, ordered.length))}
                                        hidden={columnsTravel.hiding && columnsTravel.aloft === key}
                                        sorted={rule?.column === key ? rule.direction : undefined}
                                        dress={dress}
                                        onLift={liftColumn(key)}
                                        onNudge={nudgedColumn(key)}
                                        onTrade={apportioned.length > 1
                                            ? delta => setShares(traded(key, neighborOf(apportioned, key), delta))
                                            : undefined}
                                        onRule={sortable && position > 0
                                            ? (direction, event) => {
                                                const table = event.currentTarget.closest('table');
                                                const next = has(direction) ? {column: key, direction} : undefined;
                                                if (animated && has(table)) {
                                                    const after = has(next)
                                                        ? ranked(rows, dealt, next)
                                                        : dealt.map(seat => ({row: rows[seat], seat}));
                                                    shifting(charted(table, arranged).rowHeights,
                                                        standing, after.map(({seat}) => seat));
                                                }
                                                setRule(next);
                                            }
                                            : undefined}/>;
            })}</tr>
            </thead>
            <tbody className={dress.tbodyClassName}>{arranged.map(({row, seat}, position) => {
                const drop = shifted?.[seat];
                return <DraggableRow key={seat}
                              row={row}
                              columns={ordered}
                              position={position}
                              clipped={clipped}
                              gripped={has(draggableRows)}
                              hidden={rowsTravel.hiding && rowsTravel.aloft === seat}
                              hiddenColumn={columnsTravel.hiding ? columnsTravel.aloft : undefined}
                              slid={slid}
                              drop={drop}
                              dress={dress}
                              onLift={liftRow(seat)}
                              onNudge={nudged(seat)}/>;
            })}</tbody>
        </table>
        </div>
        {has(aloftColumn) &&
            <ColumnGhost at={columnsTravel.flight} drift={columnsTravel.drift} dress={dress}
                         column={aloftColumn} rows={arranged.map(({row}) => row)}/>}
        {has(aloftRow) &&
            <RowGhost at={rowsTravel.flight} drift={rowsTravel.drift} dress={dress}
                      columns={ordered} row={aloftRow}/>}
        {(has(columnsTravel.aloft) || has(rowsTravel.aloft)) &&
            <article className="drag-surface" {...surface}/>}
    </>;
};
