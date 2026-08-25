import {FC, Fragment, useState} from 'react';
import {has, maybe} from '@ryandur/sand';
import {array} from '@components/arrays';
import {classNames} from '@components/class-names';
import {Kit, TableProps, dealt} from '@components/Table';
import {displaced, interior, RowsMoved, shifts, ColumnsMoved} from '../survey';
import {grounded, surfaceTravel} from '../travel';
import {lazyColumnFlight, lazyRowFlight} from '../flights';
import {Cell, columnAloft, drifting as drifts, dropped, orderedTo, rowAloft, seatedTo, standingOf} from '../table-state';
import {useTableState} from '../useTableState';
import {Aloft} from '../Aloft';
import {MoveReport} from '../MoveReport';
import {Column} from './Column';
import {DraggableColumn} from './DraggableColumn';
import {Row} from './Row';
import {DraggableRow} from './DraggableRow';
import {Cell as TableCell} from './Cell';
import {SortMenu} from '../SortMenu';
import {ResizeHandle} from '@components/Table/ResizeHandle';
import {Moved, Seat, Table} from '../context';
import '../sortable.css';
import './LazyHideAnimatedTable.css';

const kit: Kit = {Column, DraggableColumn, Row, DraggableRow, Cell: TableCell, SortMenu, ResizeHandle};

export const LazyHideAnimatedTable: FC<TableProps> = (
    {children, id}
) => {
    const {columns, rows, gripped, columnElements, rowElements} = dealt(children, kit);
    const [state, commit] = useTableState(columns.map(({column}) => column), rows);
    const cell: Cell = {state: () => state, commit};
    const [columnsMoved, setColumnsMoved] = useState<ColumnsMoved>();
    const [rowsMoved, setRowsMoved] = useState<RowsMoved>();

    const {order} = state;
    const standing = standingOf(rows, state);
    const ordered = order.flatMap(name => {
        const definition = columns.find(({column}) => column === name);
        return has(definition) ? [definition] : [];
    });
    const clipped = columns.some(({resizable}) => resizable);

    const settleColumn = (held: string, struck: string): void => {
        maybe(state.bounds).map(measured => setColumnsMoved(displaced(order, held, struck, measured)));
        commit(orderedTo(order.indexOf(held), interior(order.indexOf(struck), order.length)));
    };

    const settleRow = (held: number, struck: number): void => {
        maybe(state.bounds).map(measured => {
            const after = array.moveToIndex(state.seats.indexOf(struck), held, state.seats);
            setRowsMoved(shifts(measured.rowHeights, state.seats, after, held));
        });
        commit(seatedTo(held, struck));
    };

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

    return <Table.Provider value={{state, rows, standing, clipped, commit}}>
        <Moved.Provider value={{columnsMoved, rowsMoved, columnsMove: setColumnsMoved, rowsMove: setRowsMoved}}>
        <table id={id}
               onAnimationEnd={event => {
                   if (event.animationName === 'displaced') {
                       setColumnsMoved(undefined);
                   }
                   if (event.animationName === 'shifted') {
                       setRowsMoved(undefined);
                   }
               }}
               className={classNames(
                   'fancy-table',
                   clipped && 'apportioned',
                   (columns.some(({draggable}) => draggable) || gripped.some(Boolean)) && 'sortable'
               )}>
            <thead className="header">
            <tr className="row">{order.map(name =>
                <Fragment key={name}>{columnElements[name]}</Fragment>)}</tr>
            </thead>
            <tbody className="body">{standing.map(seat =>
                <Seat.Provider key={seat} value={seat}>{rowElements[seat]}</Seat.Provider>)}</tbody>
        </table>
        <MoveReport landed={state.landed}/>
        <Aloft columnsTravel={columnsTravel} rowsTravel={rowsTravel}
               ordered={ordered} rows={rows} standing={standing}/>
        </Moved.Provider>
    </Table.Provider>;
};
