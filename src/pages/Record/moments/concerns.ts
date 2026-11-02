import {MomentKey} from './moments';

export const concernsInOrder = ['Structure', 'Presentation', 'Behavior'] as const;

export type Concern = typeof concernsInOrder[number];

export const fromTheRecord: Record<Concern, readonly MomentKey[]> = {
  'Structure': ['need', 'structureArrives', 'webGoesPublic', 'htmlTwo', 'needOutrunsStandards', 'browsersTakePen', 'someoneNeedsComponents', 'html5SaysIt', 'documentComesBack', 'elementsArrive'],
  'Presentation': ['presentationLeavesHome', 'needOutrunsStandards', 'cssOne', 'browsersAgree', 'wiredRedesign', 'zenGarden', 'defaultsAgree', 'cssTwoOne', 'someoneNeedsComponents', 'constantsNeedHome'],
  'Behavior': ['behaviorBorn', 'ecmaScript', 'pageBecomesApplication', 'esFive', 'frameworks', 'someoneNeedsComponents', 'documentComesBack']
};

export const concernsOf = (key: MomentKey): string =>
  concernsInOrder.filter(concern => fromTheRecord[concern].includes(key)).join(', ');

export const concernId = (concern: Concern): string => concern.toLowerCase().split(' ').join('-');
