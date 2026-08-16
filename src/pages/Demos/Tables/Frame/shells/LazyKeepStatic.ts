import {maybe} from '@ryandur/sand';
import {drifted, lazyTravel} from '@components/DragSortableTable/travel';
import {anchored, columnSteps, columnUnder, interior, nudgedColumn, nudgedRow, rowSteps, rowUnder, surveyed} from '@components/DragSortableTable/survey';
import {baked, columnGhost, columnOf, nudgedTo, orderedTo, rowGhost, seatedTo, Shell, stand, takeFlight} from '../shell';

const wireColumnGrip = (shell: Shell, th: HTMLTableCellElement): void => {
  const {table} = shell;

  const commit = (held: string, struck: string): void => {
    const {order} = shell.desk();
    shell.commit(orderedTo(order.indexOf(held), interior(order.indexOf(struck), order.length)));
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
        maybe(landing).map(struck => commit(columnOf(shell.desk(), th), struck));
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
      const {from, to} = nudgedColumn(order, held, toward);
      if (to === from) {
        return;
      }
      shell.commit(orderedTo(from, to));
    });
  });
};

const wireRowGrip = (shell: Shell, held: number, grip: HTMLButtonElement): void => {
  const {table} = shell;

  const commit = (struck: number): void => {
    shell.commit(seatedTo(held, struck));
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
        maybe(landing).map(struck => commit(struck));
      }
    });
  });
  grip.addEventListener('keydown', event => {
    maybe(rowSteps[event.key]).map(toward => {
      event.preventDefault();
      shell.commit(baked);
      const {seats} = shell.desk();
      const {from, to} = nudgedRow(seats, held, toward);
      if (to === from) {
        return;
      }
      shell.commit(nudgedTo(held, to));
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
