import {Concern, concernId, concernsInOrder} from '@pages/Record/moments/concerns';
import {Maybe, maybe} from '@ryandur/sand';
import {Paths} from '@pages/Paths';

export const practiceAddress = (concern: Concern): string => `${Paths.practice}${concernId(concern)}/`;

const formerTabs: ReadonlyMap<string, Concern> = new Map([['dynamic', 'Behavior'], ['dynamic-interaction', 'Behavior']]);

export const concernAt = (segment?: string): Maybe<Concern> => maybe(concernsInOrder.find(concern => concernId(concern) === segment));

export const concernOf = (tab = ''): Concern =>
  maybe(formerTabs.get(tab)).either(former => former, () => concernAt(tab).orElse<Concern>('Structure'));
