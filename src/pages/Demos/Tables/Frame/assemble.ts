import tableCss from '@components/DragSortableTable/Table.css?frame';
import headerCss from '@components/DragSortableTable/Header.css?frame';
import sortableCss from '@components/DragSortableTable/sortable.css?frame';
import rowGripCss from '@components/DragSortableTable/RowGrip.css?frame';
import motionCss from '@components/DragSortableTable/motion.css?frame';
import menuCss from '@components/Menu/Menu.css?frame';
import {Dials} from '../../Controls';
import {Exchange} from '@pages/Demos/Market';
import aggregationsCss from '../Aggregations.css?frame';
import scaffold from './frame.html?raw';
import frameJs from './frame.main.ts?frame';
import {startingTable} from './starting';
import {Sheet, siteSheets} from '../../Stage';

const sheets: Sheet[] = [
  ...siteSheets,
  {name: 'Table.css', css: tableCss},
  {name: 'Header.css', css: headerCss},
  {name: 'sortable.css', css: sortableCss},
  {name: 'RowGrip.css', css: rowGripCss},
  {name: 'motion.css', css: motionCss},
  {name: 'Menu.css', css: menuCss},
  {name: 'Aggregations.css', css: aggregationsCss}
];

const assembled = (environment: Exchange, frame: Dials): string => {
  const cascade = sheets.map(({css}) => css).join('\n');
  return scaffold
    .replace('/* the cascade */', () => cascade)
    .replace('<!-- the table as it starts -->', () => startingTable(frame))
    .replace('/* the environment */', () => `window.__env = ${JSON.stringify(environment)}; window.__frame = ${JSON.stringify(frame)};`)
    .replace('/* the shell */', () => frameJs);
};

type FrameAssembly = {
  sheets: Sheet[];
  document: (environment: Exchange, frame: Dials) => string;
};

export const frameAssembly: FrameAssembly = {sheets, document: assembled};
