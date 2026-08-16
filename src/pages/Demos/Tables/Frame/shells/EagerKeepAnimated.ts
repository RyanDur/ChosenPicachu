import {has, maybe} from '@ryandur/sand';
import {ColumnNudge, columnUnder, displaced, interior, RowNudge, rowUnder, shifts} from '@components/DragSortableTable/survey';
import {Grab, animatedColumnArrows, animatedRowArrows, columnLift, rowLift, eagerTravel} from '@components/DragSortableTable/travel';
import {baked, columnAloft, columnOf, lifted, markColumns, markRows, nudgedTo, orderedTo, rowAloft, seatedTo, Shell, stand} from '../shell';

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
  const {bounds, seated: standing} = shell.desk();
  if (!has(bounds)) {
    return;
  }
  shell.commit(seatedTo(held, struck));
  markRows(shell, shifts(bounds.rowHeights, standing, shell.desk().seated, held));
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

const wireColumnGrip = (shell: Shell, th: HTMLTableCellElement): void => {
  const held = columnOf(shell.desk(), th);

  const ordered = (nudge: ColumnNudge): void => {
    shell.commit(orderedTo(nudge.from, nudge.to));
    markColumns(shell, nudge.marks);
  };

  const grabbed = (grab: Grab): void => {
    shell.commit(lifted({axis: 'column', held}, grab));
  };

  th.addEventListener('pointerdown', columnLift(held, () => shell.desk().order, () => shell.desk().seated, grabbed));
  th.addEventListener('keydown', animatedColumnArrows(held, () => shell.desk().order, ordered));
};

const wireRowGrip = (shell: Shell, held: number, grip: HTMLButtonElement): void => {
  const arranged = (nudge: RowNudge): void => {
    shell.commit(desk => nudgedTo(held, nudge.to)(baked(desk)));
    markRows(shell, nudge.drops);
  };

  const grabbed = (grab: Grab): void => {
    shell.commit(desk => lifted({axis: 'row', held}, grab)(baked(desk)));
  };

  grip.addEventListener('pointerdown', rowLift(() => shell.desk().order, () => shell.desk().seated, grabbed));
  grip.addEventListener('keydown', animatedRowArrows(held, () => shell.desk().order, () => shell.desk().seated, arranged));
};

export const wire = (document: Document): void =>
  stand(document, {
    travels: shell => {
      [...shell.table.querySelectorAll('thead th')]
        .filter(th => th instanceof HTMLTableCellElement)
        .forEach(th => wireColumnGrip(shell, th));
      shell.lanes.forEach((lane, held) =>
        [...lane.querySelectorAll('button.grip')]
          .filter(grip => grip instanceof HTMLButtonElement)
          .forEach(grip => wireRowGrip(shell, held, grip)));
    },
    flights: {
      column: {travel: columnTravel, land: columnLand},
      row: {travel: rowTravel, land: rowLand}
    },
    ruled: (shell, heights, before, after) => markRows(shell, shifts(heights, before, after))
  });
