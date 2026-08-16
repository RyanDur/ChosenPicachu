import {has, maybe} from '@ryandur/sand';
import {ColumnNudge, columnUnder, displaced, interior, RowNudge, rowUnder, shifts} from '@components/DragSortableTable/survey';
import {animatedColumnArrows, animatedRowArrows, eagerTravel} from '@components/DragSortableTable/travel';
import {baked, columnAloft, markColumns, markRows, nudgedTo, orderedTo, rowAloft, seatedTo, Shell, stand} from '../shell';

const settleColumn = (shell: Shell, held: string, struck: string): void => {
  const {order, bounds} = shell.desk();
  if (!has(bounds)) {
    return;
  }
  const marks = displaced(order, held, struck, bounds);
  shell.commit(orderedTo(order.indexOf(held), interior(order.indexOf(struck), order.length)));
  markColumns(shell, marks);
};

const settleRow = (shell: Shell, held: number, struck: number): void => {
  const {bounds, seated} = shell.desk();
  if (!has(bounds)) {
    return;
  }
  shell.commit(seatedTo(held, struck));
  markRows(shell, shifts(bounds.rowHeights, seated, shell.desk().seated, held));
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

const ordered = (shell: Shell) => (nudge: ColumnNudge): void => {
  shell.commit(orderedTo(nudge.from, nudge.to));
  markColumns(shell, nudge.marks);
};

const arranged = (shell: Shell, held: number) => (nudge: RowNudge): void => {
  shell.commit(desk => nudgedTo(held, nudge.to)(baked(desk)));
  markRows(shell, nudge.drops);
};

export const wire = (document: Document): void =>
  stand(document, {
    flights: {
      column: {travel: columnTravel, land: columnLand},
      row: {travel: rowTravel, land: rowLand}
    },
    arrows: {
      column: (shell, held) => animatedColumnArrows(held, () => shell.desk().order, ordered(shell)),
      row: (shell, held) => animatedRowArrows(held, () => shell.desk().order, () => shell.desk().seated, arranged(shell, held))
    },
    ruled: (shell, heights, before, after) => markRows(shell, shifts(heights, before, after))
  });
