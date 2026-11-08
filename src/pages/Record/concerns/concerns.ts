import {MomentKey} from '../calendar';

const inOrder = ['Structure', 'Presentation', 'Behavior'] as const;

export type Concern = typeof inOrder[number];

const momentsByConcern: Record<Concern, readonly MomentKey[]> = {
  'Structure': ['need', 'structureArrives', 'webGoesPublic', 'htmlTwo', 'needOutrunsStandards', 'browsersTakePen', 'someoneNeedsComponents', 'html5SaysIt', 'documentComesBack', 'elementsArrive'],
  'Presentation': ['presentationLeavesHome', 'needOutrunsStandards', 'cssOne', 'browsersAgree', 'wiredRedesign', 'zenGarden', 'defaultsAgree', 'cssTwoOne', 'someoneNeedsComponents', 'constantsNeedHome'],
  'Behavior': ['behaviorBorn', 'ecmaScript', 'pageBecomesApplication', 'esFive', 'frameworks', 'someoneNeedsComponents', 'oneDirection', 'documentComesBack']
};

const ofMoment = (key: MomentKey): string =>
  inOrder.filter(concern => momentsByConcern[concern].includes(key)).join(', ');

const idOf = (concern: Concern): string => concern.toLowerCase().split(' ').join('-');

export const concerns = {inOrder, momentsByConcern, ofMoment, idOf};
