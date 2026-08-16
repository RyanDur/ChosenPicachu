import {has, maybe} from '@ryandur/sand';
import {Grip, STEP_SHARE, grippedAt, measuredShares, resizeLabel, soughtTrade} from '@components/Table/shares';
import {columnSteps} from '@components/DragSortableTable/survey';
import {Desk, Shell, columnOf, sharedAs, tradedBy} from './desk';

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

export const dressShares = (table: HTMLTableElement, desk: Desk): void => {
  maybe(desk.shares).map(shares => {
    table.classList.add('apportioned');
    desk.order.forEach(column => dressColumn(table, column, shares[column]));
  });
};

const wireHandle = (shell: Shell, column: string, handle: HTMLButtonElement): void => {
  const {table} = shell;
  let grip: Grip | undefined;
  let carried = 0;

  const awaken = (): void => {
    const shares = shell.desk().shares ?? measuredShares(shell.desk().order, table);
    shell.commit(sharedAs(shares));
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
    shell.commit(tradedBy(column, trade.delta));
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
      shell.commit(tradedBy(column, toward * STEP_SHARE));
    });
  });
};

export const wireResize = (shell: Shell): void => {
  [...shell.table.querySelectorAll('.resize-handle')]
    .filter(handle => handle instanceof HTMLButtonElement)
    .forEach(handle => maybe(handle.closest('th')).map(th =>
      wireHandle(shell, columnOf(shell.desk(), th), handle)));
};
