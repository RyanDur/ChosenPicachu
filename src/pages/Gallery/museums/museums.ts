import {Source} from './source';

const names: Record<Source, string> = {
  [Source.AIC]: 'The Art Institute of Chicago',
  [Source.HARVARD]: 'Harvard Art Museums',
  [Source.VAM]: 'The Victoria and Albert Museum',
  [Source.CLEVELAND]: 'The Cleveland Museum of Art'
};

type Museums = {
  readonly all: readonly {display: string; param: Source}[];
  readonly named: (source: Source) => string;
};

export const museums: Museums = {
  all: Object.values(Source).map(param => ({display: names[param], param})),
  named: source => names[source]
};
