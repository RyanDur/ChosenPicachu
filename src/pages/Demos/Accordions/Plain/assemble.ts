import accordionsCss from '../Accordions.css?frame';
import scaffold from './fold.html?raw';
import foldJs from './fold.main.ts?frame';
import {Sheet, siteSheets} from '../../Stage';

const sheets: Sheet[] = [...siteSheets, {name: 'Accordions.css', css: accordionsCss}];

const assembled = (): string => scaffold
  .replace('/* the cascade */', () => sheets.map(({css}) => css).join('\n'))
  .replace('/* the script */', () => foldJs);

export const foldAssembly = {sheets, document: assembled};
