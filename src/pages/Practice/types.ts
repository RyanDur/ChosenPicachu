import {Concern, concerns} from '@pages/Record/moments';
import {Maybe, maybe} from '@ryandur/sand';
import {Paths} from '@navigation';

export const practiceAddress = (concern: Concern): string => `${Paths.practice}${concerns.idOf(concern)}/`;

const formerTabs: ReadonlyMap<string, Concern> = new Map([['dynamic', 'Behavior'], ['dynamic-interaction', 'Behavior']]);

export const concernAt = (segment?: string): Maybe<Concern> =>
  maybe(concerns.inOrder.find(concern => concerns.idOf(concern) === segment));

export const concernOf = (tab = ''): Concern =>
  maybe(formerTabs.get(tab)).either(former => former, () => concernAt(tab).orElse<Concern>('Structure'));
