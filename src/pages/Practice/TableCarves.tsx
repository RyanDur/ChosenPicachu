import {FC} from 'react';
import tableSource from '@pages/Demos/Tables/Frame/table.html?sample';
import bootSource from '@pages/Demos/Tables/Frame/boot.ts?sample';
import columnSource from '@components/DragSortableTable/DraggableColumn.tsx?sample';
import {Snippet, lines, carve} from '@pages/Demos/Recipe';
import './TableCarves.css';

const tableTag = carve.span(tableSource, '<table class="fancy-table', '<table class="fancy-table');
const tradesHeader = carve.span(tableSource, '<th scope="col" class="cell header-cell trades', '</th>');
const tablesFound = carve.span(bootSource, "[...document.querySelectorAll('table[data-drag-sortable]')]", "querySelectorAll('table[data-drag-sortable]')");
const reportsHeard = carve.span(bootSource, "table.addEventListener('column-moved'", "table.addEventListener('sorted'");
const columnWritten = carve.span(columnSource, 'return <th {...th}', '</th>;');

export const HeaderCellCarve: FC = () =>
  <Snippet label="HTML" lines={[...tableTag, lines.aside('<!-- …the caption, then the first header cell… -->'), ...tradesHeader]}/>;

export const AttachmentCarve: FC = () =>
  <Snippet label="TS" lines={[...tablesFound, lines.aside('// …and, for each table found:'), ...reportsHeard]}/>;

export const ColumnBesideCarve: FC = () =>
  <div className="carves-beside">
    <Snippet label="HTML" lines={tradesHeader}/>
    <Snippet label="TS" lines={columnWritten}/>
  </div>;
