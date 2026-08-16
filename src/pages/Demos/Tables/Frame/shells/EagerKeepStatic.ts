import {maybe} from '@ryandur/sand';
import {columnUnder, interior, rowUnder} from '@components/DragSortableTable/survey';
import {staticColumnArrows, staticRowArrows, eagerTravel} from '@components/DragSortableTable/travel';
import {baked, columnAloft, nudgedTo, orderedTo, rowAloft, seatedTo, Shell, stand} from '../shell';

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
  aloft.and(bounds).map(([held, measured]) =>
    eagerTravel(columnUnder(order, measured), struck =>
      settleColumn(shell, held, struck))(held, moving));
};

const columnLand = (): void => undefined;

const rowTravel = (shell: Shell, moving: {clientX: number; clientY: number}): void => {
  const {seated: standing} = shell.desk();
  const aloft = rowAloft(shell.desk());
  const bounds = maybe(shell.desk().bounds);
  aloft.and(bounds).map(([held, measured]) =>
    eagerTravel(rowUnder(standing, measured), struck =>
      settleRow(shell, held, struck))(held, moving));
};

const rowLand = (): void => undefined;

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
