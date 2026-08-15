import {has, maybe} from '@ryandur/sand';
import {array} from '@components/arrays';
import {Bounds, Survey, bounded, columnUnder, displaced, interior, rowUnder, shifts, surveyed} from '@components/DragSortableTable/survey';
import {Shell, columnOf, columnSteps, markColumns, markRows, moveColumn, moveRow, rowSteps, stand} from '../shell';

const wireColumnGrip = (shell: Shell, th: HTMLTableCellElement): void => {
  const {table, desk} = shell;
  let survey: Bounds | undefined;
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
  };

  th.classList.add('grabbable');
  th.tabIndex = 0;

  th.addEventListener('pointerdown', event => {
    th.setPointerCapture(event.pointerId);
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
  };

  grip.addEventListener('pointerdown', event => {
    grip.setPointerCapture(event.pointerId);
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
