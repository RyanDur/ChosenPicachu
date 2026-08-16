import {maybe} from '@ryandur/sand';
import {columnUnder, rowUnder} from '@components/DragSortableTable/survey';
import {eagerTravel, lazyTravel} from '@components/DragSortableTable/travel';
import {Cell, columnAloft, columnLanding, landedColumn, landedRow, rowAloft, rowLanding} from './table-state';

export type FlightAnswers<C extends Cell> = {
  travel: (cell: C, moving: {clientX: number; clientY: number}) => void;
  land?: (cell: C) => void;
};

type SettleColumn<C extends Cell> = (cell: C, held: string, struck: string) => void;
type SettleRow<C extends Cell> = (cell: C, held: number, struck: number) => void;

export const eagerColumnFlight = <C extends Cell>(settle: SettleColumn<C>): FlightAnswers<C> => ({
  travel: (cell, moving) => {
    const {order} = cell.state();
    columnAloft(cell.state()).and(maybe(cell.state().bounds)).map(([held, measured]) =>
      eagerTravel(columnUnder(order, measured), struck =>
        settle(cell, held, struck))(held, moving));
  }
});

export const eagerRowFlight = <C extends Cell>(settle: SettleRow<C>): FlightAnswers<C> => ({
  travel: (cell, moving) => {
    const {seated: standing} = cell.state();
    rowAloft(cell.state()).and(maybe(cell.state().bounds)).map(([held, measured]) =>
      eagerTravel(rowUnder(standing, measured), struck =>
        settle(cell, held, struck))(held, moving));
  }
});

export const lazyColumnFlight = <C extends Cell>(settle: SettleColumn<C>): FlightAnswers<C> => ({
  travel: (cell, moving) => {
    const {order} = cell.state();
    const landing = landedColumn(cell.state());
    columnAloft(cell.state()).and(maybe(cell.state().bounds)).map(([held, measured]) =>
      cell.commit(columnLanding(
        lazyTravel(columnUnder(order, measured))(held, moving, landing.orElse(undefined)))));
  },
  land: cell => {
    columnAloft(cell.state()).and(landedColumn(cell.state())).map(([held, struck]) =>
      settle(cell, held, struck));
  }
});

export const lazyRowFlight = <C extends Cell>(settle: SettleRow<C>): FlightAnswers<C> => ({
  travel: (cell, moving) => {
    const {seated: standing} = cell.state();
    const landing = landedRow(cell.state());
    rowAloft(cell.state()).and(maybe(cell.state().bounds)).map(([held, measured]) =>
      cell.commit(rowLanding(
        lazyTravel(rowUnder(standing, measured))(held, moving, landing.orElse(undefined)))));
  },
  land: cell => {
    rowAloft(cell.state()).and(landedRow(cell.state())).map(([held, struck]) =>
      settle(cell, held, struck));
  }
});
