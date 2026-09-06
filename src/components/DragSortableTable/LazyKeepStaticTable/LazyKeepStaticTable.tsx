import {FC, PropsWithChildren, useEffect, useState} from 'react';
import {has, maybe} from '@ryandur/sand';
import {Shown, useStore, useValues} from '../context';
import {Asked, lazyColumnFlight, lazyRowFlight} from '../flights';
import {interior} from '../survey';
import {columnAloft, dealtIn, drifting as drifts, dropped, orderedTo, rowAloft, seatedTo, standingOf} from '../table-state';
import {grounded, surfaceTravel} from '../travel';
import {ColumnGhost, RowGhost} from '../ghosts';
import {MoveReport} from '../MoveReport';
import '../sortable.css';

export const LazyKeepStaticTable: FC<PropsWithChildren> = ({children}) => {
  const store = useStore();
  const values = useValues();
  const [shown, setShown] = useState(store.state());
  useEffect(() => {
    setShown(store.state());
    return store.subscribe(() => setShown(store.state()));
  }, [store]);

  const state = dealtIn(values.length)(shown);
  const standing = standingOf(values, state);
  const {dispatch} = store;
  const asked: Asked = {state: () => state, standing: () => standing, dispatch};
  const {order, aloft, drift, faces} = state;
  const survey = maybe(state.bounds);
  const box = state.flight ?? grounded;

  const settleColumn = (held: string, struck: string): void =>
    dispatch(current =>
      orderedTo(current.order.indexOf(held), interior(current.order.indexOf(struck), current.order.length))(current));
  const settleRow = (held: number, struck: number): void =>
    dispatch(seatedTo(held, struck));
  const columnFlight = lazyColumnFlight<Asked>((_asked, held, struck) => settleColumn(held, struck));
  const rowFlight = lazyRowFlight<Asked>((_asked, held, struck) => settleRow(held, struck));
  const flight = columnAloft({aloft}).either(() => columnFlight, () => rowFlight);

  const drop = (): void => dispatch(dropped);
  const drifting = (moving: {clientX: number; clientY: number}): void => dispatch(drifts(moving));
  const landed = (): void => {
    flight.land(asked);
    drop();
  };

  const widths: Readonly<Record<string, number | undefined>> = survey.map(measured => {
    const spanned = order.reduce((sum, column) => sum + (measured.columnWidths[column] ?? 0), 0) || 1;
    return Object.fromEntries(order.map(column => [column, (measured.columnWidths[column] ?? 0) / spanned * 100]));
  }).orElse({});
  const heights = survey.map(measured => standing.map(row => measured.rowHeights[row])).orElse([]);
  const cells = faces?.cells ?? [];

  return <Shown.Provider value={{state, standing}}>
    {children}
    <MoveReport/>
    {columnAloft({aloft}).either(() =>
      <ColumnGhost at={box} drift={drift} heading={faces?.heading} cells={cells} heights={heights}/>, () => null)}
    {rowAloft({aloft}).either(() =>
      <RowGhost at={box} drift={drift} order={order} widths={widths} cells={cells}/>, () => null)}
    {has(aloft) &&
      <article className="drag-surface"
               onPointerMove={surfaceTravel(drifting, moving => flight.travel(asked, moving), landed)}
               onPointerUp={landed}
               onPointerCancel={landed}
               onLostPointerCapture={landed}/>}
  </Shown.Provider>;
};
