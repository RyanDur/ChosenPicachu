import {Concern, concerns} from '@pages/Record/moments';
import {Maybe, maybe} from '@ryandur/sand';
import {Paths} from '@navigation';

const of = (concern: Concern): string => `${Paths.practice}${concerns.idOf(concern)}/`;

const formerTabs: ReadonlyMap<string, Concern> = new Map([['dynamic', 'Behavior'], ['dynamic-interaction', 'Behavior']]);

const concernFromSegment = (segment?: string): Maybe<Concern> =>
  maybe(concerns.inOrder.find(concern => concerns.idOf(concern) === segment));

const concernForSavedTab = (tabId = ''): Concern =>
  maybe(formerTabs.get(tabId)).either(former => former, () => concernFromSegment(tabId).orElse<Concern>('Structure'));

export const practiceAddress = {of, concernFromSegment, concernForSavedTab};
