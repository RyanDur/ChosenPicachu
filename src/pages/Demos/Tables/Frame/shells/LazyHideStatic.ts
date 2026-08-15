import {has, maybe} from '@ryandur/sand';
import {array} from '@components/arrays';
import {Bounds, Survey, columnUnder, interior, rowUnder, surveyed} from '@components/DragSortableTable/survey';
import {GhostFlight, Shell, columnGhost, columnOf, columnSteps, hideColumn, hideRow, moveColumn, moveRow, rowGhost, rowSteps, stand, unhideColumn, unhideRow} from '../shell';

const wireColumnGrip = (shell: Shell, th: HTMLTableCellElement): void => {
  const {table, desk} = shell;
  let survey: Bounds | undefined;
  let ghost: GhostFlight | undefined;
  let origin: {x: number; y: number} | undefined;
  let landing: string | undefined;

  const commit = (held: string, struck: string): void => {
    moveColumn(shell, desk.order.indexOf(held), interior(desk.order.indexOf(struck), desk.order.length));
  };

  const land = (): void => {
    if (has(landing)) {
      commit(columnOf(desk, th), landing);
    }
    landing = undefined;
    survey = undefined;
    unhideColumn(shell, columnOf(desk, th));
    if (has(ghost)) {
      ghost.land();
      ghost = undefined;
    }
    origin = undefined;
  };

  th.classList.add('grabbable');
  th.tabIndex = 0;

  th.addEventListener('pointerdown', event => {
    th.setPointerCapture(event.pointerId);
    survey = surveyed(table, desk.order, desk.seated);
    ghost = columnGhost(shell, columnOf(desk, th));
    origin = {x: event.clientX, y: event.clientY};
    hideColumn(shell, columnOf(desk, th));
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
    if (has(ghost) && has(origin)) {
      ghost.drift(event.clientX - origin.x, event.clientY - origin.y);
    }
    const held = columnOf(desk, th);
    const struck = columnUnder(desk.order, survey)(event.clientX, event.clientY, held);
    if (has(struck) && struck !== held) {
      landing = struck;
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
  let ghost: GhostFlight | undefined;
  let origin: {x: number; y: number} | undefined;
  let landing: number | undefined;

  const commit = (struck: number): void => {
    moveRow(shell, held, struck);
    shell.paint();
  };

  const land = (): void => {
    if (has(landing)) {
      commit(landing);
    }
    landing = undefined;
    survey = undefined;
    unhideRow(shell, held);
    if (has(ghost)) {
      ghost.land();
      ghost = undefined;
    }
    origin = undefined;
  };

  grip.addEventListener('pointerdown', event => {
    grip.setPointerCapture(event.pointerId);
    survey = surveyed(table, desk.order, desk.seated);
    ghost = rowGhost(shell, held);
    origin = {x: event.clientX, y: event.clientY};
    hideRow(shell, held);
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
    if (has(ghost) && has(origin)) {
      ghost.drift(event.clientX - origin.x, event.clientY - origin.y);
    }
    const struck = rowUnder(desk.seated, survey)(event.clientX, event.clientY, held);
    if (has(struck) && struck !== held) {
      landing = struck;
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
