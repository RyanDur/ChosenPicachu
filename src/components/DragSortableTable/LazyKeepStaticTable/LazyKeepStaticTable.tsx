import {FC} from 'react';
import {has, maybe} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {TableProps, dealt, measuredShares} from '@components/Table';
import {interior} from '../survey';
import {columnLift, Grab, grounded, rowLift, surfaceTravel} from '../travel';
import {lazyColumnFlight, lazyRowFlight} from '../flights';
import {baked, Cell, columnAloft, drifting as drifts, dropped, lifted, nudgedTo, orderedTo, rowAloft, seatedTo, sharedAs, standingOf, tradedBy} from '../table-state';
import {useTableState} from '../useTableState';
import {Aloft} from '../Aloft';
import {MoveReport} from '../MoveReport';
import {Direction} from '../sorting';
import {Header} from './Header';
import {Row} from './Row';
import '../sortable.css';

export type LazyKeepStaticTableProps = TableProps & {
    draggableColumns?: boolean;
    draggableRows?: boolean;
    sortable?: boolean;
};

export const LazyKeepStaticTable: FC<LazyKeepStaticTableProps> = (
    {children, draggableColumns = false, draggableRows = false, resizableColumns = false, sortable, id}
) => {
    const {columns, rows} = dealt(children);
    const [state, commit] = useTableState(columns.map(({column}) => column), rows);
    const cell: Cell = {state: () => state, commit};
    const {order, shares, rule} = state;
    const standing = standingOf(rows, state);
    const ordered = order.flatMap(name => {
        const definition = columns.find(({column}) => column === name);
        return has(definition) ? [definition] : [];
    });
    const clipped = resizableColumns;

    const awaken = (table: HTMLTableElement): void =>
        commit(current => has(current.shares) ? current : sharedAs(measuredShares(current.order, table))(current));

    const settleColumn = (held: string, struck: string): void =>
        commit(orderedTo(order.indexOf(held), interior(order.indexOf(struck), order.length)));

    const settleRow = (held: number, struck: number): void =>
        commit(seatedTo(held, struck));

    const grabbedColumn = (column: string) => (grab: Grab): void =>
        commit(lifted({axis: 'column', held: column}, grab));

    const grabbedRow = (row: number) => (grab: Grab): void =>
        commit(current => lifted({axis: 'row', held: row}, grab)(baked(current)));

    const drop = (): void => commit(dropped);

    const drifting = (moving: {clientX: number; clientY: number}): void =>
        commit(drifts(moving));

    const columnFlight = lazyColumnFlight<Cell>((_cell, held, struck) => settleColumn(held, struck));
    const rowFlight = lazyRowFlight<Cell>((_cell, held, struck) => settleRow(held, struck));
    const surface = (travel: (moving: {clientX: number; clientY: number}) => void, land: () => void) => {
        const landed = (): void => {
            land();
            drop();
        };
        return {
            onPointerMove: surfaceTravel(drifting, travel, landed),
            onPointerUp: landed,
            onPointerCancel: landed,
            onLostPointerCapture: landed
        };
    };

    const columnsTravel = {
        aloft: columnAloft(state),
        survey: maybe(state.bounds),
        flight: state.flight ?? grounded,
        drift: state.drift,
        surface: surface(moving => columnFlight.travel(cell, moving), () => maybe(columnFlight.land).map(land => land(cell)))
    };
    const rowsTravel = {
        aloft: rowAloft(state),
        survey: maybe(state.bounds),
        flight: state.flight ?? grounded,
        drift: state.drift,
        surface: surface(moving => rowFlight.travel(cell, moving), () => maybe(rowFlight.land).map(land => land(cell)))
    };

    const ruled = (
        column: string,
        direction: Direction | undefined
    ): void =>
        commit(current => ({...current, rule: has(direction) ? {column, direction} : undefined}));

    return <>
        <table id={id}
               className={classNames(
                   'fancy-table',
                   clipped && 'apportioned',
                   (draggableColumns || draggableRows) && 'sortable'
               )}>
            <thead className="header">
            <tr className="row">{ordered.map(column =>
                <Header key={column.column}
                    column={column}
                    order={order}
                    share={shares?.[column.column]}
                    resizable={resizableColumns}
                    onAwaken={awaken}
                    rule={rule}
                    draggable={draggableColumns}
                    onLift={column => columnLift(column, () => order, () => standing, grabbedColumn(column))}
                    onOrdered={(column, to) =>
                        commit(orderedTo(order.indexOf(column), to))}
                    onTraded={(column, delta) => commit(tradedBy(column, delta))}
                    onRule={sortable ? ruled : undefined}/>
            )}</tr>
            </thead>
            <tbody className="body">{standing.map(row =>
                <Row key={row}
                    row={row}
                    cells={rows[row]}
                    columns={order}
                    clipped={clipped}
                    standing={standing}
                    gripped={draggableRows}
                    onLift={row => rowLift(() => order, () => standing, grabbedRow(row))}
                    onArranged={to =>
                        commit(current => nudgedTo(row, to)(baked(current)))}/>
            )}</tbody>
        </table>
        <MoveReport landed={state.landed}/>
        <Aloft columnsTravel={columnsTravel} rowsTravel={rowsTravel}
               ordered={ordered} rows={rows} standing={standing}/>
    </>;
};
