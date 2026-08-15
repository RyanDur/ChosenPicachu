import {has, maybe} from '@ryandur/sand';
import {array} from '@components/arrays';
import {anchored, columnUnder, interior, rowUnder, surveyed} from '@components/DragSortableTable/survey';
import {Shell, columnGhost, columnOf, columnSteps, hideColumn, hideRow, moveColumn, moveRow, rowGhost, rowSteps, stand, takeFlight, unhideColumn, unhideRow} from '../shell';

const wireColumnGrip = (shell: Shell, th: HTMLTableCellElement): void => {
  const {table, desk} = shell;

  const commit = (held: string, struck: string): void => {
    moveColumn(shell, desk.order.indexOf(held), interior(desk.order.indexOf(struck), desk.order.length));
  };

  th.addEventListener('pointerdown', event => {
    if (anchored(desk.order.indexOf(columnOf(desk, th)), desk.order.length)) {
      return;
    }
    const survey = surveyed(table, desk.order, desk.seated);
    const ghost = columnGhost(shell, columnOf(desk, th));
    const from = {x: event.clientX, y: event.clientY};
    hideColumn(shell, columnOf(desk, th));
    let landing: string | undefined;
    takeFlight(shell, event, {
      travel: moving => {
        ghost.drift(moving.clientX - from.x, moving.clientY - from.y);
        const held = columnOf(desk, th);
        const struck = columnUnder(desk.order, survey)(moving.clientX, moving.clientY, held);
        if (has(struck)) {
          landing = struck === held ? undefined : struck;
        }
      },
      land: () => {
        if (has(landing)) {
          commit(columnOf(desk, th), landing);
        }
        unhideColumn(shell, columnOf(desk, th));
        ghost.land();
      }
    });
  });
  th.addEventListener('keydown', event => {
    maybe(columnSteps[event.key]).map(toward => {
      event.preventDefault();
      if (anchored(desk.order.indexOf(columnOf(desk, th)), desk.order.length)) {
        return;
      }
      const held = columnOf(desk, th);
      const from = desk.order.indexOf(held);
      const to = interior(from + toward, desk.order.length);
      if (to === from) {
        return;
      }
      moveColumn(shell, from, to);
    });
  });
};

const wireRowGrip = (shell: Shell, held: number, grip: HTMLButtonElement): void => {
  const {table, desk} = shell;

  const commit = (struck: number): void => {
    moveRow(shell, held, struck);
    shell.paint();
  };

  grip.addEventListener('pointerdown', event => {
    shell.bake();
    const survey = surveyed(table, desk.order, desk.seated);
    const ghost = rowGhost(shell, held);
    const from = {x: event.clientX, y: event.clientY};
    hideRow(shell, held);
    let landing: number | undefined;
    takeFlight(shell, event, {
      travel: moving => {
        ghost.drift(moving.clientX - from.x, moving.clientY - from.y);
        const struck = rowUnder(desk.seated, survey)(moving.clientX, moving.clientY, held);
        if (has(struck)) {
          landing = struck === held ? undefined : struck;
        }
      },
      land: () => {
        if (has(landing)) {
          commit(landing);
        }
        unhideRow(shell, held);
        ghost.land();
      }
    });
  });
  grip.addEventListener('keydown', event => {
    maybe(rowSteps[event.key]).map(toward => {
      event.preventDefault();
      shell.bake();
      const from = desk.seats.indexOf(held);
      const to = Math.min(Math.max(from + toward, 0), desk.seats.length - 1);
      if (to === from) {
        return;
      }
      desk.seats = array.moveToIndex(to, held, desk.seats);
      shell.paint();
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
    }
  });
