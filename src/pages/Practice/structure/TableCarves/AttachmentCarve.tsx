import {FC} from 'react';
import bootSource from '@pages/Demos/Tables/Frame/boot.ts?sample';
import {Snippet, lines, carve} from '@pages/Demos/Recipe';

const tablesFound = carve.span(bootSource, "[...document.querySelectorAll('table[data-drag-sortable]')]", "querySelectorAll('table[data-drag-sortable]')");
const reportsHeard = carve.span(bootSource, "table.addEventListener('column-moved'", "table.addEventListener('sorted'");

export const AttachmentCarve: FC = () =>
  <Snippet label="TS" lines={[...tablesFound, lines.aside('// …and, for each table found:'), ...reportsHeard]}/>;
