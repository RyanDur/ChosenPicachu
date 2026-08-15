import {maybe} from '@ryandur/sand';
import indexCss from '../../../../index.css?raw';
import tableCss from '@components/Table/Table.css?raw';
import headerCss from '@components/DragSortableTable/Header.css?raw';
import sortableCss from '@components/DragSortableTable/sortable.css?raw';
import rowGripCss from '@components/DragSortableTable/RowGrip.css?raw';
import ghostCss from '@components/DragSortableTable/ghosts/Ghost.css?raw';
import eagerKeepAnimatedCss from '@components/DragSortableTable/EagerKeepAnimatedTable/EagerKeepAnimatedTable.css?raw';
import eagerHideAnimatedCss from '@components/DragSortableTable/EagerHideAnimatedTable/EagerHideAnimatedTable.css?raw';
import eagerHideStaticCss from '@components/DragSortableTable/EagerHideStaticTable/EagerHideStaticTable.css?raw';
import lazyKeepAnimatedCss from '@components/DragSortableTable/LazyKeepAnimatedTable/LazyKeepAnimatedTable.css?raw';
import lazyHideAnimatedCss from '@components/DragSortableTable/LazyHideAnimatedTable/LazyHideAnimatedTable.css?raw';
import lazyHideStaticCss from '@components/DragSortableTable/LazyHideStaticTable/LazyHideStaticTable.css?raw';
import type {Motion, Origin, Pace} from '../../Controls';
import menuCss from '@components/Menu/Menu.css?raw';
import aggregationsCss from '../Aggregations/Aggregations.css?raw';
import tableHtml from './table.html?raw';
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
  {name: 'Ghost.css', css: ghostCss},
  {name: 'Menu.css', css: menuCss},
  {name: 'Aggregations.css', css: aggregationsCss}
];

export type FrameConfig = {pace: Pace; origin: Origin; motion: Motion};

const variantSheets: Record<Pace, Record<Origin, Record<Motion, {name: string; css: string} | undefined>>> = {
  eager: {
    keep: {animated: {name: 'EagerKeepAnimatedTable.css', css: eagerKeepAnimatedCss}, static: undefined},
    hide: {animated: {name: 'EagerHideAnimatedTable.css', css: eagerHideAnimatedCss}, static: {name: 'EagerHideStaticTable.css', css: eagerHideStaticCss}}
  },
  lazy: {
    keep: {animated: {name: 'LazyKeepAnimatedTable.css', css: lazyKeepAnimatedCss}, static: undefined},
    hide: {animated: {name: 'LazyHideAnimatedTable.css', css: lazyHideAnimatedCss}, static: {name: 'LazyHideStaticTable.css', css: lazyHideStaticCss}}
  }
};

export type FrameEnv = {
  tradeFeed: string;
  tradeHistory: string;
  tradeProduct: string;
};

export const frameDocument = (env: FrameEnv, frame: FrameConfig): string => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>the living table</title>
<style>
${[...sheets, ...maybe(variantSheets[frame.pace][frame.origin][frame.motion]).map(sheet => [sheet]).orElse([])].map(({css}) => css).join('\n')}
</style>
</head>
<body>
${tableHtml}
<script>window.__env = ${JSON.stringify(env)}; window.__frame = ${JSON.stringify(frame)};</script>
<script type="module">
${frameJs}
</script>
</body>
</html>`;
