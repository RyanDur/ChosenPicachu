import {Maybe, maybe} from '@ryandur/sand';
import {Report, tableReports} from '@components/DragSortableTable/model';

export const moveReportOf = (table: HTMLTableElement): Maybe<Element> =>
  maybe(table.ownerDocument.querySelector(`output[for~="${table.id}"]`));

export const report = (output: Element, said: Report): void => {
  const text = tableReports.move(said);
  if (output.textContent !== text) {
    output.textContent = text;
  }
};
