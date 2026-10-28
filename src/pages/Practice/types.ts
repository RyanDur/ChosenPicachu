import {Concern, concernId, concernsInOrder} from '@pages/Record/moments/concerns';
import {Paths} from '@pages/Paths';

export const practiceAddress = (concern: Concern): string => `${Paths.practice}${concernId(concern)}/`;

const formerTabs: ReadonlyMap<string, Concern> = new Map([['dynamic', 'Behavior'], ['dynamic-interaction', 'Behavior']]);

export const concernAt = (segment?: string): Concern | undefined => concernsInOrder.find(concern => concernId(concern) === segment);

export const concernOf = (tab = ''): Concern => formerTabs.get(tab) ?? concernAt(tab) ?? 'Structure';
