import {maybe} from '@ryandur/sand';
import {columnUnder, interior, rowUnder} from '@components/DragSortableTable/survey';
import {Grab, staticColumnArrows, staticRowArrows, columnLift, rowLift, eagerTravel} from '@components/DragSortableTable/travel';
import {baked, columnAloft, columnOf, hideColumn, hideRow, lifted, nudgedTo, orderedTo, rowAloft, seatedTo, Shell, stand, unhideColumn, unhideRow} from '../shell';

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

const columnLand = (shell: Shell): void => {
  columnAloft(shell.desk()).map(held => {
    unhideColumn(shell, held);
  });
};

const rowTravel = (shell: Shell, moving: {clientX: number; clientY: number}): void => {
  const {seated: standing} = shell.desk();
  const aloft = rowAloft(shell.desk());
  const bounds = maybe(shell.desk().bounds);
  aloft.and(bounds).map(([held, measured]) =>
    eagerTravel(rowUnder(standing, measured), struck =>
      settleRow(shell, held, struck))(held, moving));
};

const rowLand = (shell: Shell): void => {
  rowAloft(shell.desk()).map(held => {
    unhideRow(shell, held);
  });
};

const wireColumnGrip = (shell: Shell, th: HTMLTableCellElement): void => {
  const held = columnOf(shell.desk(), th);

  const ordered = ({from, to}: {from: number; to: number}): void =>
    shell.commit(orderedTo(from, to));

  const grabbed = (grab: Grab): void => {
    hideColumn(shell, held);
    shell.commit(lifted({axis: 'column', held}, grab));
  };

  th.addEventListener('pointerdown', columnLift(held, () => shell.desk().order, () => shell.desk().seated, grabbed));
  th.addEventListener('keydown', staticColumnArrows(held, () => shell.desk().order, ordered));
};

const wireRowGrip = (shell: Shell, held: number, grip: HTMLButtonElement): void => {
  const arranged = ({to}: {to: number; after: number[]}): void =>
    shell.commit(desk => nudgedTo(held, to)(baked(desk)));

  const grabbed = (grab: Grab): void => {
    hideRow(shell, held);
    shell.commit(desk => lifted({axis: 'row', held}, grab)(baked(desk)));
  };

  grip.addEventListener('pointerdown', rowLift(() => shell.desk().order, () => shell.desk().seated, grabbed));
  grip.addEventListener('keydown', staticRowArrows(held, () => shell.desk().seated, arranged));
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
    }
  });
