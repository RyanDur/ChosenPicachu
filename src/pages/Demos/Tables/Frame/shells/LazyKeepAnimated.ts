import {maybe} from '@ryandur/sand';
import {animatedColumnArrows, animatedRowArrows, Grab, columnLift, drifted, rowLift, lazyTravel} from '@components/DragSortableTable/travel';
import {Bounds, ColumnNudge, columnUnder, displaced, interior, RowNudge, rowUnder, shifts, Survey} from '@components/DragSortableTable/survey';
import {baked, columnGhost, columnOf, markColumns, markRows, nudgedTo, orderedTo, rowGhost, seatedTo, Shell, stand, takeFlight} from '../shell';

const wireColumnGrip = (shell: Shell, th: HTMLTableCellElement): void => {
  const held = columnOf(shell.desk(), th);

  const ordered = (nudge: ColumnNudge): void => {
    shell.commit(orderedTo(nudge.from, nudge.to));
    markColumns(shell, nudge.marks);
  };

  const commit = (held: string, struck: string, measured: Bounds): void => {
    const {order} = shell.desk();
    const marks = displaced(order, held, struck, measured);
    shell.commit(orderedTo(order.indexOf(held), interior(order.indexOf(struck), order.length)));
    markColumns(shell, marks);
  };

  const grabbed = ({survey, at, pointerId}: Grab): void => {
    const ghost = columnGhost(shell, held);
    takeFlight<string | undefined>(shell, pointerId, undefined, {
      travel: (moving, landing) => {
        ghost.drift(drifted(moving, at));
        return lazyTravel(columnUnder(shell.desk().order, survey))(held, moving, landing);
      },
      land: landing => {
        ghost.land();
        maybe(landing).map(struck => commit(held, struck, survey));
      }
    });
  };

  th.addEventListener('pointerdown', columnLift(held, () => shell.desk().order, () => shell.desk().seated, grabbed));
  th.addEventListener('keydown', animatedColumnArrows(held, () => shell.desk().order, ordered));
};

const wireRowGrip = (shell: Shell, held: number, grip: HTMLButtonElement): void => {
  const arranged = (nudge: RowNudge): void => {
    shell.commit(desk => nudgedTo(held, nudge.to)(baked(desk)));
    markRows(shell, nudge.drops);
  };

  const commit = (struck: number, measured: Survey): void => {
    const before = shell.desk().seated;
    shell.commit(seatedTo(held, struck));
    markRows(shell, shifts(measured.rowHeights, before, shell.desk().seated, held));
  };

  const grabbed = ({survey, at, pointerId}: Grab): void => {
    shell.commit(baked);
    const ghost = rowGhost(shell, held);
    takeFlight<number | undefined>(shell, pointerId, undefined, {
      travel: (moving, landing) => {
        ghost.drift(drifted(moving, at));
        return lazyTravel(rowUnder(shell.desk().seated, survey))(held, moving, landing);
      },
      land: landing => {
        ghost.land();
        maybe(landing).map(struck => commit(struck, survey));
      }
    });
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
    ruled: (shell, heights, before, after) => markRows(shell, shifts(heights, before, after))
  });
