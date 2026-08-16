import {maybe} from '@ryandur/sand';
import {drifted} from '@components/DragSortableTable/travel';
import {anchored, bounded, Bounds, columnSteps, columnUnder, displaced, interior, nudgedColumn, nudgedRow, rowSteps, rowUnder, shifts, struckAway, Survey, surveyed, swapped} from '@components/DragSortableTable/survey';
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
    takeFlight<void>(shell, event, undefined, {
      travel: moving => {
        ghost.drift(drifted(moving, from));
        const held = columnOf(shell.desk(), th);
        const struck = columnUnder(shell.desk().order, survey)(moving.clientX, moving.clientY, held);
        if (struckAway(held, struck)) {
          commit(held, struck, survey);
        }
      },
      land: () => {
        ghost.land();
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
      if (th.getAnimations().length > 0) {
        return;
      }
      const held = columnOf(shell.desk(), th);
      const {from, to} = nudgedColumn(order, held, toward);
      if (to === from) {
        return;
      }
      const neighbour = order[to];
      const marks = swapped(bounded(table, order), order)(held, neighbour, toward);
      shell.commit(orderedTo(from, to));
      markColumns(shell, marks);
    });
  });
};

const wireRowGrip = (shell: Shell, held: number, grip: HTMLButtonElement): void => {
  const {table} = shell;

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
    takeFlight<void>(shell, event, undefined, {
      travel: moving => {
        ghost.drift(drifted(moving, from));
        const struck = rowUnder(shell.desk().seated, survey)(moving.clientX, moving.clientY, held);
        if (struckAway(held, struck)) {
          commit(struck, survey);
        }
      },
      land: () => {
        ghost.land();
      }
    });
  });
  grip.addEventListener('keydown', event => {
    maybe(rowSteps[event.key]).map(toward => {
      event.preventDefault();
      const sliding = maybe(grip.closest('tr'))
        .map(lane => lane.getAnimations().length > 0)
        .orElse(false);
      if (sliding) {
        return;
      }
      shell.commit(baked);
      const {seats} = shell.desk();
      const {from, to} = nudgedRow(seats, held, toward);
      if (to === from) {
        return;
      }
      const measured = surveyed(table, shell.desk().order, shell.desk().seated);
      const before = shell.desk().seated;
      shell.commit(nudgedTo(held, to));
      markRows(shell, shifts(measured.rowHeights, before, shell.desk().seated));
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
