import {FC} from 'react';
import {has, maybe} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {TableProps, measuredShares} from '@components/Table';
import {columnUnder, interior, rowUnder} from '../survey';
import {columnLift, eagerTravel, Grab, grounded, rowLift, surfaceTravel} from '../travel';
import {baked, columnAloft, drifting as drifts, dropped, lifted, orderedTo, rowAloft, seatedTo, sharedAs, standingOf} from '../table-state';
import {useTableState} from '../useTableState';
import {Aloft} from '../Aloft';
import {Direction} from '../sorting';
import {Header} from './Header';
import {Row} from './Row';
import '../sortable.css';

export type EagerKeepStaticTableProps = TableProps & {
    draggableColumns?: boolean;
    draggableRows?: boolean;
    sortable?: boolean;
};

export const EagerKeepStaticTable: FC<EagerKeepStaticTableProps> = (
    {columns, rows, draggableColumns = false, draggableRows = false, resizableColumns = false, sortable, id, ...dress}
) => {
    const [state, commit] = useTableState(columns.map(({column}) => column), rows);
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

    const columnTravel = (moving: {clientX: number; clientY: number}): void => {
        columnAloft(state).and(maybe(state.bounds)).map(([held, measured]) =>
            eagerTravel(columnUnder(order, measured), struck =>
                settleColumn(held, struck))(held, moving));
    };

    const rowTravel = (moving: {clientX: number; clientY: number}): void => {
        rowAloft(state).and(maybe(state.bounds)).map(([held, measured]) =>
            eagerTravel(rowUnder(standing, measured), struck =>
                settleRow(held, struck))(held, moving));
    };

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
        surface: surface(columnTravel)
    };
    const rowsTravel = {
        aloft: rowAloft(state),
        survey: maybe(state.bounds),
        flight: state.flight ?? grounded,
        drift: state.drift,
        surface: surface(rowTravel)
    };

    const ruled = (
        column: string,
        direction: Direction | undefined
    ): void =>
        commit(current => ({...current, rule: has(direction) ? {column, direction} : undefined}));

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
                    draggable={draggableColumns}
                    className={headerClassName}
                    onLift={column => columnLift(column, () => order, () => standing, grabbedColumn(column))}
                    onOrdered={(column, to) =>
                        commit(orderedTo(order.indexOf(column), to))}
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
                    className={rowClassName}
                    cellClassName={cellClassName}
                    onLift={row => rowLift(() => order, () => standing, grabbedRow(row))}
                    onArranged={after =>
                        commit(current => ({...baked(current), seats: after}))}/>
            )}</tbody>
        </table>
        <Aloft columnsTravel={columnsTravel} rowsTravel={rowsTravel}
               ordered={ordered} rows={rows} standing={standing} dress={dress}/>
    </>;
};
