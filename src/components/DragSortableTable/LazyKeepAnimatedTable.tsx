import {FC, KeyboardEvent, PointerEvent, useState} from 'react';
import {has, not, notEmpty} from '@ryandur/sand';
import {array} from '@components/arrays';
import {join} from '@components/class-names';
import {Shares, TableProps, neighborOf, seededShares, traded} from '@components/Table';
import {useLazyColumnTravel} from './useLazyColumnTravel';
import {useLazyRowTravel} from './useLazyRowTravel';
import {Shifted, Slid, anchored, charted, shifts} from './chart';
import {ColumnGhost, RowGhost} from './ghosts';
import {DraggableHeader, Direction} from './DraggableHeader';
import {DraggableRow} from './DraggableRow';
import './DragSortableTable.css';

export type LazyKeepAnimatedTableProps = TableProps & {
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

export const LazyKeepAnimatedTable: FC<LazyKeepAnimatedTableProps> = (
    {columns, rows, draggableColumns = false, draggableRows = false, sortable, id, ...dress}
) => {
    const [shares, setShares] = useState<Shares>(() => seededShares(columns));
    const [order, setOrder] = useState<string[]>(() => columns.map(({column}) => String(column)));
    const [seats, setSeats] = useState<number[]>(() => rows.map((_, seat) => seat));
    const [rule, setRule] = useState<Rule>();
    const [slid, setSlid] = useState<Slid>();
    const [shifted, setShifted] = useState<Shifted>();

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
        const from = order.indexOf(key);
        const to = Math.min(Math.max(order.indexOf(struck), 1), order.length - 2);
        const displaced = from < to ? order.slice(from + 1, to + 1) : order.slice(to, from);
        setSlid(Object.fromEntries(displaced.map(neighbour =>
            [neighbour, {toward: from < to ? 'left' : 'right', by: shares[key] ?? 0}])));
        setOrder(previous => {
            const at = Math.min(Math.max(previous.indexOf(struck), 1), previous.length - 2);
            return array.moveToIndex(at, key, previous);
        });
    };
    const columnsTravel = useLazyColumnTravel(order, shares, settleColumn);

    const settleRow = (seat: number, struck: number, heights: Shifted): void => {
        const after = array.moveToIndex(seats.indexOf(struck), seat, seats);
        const {[seat]: ridden, ...drops} = shifts(heights, seats, after);
        setShifted(drops);
        setSeats(after);
    };
    const rowsTravel = useLazyRowTravel(seats, settleRow);

    const nudgedColumn = (key: string) => (toward: 1 | -1): void => {
        const from = order.indexOf(key);
        const to = Math.min(Math.max(from + toward, 1), order.length - 2);
        if (to === from) {
            return;
        }
        const neighbour = order[to];
        setSlid({
            [key]: {toward: toward > 0 ? 'right' : 'left', by: shares[neighbour] ?? 0},
            [neighbour]: {toward: toward > 0 ? 'left' : 'right', by: shares[key] ?? 0}
        });
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
        if (has(table)) {
            setShifted(shifts(charted(table, standing).rowHeights, standing, after));
        }
        setRule(undefined);
        setSeats(after);
    };

    const liftRow = (seat: number) => (event: PointerEvent<HTMLElement>): void => {
        setRule(undefined);
        setSeats(standing);
        rowsTravel.lift(seat)(event);
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
                   (draggableColumns || draggableRows) && 'sortable'
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
                                        travels={draggableColumns && not(anchored(position, ordered.length))}
                                        sorted={rule?.column === key ? rule.direction : undefined}
                                        dress={dress}
                                        onLift={columnsTravel.lift(key)}
                                        onNudge={nudgedColumn(key)}
                                        onTrade={apportioned.length > 1
                                            ? delta => setShares(traded(key, neighborOf(apportioned, key), delta))
                                            : undefined}
                                        onRule={sortable && position > 0
                                            ? (direction, event) => {
                                                const table = event.currentTarget.closest('table');
                                                const next = has(direction) ? {column: key, direction} : undefined;
                                                if (has(table)) {
                                                    const after = has(next)
                                                        ? ranked(rows, dealt, next)
                                                        : dealt.map(seat => ({row: rows[seat], seat}));
                                                    setShifted(shifts(charted(table, standing).rowHeights,
                                                        standing, after.map(({seat}) => seat)));
                                                }
                                                setRule(next);
                                            }
                                            : undefined}/>;
            })}</tr>
            </thead>
            <tbody className={dress.tbodyClassName}>{arranged.map(({row, seat}, position) =>
                <DraggableRow key={seat}
                              row={row}
                              columns={ordered}
                              position={position}
                              clipped={clipped}
                              gripped={draggableRows}
                              slid={slid}
                              drop={shifted?.[seat]}
                              dress={dress}
                              onLift={liftRow(seat)}
                              onNudge={nudged(seat)}/>
            )}</tbody>
        </table>
        </div>
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
