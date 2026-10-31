import accordionsCss from '../Accordions.css?frame';
import scaffold from './fold.html?raw';
import foldJs from './fold.main.ts?frame';
import {Sheet, siteSheets} from '../../Stage/cascade';

export const sheets: Sheet[] = [...siteSheets, {name: 'Accordions.css', css: accordionsCss}];

export const foldDocument = (): string => scaffold
  .replace('/* the cascade */', () => sheets.map(({css}) => css).join('\n'))
  .replace('/* the script */', () => foldJs);
