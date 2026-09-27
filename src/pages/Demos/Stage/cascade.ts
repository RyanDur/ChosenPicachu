import indexCss from '../../../index.css?raw';
import {not} from '@ryandur/sand';

export type Sheet = {name: string; css: string};

const styleSheets = import.meta.glob<string>('../../../styles/*.css', {query: '?raw', import: 'default', eager: true});

const sheet = (name: string): Sheet => {
  const path = `../../../styles/${name}`;
  if (not(path in styleSheets)) {
    throw new Error(`no sheet named "${name}" in styles/`);
  }
  return {name, css: styleSheets[path]};
};

const manifest = [...indexCss.matchAll(/@import "styles\/(.+?)";/g)].map(([, name]) => name);

export const siteSheets: Sheet[] = [
  ...manifest.map(sheet),
  {name: 'index.css', css: indexCss.replace(/@import "styles\/.+?";\n?/g, '')}
];
