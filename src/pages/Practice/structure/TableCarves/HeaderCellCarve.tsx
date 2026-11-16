import {FC} from 'react';
import tableSource from '@pages/Demos/Tables/Frame/table.html?sample';
import {Snippet, lines, carve} from '@pages/Demos/Recipe';

const tableTag = carve.between(tableSource, '<table class="fancy-table', '<table class="fancy-table');
const tradesHeader = carve.between(tableSource, '<th scope="col" class="cell header-cell trades', '</th>');

export const HeaderCellCarve: FC = () =>
  <Snippet label="HTML" lines={[...tableTag, lines.aside('<!-- …the caption, then the first header cell… -->'), ...tradesHeader]}/>;
