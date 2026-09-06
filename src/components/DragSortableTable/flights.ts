import {maybe} from '@ryandur/sand';
import {columnUnder, rowUnder} from '@components/DragSortableTable/survey';
import {eagerTravel, lazyTravel} from '@components/DragSortableTable/travel';
import {TableState, Transition, columnAloft, columnLanding, landedColumn, landedRow, rowAloft, rowLanding} from './table-state';

export type Asked = {
  state: () => TableState;
  standing: () => readonly number[];
  dispatch: (transition: Transition) => void;
};

export type FlightAnswers<S extends Asked> = {
  travel: (asked: S, moving: {clientX: number; clientY: number}) => void;
  land: (asked: S) => void;
};

type SettleColumn<S extends Asked> = (asked: S, held: string, struck: string) => void;
type SettleRow<S extends Asked> = (asked: S, held: number, struck: number) => void;

export const eagerColumnFlight = <S extends Asked>(settle: SettleColumn<S>): FlightAnswers<S> => ({
  travel: (asked, moving) => {
    const {order} = asked.state();
    columnAloft(asked.state()).and(maybe(asked.state().bounds)).map(([held, measured]) =>
      eagerTravel(columnUnder(order, measured), struck =>
        settle(asked, held, struck))(held, moving));
  },
  land: () => undefined
});

export const eagerRowFlight = <S extends Asked>(settle: SettleRow<S>): FlightAnswers<S> => ({
  travel: (asked, moving) => {
    const standing = asked.standing();
    rowAloft(asked.state()).and(maybe(asked.state().bounds)).map(([held, measured]) =>
      eagerTravel(rowUnder(standing, measured), struck =>
        settle(asked, held, struck))(held, moving));
  },
  land: () => undefined
});

export const lazyColumnFlight = <S extends Asked>(settle: SettleColumn<S>): FlightAnswers<S> => ({
  travel: (asked, moving) => {
    const {order} = asked.state();
    const landing = landedColumn(asked.state());
    columnAloft(asked.state()).and(maybe(asked.state().bounds)).map(([held, measured]) =>
      asked.dispatch(columnLanding(
        lazyTravel(columnUnder(order, measured))(held, moving, landing.orElse(undefined)))));
  },
  land: asked => {
    columnAloft(asked.state()).and(landedColumn(asked.state())).map(([held, struck]) =>
      settle(asked, held, struck));
  }
});

export const lazyRowFlight = <S extends Asked>(settle: SettleRow<S>): FlightAnswers<S> => ({
  travel: (asked, moving) => {
    const standing = asked.standing();
    const landing = landedRow(asked.state());
    rowAloft(asked.state()).and(maybe(asked.state().bounds)).map(([held, measured]) =>
      asked.dispatch(rowLanding(
        lazyTravel(rowUnder(standing, measured))(held, moving, landing.orElse(undefined)))));
  },
  land: asked => {
    rowAloft(asked.state()).and(landedRow(asked.state())).map(([held, struck]) =>
      settle(asked, held, struck));
  }
});
