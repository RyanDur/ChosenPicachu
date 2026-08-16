import {maybe} from '@ryandur/sand';
import {staticColumnArrows, staticRowArrows, Grab, columnLift, drifted, rowLift, lazyTravel} from '@components/DragSortableTable/travel';
import {columnUnder, interior, rowUnder} from '@components/DragSortableTable/survey';
import {baked, columnGhost, columnOf, nudgedTo, orderedTo, rowGhost, seatedTo, Shell, stand, takeFlight} from '../shell';

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
    takeFlight<string | undefined>(shell, pointerId, undefined, {
      travel: (moving, landing) => {
        ghost.drift(drifted(moving, at));
        return lazyTravel(columnUnder(shell.desk().order, survey))(held, moving, landing);
      },
      land: landing => {
        ghost.land();
        maybe(landing).map(struck => commit(held, struck));
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
    takeFlight<number | undefined>(shell, pointerId, undefined, {
      travel: (moving, landing) => {
        ghost.drift(drifted(moving, at));
        return lazyTravel(rowUnder(shell.desk().seated, survey))(held, moving, landing);
      },
      land: landing => {
        ghost.land();
        maybe(landing).map(struck => commit(struck));
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
