import {FC, MouseEvent, useState} from 'react';
import {has, maybe} from '@ryandur/sand';
import {array} from '@components/arrays';
import {classNames} from '@components/class-names';
import {TableProps, measuredShares} from '@components/Table';
import {Bounds, columnUnder, displaced, interior, rowUnder, Shifted, shifts, Slid, Survey, surveyed} from '../survey';
import {columnLift, eagerTravel, Grab, grounded, rowLift, surfaceTravel} from '../travel';
import {baked, columnAloft, drifting as drifts, dropped, lifted, orderedTo, rowAloft, seatedTo, sharedAs, standingOf} from '../desk';
import {useDesk} from '../useDesk';
import {Aloft} from '../Aloft';
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
    {columns, rows, draggableColumns = false, draggableRows = false, resizableColumns = false, sortable, id, ...dress}
) => {
    const [desk, commit] = useDesk(columns.map(({column}) => column), rows);
    const [slid, setSlid] = useState<Slid>();
    const [shifted, setShifted] = useState<Shifted>();

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

    const settleColumn = (held: string, struck: string, measured: Bounds): void => {
        setSlid(displaced(order, held, struck, measured));
        commit(orderedTo(order.indexOf(held), interior(order.indexOf(struck), order.length)));
    };

    const settleRow = (held: number, struck: number, measured: Survey): void => {
        const after = array.moveToIndex(desk.seats.indexOf(struck), held, desk.seats);
        setShifted(shifts(measured.rowHeights, desk.seats, after, held));
        commit(seatedTo(held, struck));
    };

    const grabbedColumn = (column: string) => (grab: Grab): void =>
        commit(lifted({axis: 'column', held: column}, grab));

    const grabbedRow = (row: number) => (grab: Grab): void =>
        commit(current => lifted({axis: 'row', held: row}, grab)(baked(current)));

    const drop = (): void => commit(dropped);

    const drifting = (moving: {clientX: number; clientY: number}): void =>
        commit(drifts(moving));

    const columnTravel = (moving: {clientX: number; clientY: number}): void => {
        columnAloft(desk).and(maybe(desk.bounds)).map(([held, measured]) =>
            eagerTravel(columnUnder(order, measured), struck =>
                settleColumn(held, struck, measured))(held, moving));
    };

    const rowTravel = (moving: {clientX: number; clientY: number}): void => {
        rowAloft(desk).and(maybe(desk.bounds)).map(([held, measured]) =>
            eagerTravel(rowUnder(standing, measured), struck =>
                settleRow(held, struck, measured))(held, moving));
    };

    const surface = (travel: (moving: {clientX: number; clientY: number}) => void) => ({
        onPointerMove: surfaceTravel(drifting, travel, drop),
        onPointerUp: drop,
        onPointerCancel: drop,
        onLostPointerCapture: drop
    });

    const columnsTravel = {
        aloft: columnAloft(desk),
        survey: maybe(desk.bounds),
        flight: desk.flight ?? grounded,
        drift: desk.drift,
        surface: surface(columnTravel)
    };
    const rowsTravel = {
        aloft: rowAloft(desk),
        survey: maybe(desk.bounds),
        flight: desk.flight ?? grounded,
        drift: desk.drift,
        surface: surface(rowTravel)
    };

    const ruled = (
        column: string,
        direction: Direction | undefined,
        event: MouseEvent<HTMLButtonElement>
    ): void => {
        const next = has(direction) ? {column, direction} : undefined;
        const table = event.currentTarget.closest('table');
        if (has(table)) {
            const after = has(next) ? ranked(rows, desk.seats, next) : desk.seats;
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
