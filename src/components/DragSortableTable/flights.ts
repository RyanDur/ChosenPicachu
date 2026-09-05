import {maybe} from '@ryandur/sand';
import {columnUnder, rowUnder} from '@components/DragSortableTable/survey';
import {eagerTravel, lazyTravel} from '@components/DragSortableTable/travel';
import {TableStore, columnAloft, columnLanding, landedColumn, landedRow, rowAloft, rowLanding} from './table-state';

export type FlightAnswers<S extends TableStore> = {
  travel: (store: S, moving: {clientX: number; clientY: number}) => void;
  land?: (store: S) => void;
};

type SettleColumn<S extends TableStore> = (store: S, held: string, struck: string) => void;
type SettleRow<S extends TableStore> = (store: S, held: number, struck: number) => void;

export const eagerColumnFlight = <S extends TableStore>(settle: SettleColumn<S>): FlightAnswers<S> => ({
  travel: (store, moving) => {
    const {order} = store.state();
    columnAloft(store.state()).and(maybe(store.state().bounds)).map(([held, measured]) =>
      eagerTravel(columnUnder(order, measured), struck =>
        settle(store, held, struck))(held, moving));
  }
});

export const eagerRowFlight = <S extends TableStore>(settle: SettleRow<S>): FlightAnswers<S> => ({
  travel: (store, moving) => {
    const {seated: standing} = store.state();
    rowAloft(store.state()).and(maybe(store.state().bounds)).map(([held, measured]) =>
      eagerTravel(rowUnder(standing, measured), struck =>
        settle(store, held, struck))(held, moving));
  }
});

export const lazyColumnFlight = <S extends TableStore>(settle: SettleColumn<S>): FlightAnswers<S> => ({
  travel: (store, moving) => {
    const {order} = store.state();
    const landing = landedColumn(store.state());
    columnAloft(store.state()).and(maybe(store.state().bounds)).map(([held, measured]) =>
      store.commit(columnLanding(
        lazyTravel(columnUnder(order, measured))(held, moving, landing.orElse(undefined)))));
  },
  land: store => {
    columnAloft(store.state()).and(landedColumn(store.state())).map(([held, struck]) =>
      settle(store, held, struck));
  }
});

export const lazyRowFlight = <S extends TableStore>(settle: SettleRow<S>): FlightAnswers<S> => ({
  travel: (store, moving) => {
    const {seated: standing} = store.state();
    const landing = landedRow(store.state());
    rowAloft(store.state()).and(maybe(store.state().bounds)).map(([held, measured]) =>
      store.commit(rowLanding(
        lazyTravel(rowUnder(standing, measured))(held, moving, landing.orElse(undefined)))));
  },
  land: store => {
    rowAloft(store.state()).and(landedRow(store.state())).map(([held, struck]) =>
      settle(store, held, struck));
  }
});
