import {FC} from 'react';
import bootSource from '@pages/Demos/Tables/Frame/boot.ts?sample';
import {carve, lines, Snippet} from '@pages/Demos/Recipe';

const tablesFound = carve.between(bootSource, "[...document.querySelectorAll('table[data-drag-sortable]')]", "querySelectorAll('table[data-drag-sortable]')");
const reportsHeard = carve.between(bootSource, "table.addEventListener('column-moved'", "table.addEventListener('sorted'");

export const AttachmentCarve: FC = () =>
  <Snippet label="TS" lines={[...tablesFound, lines.aside('// …and, for each table found:'), ...reportsHeard]}/>;
