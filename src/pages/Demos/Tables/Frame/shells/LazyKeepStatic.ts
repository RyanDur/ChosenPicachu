import {has, maybe} from '@ryandur/sand';
import {columnUnder, interior, rowUnder} from '@components/DragSortableTable/survey';
import {Grab, staticColumnArrows, staticRowArrows, columnLift, rowLift, lazyTravel} from '@components/DragSortableTable/travel';
import {baked, columnLanding, columnOf, lifted, nudgedTo, orderedTo, rowLanding, seatedTo, Shell, stand} from '../shell';

const settleColumn = (shell: Shell, held: string, struck: string): void => {
  const {order} = shell.desk();
  shell.commit(orderedTo(order.indexOf(held), interior(order.indexOf(struck), order.length)));
};

const settleRow = (shell: Shell, held: number, struck: number): void => {
  shell.commit(seatedTo(held, struck));
};

const columnTravel = (shell: Shell, moving: {clientX: number; clientY: number}): void => {
  maybe(shell.desk().aloft).map(aloft => {
    const {bounds, order} = shell.desk();
    if (aloft.axis !== 'column' || !has(bounds)) {
      return;
    }
    shell.commit(columnLanding(
      lazyTravel(columnUnder(order, bounds))(aloft.held, moving, aloft.landing)));
  });
};

const columnLand = (shell: Shell): void => {
  maybe(shell.desk().aloft).map(aloft => {
    if (aloft.axis !== 'column') {
      return;
    }
    maybe(aloft.landing).map(struck => settleColumn(shell, aloft.held, struck));
  });
};

const rowTravel = (shell: Shell, moving: {clientX: number; clientY: number}): void => {
  maybe(shell.desk().aloft).map(aloft => {
    const {bounds, seated: standing} = shell.desk();
    if (aloft.axis !== 'row' || !has(bounds)) {
      return;
    }
    shell.commit(rowLanding(
      lazyTravel(rowUnder(standing, bounds))(aloft.held, moving, aloft.landing)));
  });
};

const rowLand = (shell: Shell): void => {
  maybe(shell.desk().aloft).map(aloft => {
    if (aloft.axis !== 'row') {
      return;
    }
    maybe(aloft.landing).map(struck => settleRow(shell, aloft.held, struck));
  });
};

const wireColumnGrip = (shell: Shell, th: HTMLTableCellElement): void => {
  const held = columnOf(shell.desk(), th);

  const ordered = ({from, to}: {from: number; to: number}): void =>
    shell.commit(orderedTo(from, to));

  const grabbed = (grab: Grab): void => {
    shell.commit(lifted({axis: 'column', held}, grab));
  };

  th.addEventListener('pointerdown', columnLift(held, () => shell.desk().order, () => shell.desk().seated, grabbed));
  th.addEventListener('keydown', staticColumnArrows(held, () => shell.desk().order, ordered));
};

const wireRowGrip = (shell: Shell, held: number, grip: HTMLButtonElement): void => {
  const arranged = ({to}: {to: number; after: number[]}): void =>
    shell.commit(desk => nudgedTo(held, to)(baked(desk)));

  const grabbed = (grab: Grab): void => {
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
