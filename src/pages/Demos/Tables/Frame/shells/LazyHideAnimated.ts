import {has, maybe} from '@ryandur/sand';
import {ColumnNudge, columnUnder, displaced, interior, RowNudge, rowUnder, shifts} from '@components/DragSortableTable/survey';
import {Grab, animatedColumnArrows, animatedRowArrows, columnLift, rowLift, lazyTravel} from '@components/DragSortableTable/travel';
import {baked, columnLanding, columnOf, hideColumn, hideRow, lifted, markColumns, markRows, nudgedTo, orderedTo, rowLanding, seatedTo, Shell, stand, unhideColumn, unhideRow} from '../shell';

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
    unhideColumn(shell, aloft.held);
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
    unhideRow(shell, aloft.held);
    maybe(aloft.landing).map(struck => settleRow(shell, aloft.held, struck));
  });
};

const wireColumnGrip = (shell: Shell, th: HTMLTableCellElement): void => {
  const held = columnOf(shell.desk(), th);

  const ordered = (nudge: ColumnNudge): void => {
    shell.commit(orderedTo(nudge.from, nudge.to));
    markColumns(shell, nudge.marks);
  };

  const grabbed = (grab: Grab): void => {
    hideColumn(shell, held);
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
    hideRow(shell, held);
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
