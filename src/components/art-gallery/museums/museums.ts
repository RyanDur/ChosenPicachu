import {maybe} from '@ryandur/sand';
import {Source} from './source';

export const museums: readonly {display: string; param: Source}[] = [
  {display: 'The Art Institute of Chicago', param: Source.AIC},
  {display: 'Harvard Art Museums', param: Source.HARVARD},
  {display: 'The Victoria and Albert Museum', param: Source.VAM},
  {display: 'The Cleveland Museum of Art', param: Source.CLEVELAND}
];

export const museumNamed = (source: Source): string =>
  maybe(museums.find(({param}) => param === source)).map(({display}) => display).orElse('');
