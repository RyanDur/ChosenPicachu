import {FC} from 'react';
import tableSource from '@pages/Demos/Tables/Frame/table.html?sample';
import eagerTableSource from '@pages/Demos/Tables/Builds/EagerTable/EagerTable.tsx?sample';
import {Snippet, lines, carve} from '@pages/Demos/Recipe';
import './ColumnBesideCarve.css';

const tradesHeader = [
  ...carve.span(tableSource, '<th scope="col" class="cell header-cell trades', 'class="menu card rounded-corners lifted">'),
  lines.aside('        <!-- …ascending, descending and reset… -->'),
  ...carve.span(tableSource, '</menu>', '</th>')
];
const tradesWritten = carve.span(eagerTableSource, '<DraggableColumn column="trades"', '</DraggableColumn>');

export const ColumnBesideCarve: FC = () =>
  <figure className="carves-beside">
    <Snippet label="HTML" lines={tradesHeader}/>
    <Snippet label="HTML" lines={tradesWritten}/>
  </figure>;
