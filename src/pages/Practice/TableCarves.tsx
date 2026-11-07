import {FC} from 'react';
import tableSource from '@pages/Demos/Tables/Frame/table.html?sample';
import bootSource from '@pages/Demos/Tables/Frame/boot.ts?sample';
import columnSource from '@components/DragSortableTable/DraggableColumn.tsx?sample';
import {Snippet, lines, carve} from '@pages/Demos/Recipe';
import './TableCarves.css';

const {span} = carve();
const {aside} = lines();

const tableTag = span(tableSource, '<table class="fancy-table', '<table class="fancy-table');
const tradesHeader = span(tableSource, '<th scope="col" class="cell header-cell trades', '</th>');
const tablesFound = span(bootSource, "[...document.querySelectorAll('table[data-drag-sortable]')]", "querySelectorAll('table[data-drag-sortable]')");
const reportsHeard = span(bootSource, "table.addEventListener('column-moved'", "table.addEventListener('sorted'");
const columnWritten = span(columnSource, 'return <th {...th}', '</th>;');

export const HeaderCellCarve: FC = () =>
  <Snippet label="HTML" lines={[...tableTag, aside('<!-- …the caption, then the first header cell… -->'), ...tradesHeader]}/>;

export const AttachmentCarve: FC = () =>
  <Snippet label="TS" lines={[...tablesFound, aside('// …and, for each table found:'), ...reportsHeard]}/>;

export const ColumnBesideCarve: FC = () =>
  <div className="carves-beside">
    <Snippet label="HTML" lines={tradesHeader}/>
    <Snippet label="TS" lines={columnWritten}/>
  </div>;
