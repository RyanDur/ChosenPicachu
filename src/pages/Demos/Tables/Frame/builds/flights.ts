import {maybe} from '@ryandur/sand';
import {columnUnder, rowUnder} from '@components/DragSortableTable/survey';
import {eagerTravel, lazyTravel} from '@components/DragSortableTable/travel';
import {FlightAnswers, MountedTable, columnAloft, columnLanding, landedColumn, landedRow, rowAloft, rowLanding} from '../table';

type SettleColumn = (mounted: MountedTable, held: string, struck: string) => void;
type SettleRow = (mounted: MountedTable, held: number, struck: number) => void;

export const eagerColumnFlight = (settle: SettleColumn): FlightAnswers => ({
  travel: (mounted, moving) => {
    const {order} = mounted.state();
    columnAloft(mounted.state()).and(maybe(mounted.state().bounds)).map(([held, measured]) =>
      eagerTravel(columnUnder(order, measured), struck =>
        settle(mounted, held, struck))(held, moving));
  }
});

export const eagerRowFlight = (settle: SettleRow): FlightAnswers => ({
  travel: (mounted, moving) => {
    const {seated: standing} = mounted.state();
    rowAloft(mounted.state()).and(maybe(mounted.state().bounds)).map(([held, measured]) =>
      eagerTravel(rowUnder(standing, measured), struck =>
        settle(mounted, held, struck))(held, moving));
  }
});

export const lazyColumnFlight = (settle: SettleColumn): FlightAnswers => ({
  travel: (mounted, moving) => {
    const {order} = mounted.state();
    const landing = landedColumn(mounted.state());
    columnAloft(mounted.state()).and(maybe(mounted.state().bounds)).map(([held, measured]) =>
      mounted.commit(columnLanding(
        lazyTravel(columnUnder(order, measured))(held, moving, landing.orElse(undefined)))));
  },
  land: mounted => {
    columnAloft(mounted.state()).and(landedColumn(mounted.state())).map(([held, struck]) =>
      settle(mounted, held, struck));
  }
});

export const lazyRowFlight = (settle: SettleRow): FlightAnswers => ({
  travel: (mounted, moving) => {
    const {seated: standing} = mounted.state();
    const landing = landedRow(mounted.state());
    rowAloft(mounted.state()).and(maybe(mounted.state().bounds)).map(([held, measured]) =>
      mounted.commit(rowLanding(
        lazyTravel(rowUnder(standing, measured))(held, moving, landing.orElse(undefined)))));
  },
  land: mounted => {
    rowAloft(mounted.state()).and(landedRow(mounted.state())).map(([held, struck]) =>
      settle(mounted, held, struck));
  }
});
