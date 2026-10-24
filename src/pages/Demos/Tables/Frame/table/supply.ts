import {classNames} from '@components/class-names';

const supplied = (host: HTMLElement, rows: HTMLTemplateElement): void => {
  const table = host.ownerDocument.createElement('table');
  table.className = classNames('fancy-table', 'sortable', 'apportioned', host.getAttribute('origin') ?? undefined, host.getAttribute('motion') ?? undefined);
  const caption = host.ownerDocument.createElement('caption');
  caption.className = 'off-screen';
  caption.textContent = host.getAttribute('caption');
  const moveReport = host.ownerDocument.createElement('output');
  moveReport.className = 'off-screen';
  moveReport.setAttribute('aria-label', 'move report');
  table.append(caption, rows.content);
  rows.replaceWith(table, moveReport);
};

export const supplyTable = (host: HTMLElement): void => {
  const rows = host.querySelector(':scope > template');
  if (rows instanceof HTMLTemplateElement) {
    supplied(host, rows);
  }
};
