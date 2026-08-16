import {FC, MouseEvent, useState} from 'react';
import {has, maybe} from '@ryandur/sand';
import {array} from '@components/arrays';
import {classNames} from '@components/class-names';
import {TableProps, measuredShares} from '@components/Table';
import {displaced, interior, Shifted, shifts, Slid, surveyed} from '../survey';
import {columnLift, Grab, grounded, rowLift, surfaceTravel} from '../travel';
import {eagerColumnFlight, eagerRowFlight} from '../flights';
import {baked, Cell, columnAloft, drifting as drifts, dropped, lifted, orderedTo, rowAloft, seatedTo, sharedAs, standingOf} from '../table-state';
import {useTableState} from '../useTableState';
import {Aloft} from '../Aloft';
import {Direction, ranked} from '../sorting';
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
    const [state, commit] = useTableState(columns.map(({column}) => column), rows);
    const cell: Cell = {state: () => state, commit};
    const [slid, setSlid] = useState<Slid>();
    const [shifted, setShifted] = useState<Shifted>();

    const {order, shares, rule} = state;
    const grown = state.seats.length === rows.length
        ? state
        : {...state, seats: rows.map((_, row) => row)};
    const standing = standingOf(rows, grown);
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
                    onLift={column => columnLift(column, () => order, () => standing, grabbedColumn(column))}
                    onOrdered={(column, to, marks) => {
                        setSlid(marks);
                        commit(orderedTo(order.indexOf(column), to));
                    }}
                    onShared={update => commit(current => {
                        const next = update(current.shares);
                        return has(next) ? sharedAs(next)(current) : current;
                    })}
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
                    slid={slid}
                    shifted={shifted}
                    className={rowClassName}
                    cellClassName={cellClassName}
                    onLift={row => rowLift(() => order, () => standing, grabbedRow(row))}
                    onArranged={(after, drops) => {
                        setShifted(drops);
                        commit(current => ({...baked(current), seats: after}));
                    }}/>
            )}</tbody>
        </table>
        <Aloft columnsTravel={columnsTravel} rowsTravel={rowsTravel}
               ordered={ordered} rows={rows} standing={standing} dress={dress}/>
    </>;
};
