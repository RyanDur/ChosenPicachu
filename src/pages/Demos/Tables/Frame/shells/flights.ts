import {maybe} from '@ryandur/sand';
import {columnUnder, rowUnder} from '@components/DragSortableTable/survey';
import {eagerTravel, lazyTravel} from '@components/DragSortableTable/travel';
import {FlightAnswers, Shell, columnAloft, columnLanding, landedColumn, landedRow, rowAloft, rowLanding} from '../shell';

type SettleColumn = (shell: Shell, held: string, struck: string) => void;
type SettleRow = (shell: Shell, held: number, struck: number) => void;

export const eagerColumnFlight = (settle: SettleColumn): FlightAnswers => ({
  travel: (shell, moving) => {
    const {order} = shell.desk();
    columnAloft(shell.desk()).and(maybe(shell.desk().bounds)).map(([held, measured]) =>
      eagerTravel(columnUnder(order, measured), struck =>
        settle(shell, held, struck))(held, moving));
  }
});

export const eagerRowFlight = (settle: SettleRow): FlightAnswers => ({
  travel: (shell, moving) => {
    const {seated: standing} = shell.desk();
    rowAloft(shell.desk()).and(maybe(shell.desk().bounds)).map(([held, measured]) =>
      eagerTravel(rowUnder(standing, measured), struck =>
        settle(shell, held, struck))(held, moving));
  }
});

export const lazyColumnFlight = (settle: SettleColumn): FlightAnswers => ({
  travel: (shell, moving) => {
    const {order} = shell.desk();
    const landing = landedColumn(shell.desk());
    columnAloft(shell.desk()).and(maybe(shell.desk().bounds)).map(([held, measured]) =>
      shell.commit(columnLanding(
        lazyTravel(columnUnder(order, measured))(held, moving, landing.orElse(undefined)))));
  },
  land: shell => {
    columnAloft(shell.desk()).and(landedColumn(shell.desk())).map(([held, struck]) =>
      settle(shell, held, struck));
  }
});

export const lazyRowFlight = (settle: SettleRow): FlightAnswers => ({
  travel: (shell, moving) => {
    const {seated: standing} = shell.desk();
    const landing = landedRow(shell.desk());
    rowAloft(shell.desk()).and(maybe(shell.desk().bounds)).map(([held, measured]) =>
      shell.commit(rowLanding(
        lazyTravel(rowUnder(standing, measured))(held, moving, landing.orElse(undefined)))));
  },
  land: shell => {
    rowAloft(shell.desk()).and(landedRow(shell.desk())).map(([held, struck]) =>
      settle(shell, held, struck));
  }
});
