import {maybe} from '@ryandur/sand';
import {animatedColumnArrows, animatedRowArrows, drifted, lazyTravel} from '@components/DragSortableTable/travel';
import {anchored, Bounds, columnSteps, columnUnder, displaced, interior, rowSteps, rowUnder, shifts, Survey, surveyed} from '@components/DragSortableTable/survey';
import {baked, columnGhost, columnOf, markColumns, markRows, nudgedTo, orderedTo, rowGhost, seatedTo, Shell, stand, takeFlight} from '../shell';

const wireColumnGrip = (shell: Shell, th: HTMLTableCellElement): void => {
  const {table} = shell;

  const commit = (held: string, struck: string, measured: Bounds): void => {
    const {order} = shell.desk();
    const marks = displaced(order, held, struck, measured);
    shell.commit(orderedTo(order.indexOf(held), interior(order.indexOf(struck), order.length)));
    markColumns(shell, marks);
  };

  th.addEventListener('pointerdown', event => {
    const {order, seated} = shell.desk();
    if (anchored(order.indexOf(columnOf(shell.desk(), th)), order.length)) {
      return;
    }
    const survey = surveyed(table, order, seated);
    const ghost = columnGhost(shell, columnOf(shell.desk(), th));
    const from = {x: event.clientX, y: event.clientY};
    takeFlight<string | undefined>(shell, event, undefined, {
      travel: (moving, landing) => {
        ghost.drift(drifted(moving, from));
        const held = columnOf(shell.desk(), th);
        return lazyTravel(columnUnder(shell.desk().order, survey))(held, moving, landing);
      },
      land: landing => {
        ghost.land();
        maybe(landing).map(struck => commit(columnOf(shell.desk(), th), struck, survey));
      }
    });
  });
  th.addEventListener('keydown', event => {
    maybe(columnSteps[event.key]).map(toward => {
      event.preventDefault();
      const {order} = shell.desk();
      if (anchored(order.indexOf(columnOf(shell.desk(), th)), order.length)) {
        return;
      }
      const held = columnOf(shell.desk(), th);
      animatedColumnArrows(th, order, nudge => {
        shell.commit(orderedTo(nudge.from, nudge.to));
        markColumns(shell, nudge.marks);
      })(held, toward);
    });
  });
};

const wireRowGrip = (shell: Shell, held: number, grip: HTMLButtonElement): void => {
  const {table} = shell;

  const arranged = (to: number): void =>
    shell.commit(desk => nudgedTo(held, to)(baked(desk)));

  const commit = (struck: number, measured: Survey): void => {
    const before = shell.desk().seated;
    shell.commit(seatedTo(held, struck));
    markRows(shell, shifts(measured.rowHeights, before, shell.desk().seated, held));
  };

  grip.addEventListener('pointerdown', event => {
    shell.commit(baked);
    const survey = surveyed(table, shell.desk().order, shell.desk().seated);
    const ghost = rowGhost(shell, held);
    const from = {x: event.clientX, y: event.clientY};
    takeFlight<number | undefined>(shell, event, undefined, {
      travel: (moving, landing) => {
        ghost.drift(drifted(moving, from));
        return lazyTravel(rowUnder(shell.desk().seated, survey))(held, moving, landing);
      },
      land: landing => {
        ghost.land();
        maybe(landing).map(struck => commit(struck, survey));
      }
    });
  });
  grip.addEventListener('keydown', event => {
    maybe(rowSteps[event.key]).map(toward => {
      event.preventDefault();
      animatedRowArrows(grip, shell.desk().order, shell.desk().seated, nudge => {
        arranged(nudge.to);
        markRows(shell, nudge.drops);
      })(held, toward);
    });
  });
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
