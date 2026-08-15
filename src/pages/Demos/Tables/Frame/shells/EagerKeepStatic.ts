import {has, maybe} from '@ryandur/sand';
import {array} from '@components/arrays';
import {Bounds, Survey, columnUnder, interior, rowUnder, surveyed} from '@components/DragSortableTable/survey';
import {Shell, columnOf, columnSteps, moveColumn, moveRow, rowSteps, stand} from '../shell';

const wireColumnGrip = (shell: Shell, th: HTMLTableCellElement): void => {
  const {table, desk} = shell;
  let survey: Bounds | undefined;

  const commit = (held: string, struck: string): void => {
    moveColumn(shell, desk.order.indexOf(held), interior(desk.order.indexOf(struck), desk.order.length));
  };

  const land = (): void => {
    survey = undefined;
  };

  th.classList.add('grabbable');
  th.tabIndex = 0;

  th.addEventListener('pointerdown', () => {
    survey = surveyed(table, desk.order, desk.seated);
  });
  th.addEventListener('pointermove', event => {
    if (!has(survey)) {
      return;
    }
    if (event.buttons === 0) {
      land();
      return;
    }
    th.setPointerCapture(event.pointerId);
    const held = columnOf(desk, th);
    const struck = columnUnder(desk.order, survey)(event.clientX, event.clientY, held);
    if (has(struck) && struck !== held) {
      commit(held, struck);
    }
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ending =>
    th.addEventListener(ending, land));
  th.addEventListener('keydown', event => {
    maybe(columnSteps[event.key]).map(toward => {
      event.preventDefault();
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
  let survey: Survey | undefined;

  const commit = (struck: number): void => {
    moveRow(shell, held, struck);
    shell.paint();
  };

  const land = (): void => {
    survey = undefined;
  };

  grip.addEventListener('pointerdown', () => {
    survey = surveyed(table, desk.order, desk.seated);
  });
  grip.addEventListener('pointermove', event => {
    if (!has(survey)) {
      return;
    }
    if (event.buttons === 0) {
      land();
      return;
    }
    grip.setPointerCapture(event.pointerId);
    const struck = rowUnder(desk.seated, survey)(event.clientX, event.clientY, held);
    if (has(struck) && struck !== held) {
      commit(struck);
    }
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ending =>
    grip.addEventListener(ending, land));
  grip.addEventListener('keydown', event => {
    maybe(rowSteps[event.key]).map(toward => {
      event.preventDefault();
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
  stand(document, shell => {
    [...shell.table.querySelectorAll('thead th')]
      .filter(th => th instanceof HTMLTableCellElement)
      .forEach(th => wireColumnGrip(shell, th));
    shell.lanes.forEach((lane, held) =>
      [...lane.querySelectorAll('button.grip')]
        .filter(grip => grip instanceof HTMLButtonElement)
        .forEach(grip => wireRowGrip(shell, held, grip)));
  });
