import {has, maybe} from '@ryandur/sand';
import {Grip, STEP_SHARE, grippedAt, measuredShares, resizeLabel, soughtTrade} from '@components/Table/shares';
import {columnSteps} from '@components/DragSortableTable/survey';
import {TableState, MountedTable, columnOf, sharedAs, tradedBy} from './table-state';

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

export const dressShares = (table: HTMLTableElement, state: TableState): void => {
  maybe(state.shares).map(shares => {
    table.classList.add('apportioned');
    state.order.forEach(column => dressColumn(table, column, shares[column]));
  });
};

const wireHandle = (mounted: MountedTable, column: string, handle: HTMLButtonElement): void => {
  const {table} = mounted;
  let grip: Grip | undefined;
  let carried = 0;

  const awaken = (): void => {
    const shares = mounted.state().shares ?? measuredShares(mounted.state().order, table);
    mounted.commit(sharedAs(shares));
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
    mounted.commit(tradedBy(column, trade.delta));
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
      mounted.commit(tradedBy(column, toward * STEP_SHARE));
    });
  });
};

export const wireResize = (mounted: MountedTable): void => {
  [...mounted.table.querySelectorAll('.resize-handle')]
    .filter(handle => handle instanceof HTMLButtonElement)
    .forEach(handle => maybe(handle.closest('th')).map(th =>
      wireHandle(mounted, columnOf(mounted.state(), th), handle)));
};
