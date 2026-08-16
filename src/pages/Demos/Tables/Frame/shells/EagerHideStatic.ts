import {staticColumnArrows, staticRowArrows, Grab, columnLift, drifted, rowLift, eagerTravel} from '@components/DragSortableTable/travel';
import {columnUnder, interior, rowUnder} from '@components/DragSortableTable/survey';
import {baked, columnGhost, columnOf, hideColumn, hideRow, nudgedTo, orderedTo, rowGhost, seatedTo, Shell, stand, takeFlight, unhideColumn, unhideRow} from '../shell';

const wireColumnGrip = (shell: Shell, th: HTMLTableCellElement): void => {
  const held = columnOf(shell.desk(), th);

  const ordered = ({from, to}: {from: number; to: number}): void =>
    shell.commit(orderedTo(from, to));

  const commit = (held: string, struck: string): void => {
    const {order} = shell.desk();
    shell.commit(orderedTo(order.indexOf(held), interior(order.indexOf(struck), order.length)));
  };

  const grabbed = ({survey, at, pointerId}: Grab): void => {
    const ghost = columnGhost(shell, held);
    hideColumn(shell, held);
    takeFlight<void>(shell, pointerId, undefined, {
      travel: moving => {
        ghost.drift(drifted(moving, at));
        eagerTravel(columnUnder(shell.desk().order, survey), struck => commit(held, struck))(held, moving);
      },
      land: () => {
        unhideColumn(shell, held);
        ghost.land();
      }
    });
  };

  th.addEventListener('pointerdown', columnLift(held, () => shell.desk().order, () => shell.desk().seated, grabbed));
  th.addEventListener('keydown', staticColumnArrows(held, () => shell.desk().order, ordered));
};

const wireRowGrip = (shell: Shell, held: number, grip: HTMLButtonElement): void => {
  const arranged = ({to}: {to: number; after: number[]}): void =>
    shell.commit(desk => nudgedTo(held, to)(baked(desk)));

  const commit = (struck: number): void => {
    shell.commit(seatedTo(held, struck));
  };

  const grabbed = ({survey, at, pointerId}: Grab): void => {
    shell.commit(baked);
    const ghost = rowGhost(shell, held);
    hideRow(shell, held);
    takeFlight<void>(shell, pointerId, undefined, {
      travel: moving => {
        ghost.drift(drifted(moving, at));
        eagerTravel(rowUnder(shell.desk().seated, survey), struck => commit(struck))(held, moving);
      },
      land: () => {
        unhideRow(shell, held);
        ghost.land();
      }
    });
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
    }
  });
