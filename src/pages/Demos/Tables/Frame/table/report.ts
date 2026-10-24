import {Maybe, maybe} from '@ryandur/sand';
import {moveReport, Report} from './table-state';

export const moveReportOf = (table: HTMLTableElement): Maybe<Element> =>
  maybe(table.ownerDocument.querySelector(`output[for~="${table.id}"]`));

export const report = (output: Element, said: Report): void => {
  const text = moveReport(said);
  if (output.textContent !== text) {
    output.textContent = text;
  }
};
