import indexCss from '../../../../index.css?raw';
import tableCss from '@components/Table/Table.css?raw';
import headerCss from '@components/DragSortableTable/Header.css?raw';
import sortableCss from '@components/DragSortableTable/sortable.css?raw';
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
  {name: 'Menu.css', css: menuCss},
  {name: 'Aggregations.css', css: aggregationsCss}
];

export type FrameEnv = {
  tradeFeed: string;
  tradeHistory: string;
  tradeProduct: string;
};

export const frameDocument = (env: FrameEnv): string => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>the living table</title>
<style>
${sheets.map(({css}) => css).join('\n')}
</style>
</head>
<body>
${tableHtml}
<script>window.__env = ${JSON.stringify(env)};</script>
<script type="module">
${frameJs}
</script>
</body>
</html>`;
