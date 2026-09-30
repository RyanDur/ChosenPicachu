import {maybe} from '@ryandur/sand';
import {STEP_SHARE, grippedAt, measuredWidths, neighborOf, resizeLabel} from '@components/Table/shares';
import {columnSteps} from '@components/DragSortableTable/survey';
import {TableAction} from '@components/DragSortableTable/actions';
import {MountedTable, columnOf, gripped, handleDragged, measured, released, sizingEnded, tradedBy, widthsOf} from './table-state';

const dressColumn = (table: HTMLTableElement, column: string, share: number, named: number): void => {
  maybe(table.querySelector(`th.${column}`)).map(header => {
    if (!(header instanceof HTMLTableCellElement)) {
      return;
    }
    header.classList.add('shared');
    header.style.setProperty('--share', `${share}%`);
    maybe(header.querySelector('.resize-handle')).map(handle =>
      handle.setAttribute('aria-label', resizeLabel(column, named)));
  });
};

export const dressWidths = ({table, store, order}: MountedTable): void => {
  maybe(widthsOf(store.state)).map(widths => {
    table.classList.add('apportioned');
    const {sizing} = store.state;
    order().forEach(column => dressColumn(table, column, widths[column], sizing?.column === column ? sizing.from : widths[column]));
  });
};

const wireHandle = (mounted: MountedTable, column: string, handle: HTMLButtonElement): void => {
  const {table} = mounted;

  const awaken = (): void => {
    const widths = widthsOf(mounted.store.state) ?? measuredWidths(mounted.order(), table);
    mounted.store.dispatch(measured(widths));
  };

  handle.addEventListener('focus', awaken);
  handle.addEventListener('pointerdown', event => {
    event.stopPropagation();
    awaken();
    maybe(grippedAt(table.getBoundingClientRect().width, event.clientX)).map(grip => mounted.store.dispatch(gripped(column, grip)));
  });
  handle.addEventListener('pointermove', event => {
    if (mounted.store.state.resizing?.column !== column) {
      return;
    }
    handle.setPointerCapture(event.pointerId);
    mounted.store.dispatch(handleDragged(neighborOf(mounted.order(), column), event.clientX));
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(landing =>
    handle.addEventListener(landing, () => endedAndReported(mounted, released())));
  handle.addEventListener('keyup', event => {
    maybe(columnSteps[event.key]).map(() => endedAndReported(mounted, sizingEnded()));
  });
  handle.addEventListener('blur', () => endedAndReported(mounted, sizingEnded()));
  handle.addEventListener('keydown', event => {
    maybe(columnSteps[event.key]).map(toward => {
      event.preventDefault();
      event.stopPropagation();
      awaken();
      mounted.store.dispatch(tradedBy(column, neighborOf(mounted.order(), column), toward * STEP_SHARE));
    });
  });
};

const endedAndReported = (mounted: MountedTable, ended: TableAction): void => {
  const said = mounted.store.state.report;
  mounted.store.dispatch(ended);
  maybe(mounted.store.state.report).map(report => report === said ? undefined : mounted.report(report));
};

export const wireResize = (mounted: MountedTable): void => {
  [...mounted.table.querySelectorAll('.resize-handle')]
    .filter(handle => handle instanceof HTMLButtonElement)
    .forEach(handle => maybe(handle.closest('th')).map(th =>
      wireHandle(mounted, columnOf(mounted.order(), th), handle)));
};
