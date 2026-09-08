import {has, maybe} from '@ryandur/sand';
import {Grip, STEP_SHARE, grippedAt, measuredWidths, resizeLabel, soughtTrade} from '@components/Table/shares';
import {columnSteps} from '@components/DragSortableTable/survey';
import {MeasuresState, MountedTable, columnOf, measured, orderOf, tradedBy, widthsOf} from './table-state';

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

export const dressWidths = (table: HTMLTableElement, state: MeasuresState): void => {
  maybe(widthsOf(state)).map(widths => {
    table.classList.add('apportioned');
    orderOf(state).forEach(column => dressColumn(table, column, widths[column]));
  });
};

const wireHandle = (mounted: MountedTable, column: string, handle: HTMLButtonElement): void => {
  const {table} = mounted;
  let grip: Grip | undefined;
  let carried = 0;

  const awaken = (): void => {
    const widths = widthsOf(mounted.store.state) ?? measuredWidths(orderOf(mounted.store.state), table);
    mounted.store.dispatch(measured(widths));
  };

  handle.addEventListener('focus', awaken);
  handle.addEventListener('pointerdown', event => {
    event.stopPropagation();
    awaken();
    grip = grippedAt(table.getBoundingClientRect().width, event.clientX);
    carried = 0;
  });
  handle.addEventListener('pointermove', event => {
    if (!has(grip)) {
      return;
    }
    handle.setPointerCapture(event.pointerId);
    const trade = soughtTrade(grip, event.clientX, carried);
    mounted.store.dispatch(tradedBy(column, trade.delta));
    reportShare(mounted, column);
    carried = trade.carried;
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(landing =>
    handle.addEventListener(landing, () => {
      grip = undefined;
    }));
  handle.addEventListener('keydown', event => {
    maybe(columnSteps[event.key]).map(toward => {
      event.preventDefault();
      event.stopPropagation();
      awaken();
      mounted.store.dispatch(tradedBy(column, toward * STEP_SHARE));
      reportShare(mounted, column);
    });
  });
};

const reportShare = (mounted: MountedTable, column: string): void => {
  const share = widthsOf(mounted.store.state)?.[column];
  if (share !== undefined) {
    mounted.report({axis: 'share', name: column, share});
  }
};

export const wireResize = (mounted: MountedTable): void => {
  [...mounted.table.querySelectorAll('.resize-handle')]
    .filter(handle => handle instanceof HTMLButtonElement)
    .forEach(handle => maybe(handle.closest('th')).map(th =>
      wireHandle(mounted, columnOf(mounted.store.state, th), handle)));
};
