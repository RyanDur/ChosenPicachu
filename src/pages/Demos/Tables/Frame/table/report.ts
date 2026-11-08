import {Maybe, maybe} from '@ryandur/sand';
import {Report, tableReports} from '@components/DragSortableTable/model';

const output = (table: HTMLTableElement): Maybe<Element> =>
  maybe(table.ownerDocument.querySelector(`output[for~="${table.id}"]`));

const write = (output: Element, said: Report): void => {
  const text = tableReports.move(said);
  if (output.textContent !== text) {
    output.textContent = text;
  }
};

export const moveReport = {
  output,
  write
};
