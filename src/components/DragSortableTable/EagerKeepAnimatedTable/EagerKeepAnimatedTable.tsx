import {FC, MouseEvent, useState} from 'react';
import {has, maybe} from '@ryandur/sand';
import {array} from '@components/arrays';
import {classNames} from '@components/class-names';
import {TableProps, dealt, measuredShares} from '@components/Table';
import {displaced, interior, Shifted, shifts, Slid, surveyed} from '../survey';
import {columnLift, Grab, grounded, rowLift, surfaceTravel} from '../travel';
import {eagerColumnFlight, eagerRowFlight} from '../flights';
import {baked, Cell, columnAloft, drifting as drifts, dropped, lifted, nudgedTo, orderedTo, rowAloft, seatedTo, sharedAs, standingOf, tradedBy} from '../table-state';
import {useTableState} from '../useTableState';
import {Aloft} from '../Aloft';
import {MoveReport} from '../MoveReport';
import {Direction, ranked} from '../sorting';
import {Header} from './Header';
import {Row} from './Row';
import '../sortable.css';
import './EagerKeepAnimatedTable.css';

export type EagerKeepAnimatedTableProps = TableProps & {
    draggableColumns?: boolean;
    draggableRows?: boolean;
    sortable?: boolean;
};

export const EagerKeepAnimatedTable: FC<EagerKeepAnimatedTableProps> = (
    {children, draggableColumns = false, draggableRows = false, resizableColumns = false, sortable, id}
) => {
    const {columns, rows} = dealt(children);
    const [state, commit] = useTableState(columns.map(({column}) => column), rows);
    const cell: Cell = {state: () => state, commit};
    const [slid, setSlid] = useState<Slid>();
    const [shifted, setShifted] = useState<Shifted>();

    const {order, shares, rule} = state;
    const standing = standingOf(rows, state);
    const ordered = order.flatMap(name => {
        const definition = columns.find(({column}) => column === name);
        return has(definition) ? [definition] : [];
    });
    const clipped = resizableColumns;

    const awaken = (table: HTMLTableElement): void =>
        commit(current => has(current.shares) ? current : sharedAs(measuredShares(current.order, table))(current));

    const settleColumn = (held: string, struck: string): void => {
        maybe(state.bounds).map(measured => setSlid(displaced(order, held, struck, measured)));
        commit(orderedTo(order.indexOf(held), interior(order.indexOf(struck), order.length)));
    };

    const settleRow = (held: number, struck: number): void => {
        maybe(state.bounds).map(measured => {
            const after = array.moveToIndex(state.seats.indexOf(struck), held, state.seats);
            setShifted(shifts(measured.rowHeights, state.seats, after, held));
        });
        commit(seatedTo(held, struck));
    };

    const grabbedColumn = (column: string) => (grab: Grab): void =>
        commit(lifted({axis: 'column', held: column}, grab));

    const grabbedRow = (row: number) => (grab: Grab): void =>
        commit(current => lifted({axis: 'row', held: row}, grab)(baked(current)));

    const drop = (): void => commit(dropped);

    const drifting = (moving: {clientX: number; clientY: number}): void =>
        commit(drifts(moving));

    const columnFlight = eagerColumnFlight<Cell>((_cell, held, struck) => settleColumn(held, struck));
    const rowFlight = eagerRowFlight<Cell>((_cell, held, struck) => settleRow(held, struck));
    const surface = (travel: (moving: {clientX: number; clientY: number}) => void) => ({
        onPointerMove: surfaceTravel(drifting, travel, drop),
        onPointerUp: drop,
        onPointerCancel: drop,
        onLostPointerCapture: drop
    });

    const columnsTravel = {
        aloft: columnAloft(state),
        survey: maybe(state.bounds),
        flight: state.flight ?? grounded,
        drift: state.drift,
        surface: surface(moving => columnFlight.travel(cell, moving))
    };
    const rowsTravel = {
        aloft: rowAloft(state),
        survey: maybe(state.bounds),
        flight: state.flight ?? grounded,
        drift: state.drift,
        surface: surface(moving => rowFlight.travel(cell, moving))
    };

    const ruled = (
        column: string,
        direction: Direction | undefined,
        event: MouseEvent<HTMLButtonElement>
    ): void => {
        const next = has(direction) ? {column, direction} : undefined;
        const table = event.currentTarget.closest('table');
        if (has(table)) {
            const after = has(next) ? ranked(rows, state.seats, next) : state.seats;
            setShifted(shifts(surveyed(table, order, standing).rowHeights, standing, after));
        }
        commit(current => ({...current, rule: next}));
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
                    slid={slid}
                    draggable={draggableColumns}
                    onLift={column => columnLift(column, () => order, () => standing, grabbedColumn(column))}
                    onOrdered={(column, to, marks) => {
                        setSlid(marks);
                        commit(orderedTo(order.indexOf(column), to));
                    }}
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
                    slid={slid}
                    shifted={shifted}
                    onLift={row => rowLift(() => order, () => standing, grabbedRow(row))}
                    onArranged={(to, drops) => {
                        setShifted(drops);
                        commit(current => nudgedTo(row, to)(baked(current)));
                    }}/>
            )}</tbody>
        </table>
        <MoveReport landed={state.landed}/>
        <Aloft columnsTravel={columnsTravel} rowsTravel={rowsTravel}
               ordered={ordered} rows={rows} standing={standing}/>
    </>;
};
