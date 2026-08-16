import {has, maybe} from '@ryandur/sand';
import {anchored, bounded, Bounds, columnUnder, displaced, interior, rowUnder, shifts, Survey, surveyed} from '@components/DragSortableTable/survey';
import {baked, columnGhost, columnOf, columnSteps, markColumns, markRows, nudgedTo, orderedTo, rowGhost, rowSteps, seatedTo, Shell, stand, takeFlight} from '../shell';

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
        ghost.drift(moving.clientX - from.x, moving.clientY - from.y);
        const held = columnOf(shell.desk(), th);
        const struck = columnUnder(shell.desk().order, survey)(moving.clientX, moving.clientY, held);
        if (!has(struck)) {
          return landing;
        }
        return struck === held ? undefined : struck;
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
      if (th.getAnimations().length > 0) {
        return;
      }
      const held = columnOf(shell.desk(), th);
      const from = order.indexOf(held);
      const to = interior(from + toward, order.length);
      if (to === from) {
        return;
      }
      const measured = bounded(table, order);
      const spanned = order.reduce((sum, name) => sum + (measured.columnWidths[name] ?? 0), 0);
      const gap = order.length > 1 ? Math.max(measured.width - spanned, 0) / (order.length - 1) : 0;
      const carried = (name: string): number => (measured.columnWidths[name] ?? 0) + gap;
      const neighbour = order[to];
      shell.commit(orderedTo(from, to));
      markColumns(shell, {
        [held]: {toward: toward > 0 ? 'right' : 'left', by: carried(neighbour)},
        [neighbour]: {toward: toward > 0 ? 'left' : 'right', by: carried(held)}
      });
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
    takeFlight<number | undefined>(shell, event, undefined, {
      travel: (moving, landing) => {
        ghost.drift(moving.clientX - from.x, moving.clientY - from.y);
        const struck = rowUnder(shell.desk().seated, survey)(moving.clientX, moving.clientY, held);
        if (!has(struck)) {
          return landing;
        }
        return struck === held ? undefined : struck;
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
      const sliding = maybe(grip.closest('tr'))
        .map(lane => lane.getAnimations().length > 0)
        .orElse(false);
      if (sliding) {
        return;
      }
      shell.commit(baked);
      const {seats} = shell.desk();
      const from = seats.indexOf(held);
      const to = Math.min(Math.max(from + toward, 0), seats.length - 1);
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
