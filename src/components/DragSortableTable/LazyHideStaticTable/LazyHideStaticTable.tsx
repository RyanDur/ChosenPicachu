import {FC, Fragment} from 'react';
import {has, maybe} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {Kit, TableProps, dealt} from '@components/Table';
import {interior} from '../survey';
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
import {Seat, Table} from '../context';
import '../sortable.css';
import './LazyHideStaticTable.css';

const kit: Kit = {Column, DraggableColumn, Row, DraggableRow, Cell: TableCell, SortMenu, ResizeHandle};

export const LazyHideStaticTable: FC<TableProps> = (
    {children, id}
) => {
    const {columns, rows, gripped, columnElements, rowElements} = dealt(children, kit);
    const [state, commit] = useTableState(columns.map(({column}) => column), rows);
    const cell: Cell = {state: () => state, commit};
    const {order} = state;
    const standing = standingOf(rows, state);
    const ordered = order.flatMap(name => {
        const definition = columns.find(({column}) => column === name);
        return has(definition) ? [definition] : [];
    });
    const clipped = columns.some(({resizable}) => resizable);

    const settleColumn = (held: string, struck: string): void =>
        commit(orderedTo(order.indexOf(held), interior(order.indexOf(struck), order.length)));

    const settleRow = (held: number, struck: number): void =>
        commit(seatedTo(held, struck));

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
        <table id={id}
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
    </Table.Provider>;
};
