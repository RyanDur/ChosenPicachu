import {has, maybe} from '@ryandur/sand';
import {STEP_SHARE, grippedAt, measuredWidths, neighborOf, resizeLabel} from '@components/Table/shares';
import {columnSteps} from '@components/DragSortableTable/survey';
import {MountedTable, columnOf, gripped, handleDragged, measured, released, tradedBy, widthsOf} from './table-state';

const dressColumn = (table: HTMLTableElement, column: string, share: number): void => {
  maybe(table.querySelector(`th.${column}`)).map(header => {
    if (!(header instanceof HTMLTableCellElement)) {
      return;
    }
    header.classList.add('shared');
    header.style.setProperty('--share', `${share}%`);
    maybe(header.querySelector('.resize-handle')).map(handle =>
      handle.setAttribute('aria-label', resizeLabel(column, share)));
  });
};

export const dressWidths = ({table, store, order}: MountedTable): void => {
  maybe(widthsOf(store.state)).map(widths => {
    table.classList.add('apportioned');
    order().forEach(column => dressColumn(table, column, widths[column]));
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
    reportShare(mounted, column);
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(landing =>
    handle.addEventListener(landing, () => mounted.store.dispatch(released())));
  handle.addEventListener('keydown', event => {
    maybe(columnSteps[event.key]).map(toward => {
      event.preventDefault();
      event.stopPropagation();
      awaken();
      mounted.store.dispatch(tradedBy(column, neighborOf(mounted.order(), column), toward * STEP_SHARE));
      reportShare(mounted, column);
    });
  });
};

const reportShare = (mounted: MountedTable, column: string): void => {
  const share = widthsOf(mounted.store.state)?.[column];
  if (has(share)) {
    mounted.report({about: 'share', name: column, share});
  }
};

export const wireResize = (mounted: MountedTable): void => {
  [...mounted.table.querySelectorAll('.resize-handle')]
    .filter(handle => handle instanceof HTMLButtonElement)
    .forEach(handle => maybe(handle.closest('th')).map(th =>
      wireHandle(mounted, columnOf(mounted.order(), th), handle)));
};
