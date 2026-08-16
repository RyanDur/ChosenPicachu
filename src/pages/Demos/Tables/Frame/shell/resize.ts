import {has, maybe} from '@ryandur/sand';
import {Grip, STEP_SHARE, measuredShares, resizeLabel, sought} from '@components/Table/shares';
import {Desk, Shell, columnOf, columnSteps, sharedAs, tradedBy} from './desk';

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
    const pxPerShare = table.getBoundingClientRect().width / 100;
    if (pxPerShare) {
      grip = {fromX: event.clientX, pxPerShare};
      carried = 0;
    }
  });
  handle.addEventListener('pointermove', event => {
    if (!has(grip)) {
      return;
    }
    handle.setPointerCapture(event.pointerId);
    const share = sought(grip, event.clientX);
    shell.commit(tradedBy(column, share - carried));
    carried = share;
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
