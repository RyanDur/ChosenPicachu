import {has, maybe} from '@ryandur/sand';
import {array} from '@components/arrays';
import {Bounds, Survey, anchored, bounded, columnUnder, displaced, interior, rowUnder, shifts, surveyed} from '@components/DragSortableTable/survey';
import {Shell, columnGhost, columnOf, columnSteps, markColumns, markRows, moveColumn, moveRow, rowGhost, rowSteps, stand, takeFlight} from '../shell';

const wireColumnGrip = (shell: Shell, th: HTMLTableCellElement): void => {
  const {table, desk} = shell;

  const commit = (held: string, struck: string, measured: Bounds): void => {
    const marks = displaced(desk.order, held, struck, measured);
    moveColumn(shell, desk.order.indexOf(held), interior(desk.order.indexOf(struck), desk.order.length));
    markColumns(shell, marks);
  };

  th.addEventListener('pointerdown', event => {
    if (anchored(desk.order.indexOf(columnOf(desk, th)), desk.order.length)) {
      return;
    }
    const survey = surveyed(table, desk.order, desk.seated);
    const ghost = columnGhost(shell, columnOf(desk, th));
    const from = {x: event.clientX, y: event.clientY};
    let landing: string | undefined;
    takeFlight(shell, event, {
      travel: moving => {
        ghost.drift(moving.clientX - from.x, moving.clientY - from.y);
        const held = columnOf(desk, th);
        const struck = columnUnder(desk.order, survey)(moving.clientX, moving.clientY, held);
        if (has(struck) && struck !== held) {
          landing = struck;
        }
      },
      land: () => {
        ghost.land();
        if (has(landing)) {
          commit(columnOf(desk, th), landing, survey);
        }
      }
    });
  });
  th.addEventListener('keydown', event => {
    maybe(columnSteps[event.key]).map(toward => {
      event.preventDefault();
      if (anchored(desk.order.indexOf(columnOf(desk, th)), desk.order.length)) {
        return;
      }
      if (th.getAnimations().length > 0) {
        return;
      }
      const held = columnOf(desk, th);
      const from = desk.order.indexOf(held);
      const to = interior(from + toward, desk.order.length);
      if (to === from) {
        return;
      }
      const measured = bounded(table, desk.order);
      const spanned = desk.order.reduce((sum, name) => sum + (measured.columnWidths[name] ?? 0), 0);
      const gap = desk.order.length > 1 ? Math.max(measured.width - spanned, 0) / (desk.order.length - 1) : 0;
      const carried = (name: string): number => (measured.columnWidths[name] ?? 0) + gap;
      const neighbour = desk.order[to];
      moveColumn(shell, from, to);
      markColumns(shell, {
        [held]: {toward: toward > 0 ? 'right' : 'left', by: carried(neighbour)},
        [neighbour]: {toward: toward > 0 ? 'left' : 'right', by: carried(held)}
      });
    });
  });
};

const wireRowGrip = (shell: Shell, held: number, grip: HTMLButtonElement): void => {
  const {table, desk} = shell;

  const commit = (struck: number, measured: Survey): void => {
    const before = desk.seated;
    moveRow(shell, held, struck);
    shell.paint();
    markRows(shell, shifts(measured.rowHeights, before, desk.seated, held));
  };

  grip.addEventListener('pointerdown', event => {
    shell.bake();
    const survey = surveyed(table, desk.order, desk.seated);
    const ghost = rowGhost(shell, held);
    const from = {x: event.clientX, y: event.clientY};
    let landing: number | undefined;
    takeFlight(shell, event, {
      travel: moving => {
        ghost.drift(moving.clientX - from.x, moving.clientY - from.y);
        const struck = rowUnder(desk.seated, survey)(moving.clientX, moving.clientY, held);
        if (has(struck) && struck !== held) {
          landing = struck;
        }
      },
      land: () => {
        ghost.land();
        if (has(landing)) {
          commit(landing, survey);
        }
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
      const from = desk.seats.indexOf(held);
      const to = Math.min(Math.max(from + toward, 0), desk.seats.length - 1);
      if (to === from) {
        return;
      }
      const measured = surveyed(table, desk.order, desk.seated);
      const before = desk.seated;
      desk.seats = array.moveToIndex(to, held, desk.seats);
      shell.paint();
      markRows(shell, shifts(measured.rowHeights, before, desk.seated));
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
