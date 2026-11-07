import {Source} from './source';

const names: Record<Source, string> = {
  [Source.AIC]: 'The Art Institute of Chicago',
  [Source.HARVARD]: 'Harvard Art Museums',
  [Source.VAM]: 'The Victoria and Albert Museum',
  [Source.CLEVELAND]: 'The Cleveland Museum of Art'
};

export const museums: readonly {display: string; param: Source}[] =
  Object.values(Source).map(param => ({display: names[param], param}));

export const museumNamed = (source: Source): string => names[source];
