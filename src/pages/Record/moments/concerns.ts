import {MomentKey} from './moments';

export const concernsInOrder = ['Structure', 'Presentation', 'Dynamic Interaction'] as const;

export type Concern = typeof concernsInOrder[number];

export const fromTheRecord: Record<Concern, readonly MomentKey[]> = {
  'Structure': ['need', 'structureArrives', 'webGoesPublic', 'htmlTwo', 'needOutrunsStandards', 'browsersTakePen', 'someoneNeedsComponents', 'html5SaysIt', 'documentComesBack'],
  'Presentation': ['presentationLeavesHome', 'needOutrunsStandards', 'cssOne', 'browsersAgree', 'wiredRedesign', 'zenGarden', 'cssTwoOne', 'someoneNeedsComponents'],
  'Dynamic Interaction': ['behaviorBorn', 'ecmaScript', 'pageBecomesApplication', 'esFive', 'frameworks', 'someoneNeedsComponents', 'documentComesBack']
};

export const concernsOf = (key: MomentKey): string =>
  concernsInOrder.filter(concern => fromTheRecord[concern].includes(key)).join(', ');

export const concernId = (concern: Concern): string => concern.toLowerCase().split(' ').join('-');
