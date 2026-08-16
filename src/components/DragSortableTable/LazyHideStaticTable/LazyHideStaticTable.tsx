import {FC} from 'react';
import {has, maybe} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {TableProps, measuredShares} from '@components/Table';
import {columnUnder, interior, rowUnder} from '../survey';
import {columnLift, Grab, grounded, lazyTravel, rowLift, surfaceTravel} from '../travel';
import {baked, columnAloft, columnLanding, drifting as drifts, dropped, landedColumn, landedRow, lifted, orderedTo, rowAloft, rowLanding, seatedTo, sharedAs, standingOf} from '../desk';
import {useDesk} from '../useDesk';
import {Aloft} from '../Aloft';
import {Direction} from '../sorting';
import {Header} from './Header';
import {Row} from './Row';
import '../sortable.css';
import './LazyHideStaticTable.css';

export type LazyHideStaticTableProps = TableProps & {
    draggableColumns?: boolean;
    draggableRows?: boolean;
    sortable?: boolean;
};

export const LazyHideStaticTable: FC<LazyHideStaticTableProps> = (
    {columns, rows, draggableColumns = false, draggableRows = false, resizableColumns = false, sortable, id, ...dress}
) => {
    const [desk, commit] = useDesk(columns.map(({column}) => column), rows);
    const {order, shares, rule} = desk;
    const grown = desk.seats.length === rows.length
        ? desk
        : {...desk, seats: rows.map((_, row) => row)};
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
        columnAloft(desk).and(maybe(desk.bounds)).map(([held, measured]) =>
            commit(columnLanding(
                lazyTravel(columnUnder(order, measured))(held, moving, landedColumn(desk).orElse(undefined)))));
    };

    const rowTravel = (moving: {clientX: number; clientY: number}): void => {
        rowAloft(desk).and(maybe(desk.bounds)).map(([held, measured]) =>
            commit(rowLanding(
                lazyTravel(rowUnder(standing, measured))(held, moving, landedRow(desk).orElse(undefined)))));
    };

    const columnLand = (): void => {
        columnAloft(desk).and(landedColumn(desk)).map(([held, struck]) =>
            settleColumn(held, struck));
    };

    const rowLand = (): void => {
        rowAloft(desk).and(landedRow(desk)).map(([held, struck]) =>
            settleRow(held, struck));
    };

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
        aloft: columnAloft(desk),
        survey: maybe(desk.bounds),
        flight: desk.flight ?? grounded,
        drift: desk.drift,
        surface: surface(columnTravel, columnLand)
    };
    const rowsTravel = {
        aloft: rowAloft(desk),
        survey: maybe(desk.bounds),
        flight: desk.flight ?? grounded,
        drift: desk.drift,
        surface: surface(rowTravel, rowLand)
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
                    aloft={columnsTravel.aloft}
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
                    aloft={rowsTravel.aloft}
                    aloftColumn={columnsTravel.aloft}
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
