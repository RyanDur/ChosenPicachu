import {FC, Fragment, useSyncExternalStore} from 'react';
import {has, maybe} from '@ryandur/sand';

import {classNames} from '@components/class-names';
import {Kit, TableProps, dealt} from '@components/Table';
import {interior} from '../survey';
import {grounded, surfaceTravel} from '../travel';
import {lazyColumnFlight, lazyRowFlight} from '../flights';
import {TableStore, columnAloft, drifting as drifts, dropped, orderedTo, rowAloft, seatedTo, standingOf, dealtIn} from '../table-state';
import {useTableStore} from '../useTableStore';
import {Aloft} from '../Aloft';
import {MoveReport} from '../MoveReport';
import {Column} from '../elements/Column';
import {DraggableColumn} from '../elements/DraggableColumn';
import {Row} from '../elements/Row';
import {DraggableRow} from '../elements/DraggableRow';
import {Cell as TableCell} from '../elements/Cell';
import {SortMenu} from '../SortMenu';
import {ResizeHandle} from '@components/Table/ResizeHandle';
import {Seat, Table, Transition} from '../context';
import {glide} from '@components/glide';
import '../sortable.css';
import './LazyHideAnimatedTable.css';

const kit: Kit = {Column, DraggableColumn, Row, DraggableRow, Cell: TableCell, SortMenu, ResizeHandle};

export const LazyHideAnimatedTable: FC<TableProps> = (
    {children, id}
) => {
    const {columns, rows, gripped, columnElements, rowElements} = dealt(children, kit);
    const store = useTableStore(columns.map(({column}) => column), rows);
    const state = dealtIn(rows.length)(useSyncExternalStore(store.subscribe, store.state));
    const settle = (transition: Transition): void => glide(true)(() => store.commit(transition));

    const {order} = state;
    const standing = standingOf(rows, state);
    const ordered = order.flatMap(name => {
        const definition = columns.find(({column}) => column === name);
        return has(definition) ? [definition] : [];
    });
    const clipped = columns.some(({resizable}) => resizable);

    const settleColumn = (held: string, struck: string): void =>
        settle(orderedTo(order.indexOf(held), interior(order.indexOf(struck), order.length)));

    const settleRow = (held: number, struck: number): void =>
        settle(seatedTo(held, struck));

    const drop = (): void => store.commit(dropped);

    const drifting = (moving: {clientX: number; clientY: number}): void =>
        store.commit(drifts(moving));

    const columnFlight = lazyColumnFlight<TableStore>((_store, held, struck) => settleColumn(held, struck));
    const rowFlight = lazyRowFlight<TableStore>((_store, held, struck) => settleRow(held, struck));
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
        surface: surface(moving => columnFlight.travel(store, moving), () => maybe(columnFlight.land).map(land => land(store)))
    };
    const rowsTravel = {
        aloft: rowAloft(state),
        survey: maybe(state.bounds),
        flight: state.flight ?? grounded,
        drift: state.drift,
        surface: surface(moving => rowFlight.travel(store, moving), () => maybe(rowFlight.land).map(land => land(store)))
    };

    return <Table.Provider value={{store, rows, standing, clipped, settle}}>
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
