import {has, maybe} from '@ryandur/sand';
import {array} from '@components/arrays';
import {Bounds, Survey, bounded, columnUnder, displaced, interior, rowUnder, shifts, surveyed} from '@components/DragSortableTable/survey';
import {GhostFlight, Shell, columnGhost, columnOf, columnSteps, hideColumn, hideRow, markColumns, markRows, moveColumn, moveRow, rowGhost, rowSteps, stand, unhideColumn, unhideRow} from '../shell';

const wireColumnGrip = (shell: Shell, th: HTMLTableCellElement): void => {
  const {table, desk} = shell;
  let survey: Bounds | undefined;
  let ghost: GhostFlight | undefined;
  let origin: {x: number; y: number} | undefined;
  let landing: string | undefined;

  const commit = (held: string, struck: string, measured: Bounds): void => {
    const marks = displaced(desk.order, held, struck, measured);
    moveColumn(shell, desk.order.indexOf(held), interior(desk.order.indexOf(struck), desk.order.length));
    markColumns(shell, marks);
  };

  const land = (): void => {
    if (has(survey) && has(landing)) {
      commit(columnOf(desk, th), landing, survey);
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
  let survey: Survey | undefined;
  let ghost: GhostFlight | undefined;
  let origin: {x: number; y: number} | undefined;
  let landing: number | undefined;

  const commit = (struck: number, measured: Survey): void => {
    const before = desk.seated;
    moveRow(shell, held, struck);
    shell.paint();
    markRows(shell, shifts(measured.rowHeights, before, desk.seated, held));
  };

  const land = (): void => {
    if (has(survey) && has(landing)) {
      commit(landing, survey);
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
  stand(document, shell => {
    [...shell.table.querySelectorAll('thead th')]
      .filter(th => th instanceof HTMLTableCellElement)
      .forEach(th => wireColumnGrip(shell, th));
    shell.lanes.forEach((lane, held) =>
      [...lane.querySelectorAll('button.grip')]
        .filter(grip => grip instanceof HTMLButtonElement)
        .forEach(grip => wireRowGrip(shell, held, grip)));
  });
