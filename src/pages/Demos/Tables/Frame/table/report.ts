import {moveReport, Report} from './table-state';

export const report = (table: HTMLTableElement, said: Report): void => {
  const output = table.ownerDocument.querySelector(`output[for~="${table.id}"]`);
  const text = moveReport(said);
  if (output !== null && output.textContent !== text) {
    output.textContent = text;
  }
};
