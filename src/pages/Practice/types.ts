import * as schema from 'schemawax';
import {maybe} from '@ryandur/sand';
import {Concern, concernId, concernsInOrder} from '@pages/Record/moments/concerns';

export const concernTabs = concernsInOrder.map(concern => ({display: concern, param: concernId(concern)}));

const noConcernHas = (param: string): never => {
  throw new schema.DecoderError(`no concern has the tab ${param}`);
};

const formerTabs: Readonly<Record<string, Concern>> = {'dynamic-interaction': 'Dynamic'};

export const concernParam: schema.Decoder<Concern> = schema.string.andThen(param =>
  maybe(formerTabs[param] ?? concernsInOrder.find(concern => concernId(concern) === param)).either(named => named, () => noConcernHas(param)));
