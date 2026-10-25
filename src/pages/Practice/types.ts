import * as schema from 'schemawax';
import {maybe} from '@ryandur/sand';
import {Concern, concernId, concernsInOrder} from '@pages/Record/moments/concerns';
import {Paths} from '@pages/Paths';

export const practiceAddress = (concern: Concern): string => `${Paths.practice}?tab=${concernId(concern)}`;

export const concernTabs = concernsInOrder.map(concern => ({display: concern, param: concernId(concern)}));

const noConcernHas = (param: string): never => {
  throw new schema.DecoderError(`no concern has the tab ${param}`);
};

const formerTabs: ReadonlyMap<string, Concern> = new Map([['dynamic', 'Behavior'], ['dynamic-interaction', 'Behavior']]);

export const concernParam: schema.Decoder<Concern> = schema.string.andThen(param =>
  maybe(formerTabs.get(param) ?? concernsInOrder.find(concern => concernId(concern) === param)).either(named => named, () => noConcernHas(param)));
