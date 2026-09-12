import indexCss from '../../../../index.css?raw';
import tableCss from '@components/Table/Table.css?raw';
import headerCss from '@components/DragSortableTable/Header.css?raw';
import sortableCss from '@components/DragSortableTable/sortable.css?raw';
import rowGripCss from '@components/DragSortableTable/RowGrip.css?raw';
import motionCss from '@components/DragSortableTable/motion.css?raw';
import type {Motion, Origin, Pace} from '../../Controls';
import aggregationsCss from '../Aggregations/Aggregations.css?raw';
import tableHtml from './table.html?raw';
import scaffold from './frame.html?raw';
import frameJs from './frame.main.ts?frame';

const styleSheets = import.meta.glob<string>('../../../../styles/*.css', {query: '?raw', import: 'default', eager: true});

const sheet = (name: string): {name: string; css: string} => {
  const css = styleSheets[`../../../../styles/${name}`];
  if (css === undefined) {
    throw new Error(`no sheet named "${name}" in styles/`);
  }
  return {name, css};
};

const manifest = [...indexCss.matchAll(/@import "styles\/(.+?)";/g)].map(([, name]) => name);

export const sheets = [
  ...manifest.map(sheet),
  {name: 'index.css', css: indexCss.replace(/@import "styles\/.+?";\n?/g, '')},
  {name: 'Table.css', css: tableCss},
  {name: 'Header.css', css: headerCss},
  {name: 'sortable.css', css: sortableCss},
  {name: 'RowGrip.css', css: rowGripCss},
  {name: 'motion.css', css: motionCss},
  {name: 'Aggregations.css', css: aggregationsCss}
];

export type FrameConfig = {pace: Pace; origin: Origin; motion: Motion};

export type FrameEnv = {
  tradeFeed: string;
  tradeHistory: string;
  tradeProduct: string;
};

export const frameDocument = (env: FrameEnv, frame: FrameConfig): string => {
  const cascade = sheets.map(({css}) => css).join('\n');
  return scaffold
    .replace('/* the cascade */', () => cascade)
    .replace('<!-- the table as it starts -->', () => tableHtml.replace('class="fancy-table sortable apportioned"', `class="fancy-table sortable apportioned ${frame.origin} ${frame.motion}"`))
    .replace('/* the environment */', () => `window.__env = ${JSON.stringify(env)}; window.__frame = ${JSON.stringify(frame)};`)
    .replace('/* the shell */', () => frameJs);
};
