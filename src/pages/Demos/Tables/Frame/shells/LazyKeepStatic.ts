import {maybe} from '@ryandur/sand';
import {columnUnder, interior, rowUnder} from '@components/DragSortableTable/survey';
import {staticColumnArrows, staticRowArrows, lazyTravel} from '@components/DragSortableTable/travel';
import {baked, columnAloft, columnLanding, landedColumn, landedRow, nudgedTo, orderedTo, rowAloft, rowLanding, seatedTo, Shell, stand} from '../shell';

const settleColumn = (shell: Shell, held: string, struck: string): void => {
  const {order} = shell.desk();
  shell.commit(orderedTo(order.indexOf(held), interior(order.indexOf(struck), order.length)));
};

const settleRow = (shell: Shell, held: number, struck: number): void => {
  shell.commit(seatedTo(held, struck));
};

const columnTravel = (shell: Shell, moving: {clientX: number; clientY: number}): void => {
  const {order} = shell.desk();
  const aloft = columnAloft(shell.desk());
  const bounds = maybe(shell.desk().bounds);
  const landing = landedColumn(shell.desk());
  aloft.and(bounds).map(([held, measured]) =>
    shell.commit(columnLanding(
      lazyTravel(columnUnder(order, measured))(held, moving, landing.orElse(undefined)))));
};

const columnLand = (shell: Shell): void => {
  columnAloft(shell.desk()).map(held => {
    landedColumn(shell.desk()).map(struck => settleColumn(shell, held, struck));
  });
};

const rowTravel = (shell: Shell, moving: {clientX: number; clientY: number}): void => {
  const {seated: standing} = shell.desk();
  const aloft = rowAloft(shell.desk());
  const bounds = maybe(shell.desk().bounds);
  const landing = landedRow(shell.desk());
  aloft.and(bounds).map(([held, measured]) =>
    shell.commit(rowLanding(
      lazyTravel(rowUnder(standing, measured))(held, moving, landing.orElse(undefined)))));
};

const rowLand = (shell: Shell): void => {
  rowAloft(shell.desk()).map(held => {
    landedRow(shell.desk()).map(struck => settleRow(shell, held, struck));
  });
};

const ordered = (shell: Shell) => ({from, to}: {from: number; to: number}): void =>
  shell.commit(orderedTo(from, to));

const arranged = (shell: Shell, held: number) => ({to}: {to: number; after: number[]}): void =>
  shell.commit(desk => nudgedTo(held, to)(baked(desk)));

export const wire = (document: Document): void =>
  stand(document, {
    flights: {
      column: {travel: columnTravel, land: columnLand},
      row: {travel: rowTravel, land: rowLand}
    },
    arrows: {
      column: (shell, held) => staticColumnArrows(held, () => shell.desk().order, ordered(shell)),
      row: (shell, held) => staticRowArrows(held, () => shell.desk().seated, arranged(shell, held))
    },
  });
