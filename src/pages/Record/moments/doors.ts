import {MomentKey} from './moments';

export const doorsInOrder = ['Structure', 'Presentation', 'Dynamic Interaction'] as const;

export type Door = typeof doorsInOrder[number];

export const fromTheRecord: Record<Door, readonly MomentKey[]> = {
  'Structure': ['need', 'structureArrives', 'webGoesPublic', 'htmlTwo', 'needOutrunsStandards', 'browsersTakePen', 'someoneNeedsComponents', 'html5SaysIt', 'documentComesBack'],
  'Presentation': ['presentationLeavesHome', 'needOutrunsStandards', 'cssOne', 'browsersAgree', 'wiredRedesign', 'zenGarden', 'cssTwoOne', 'someoneNeedsComponents'],
  'Dynamic Interaction': ['behaviorBorn', 'ecmaScript', 'pageBecomesApplication', 'esFive', 'frameworks', 'someoneNeedsComponents', 'documentComesBack']
};

export const doorsOf = (key: MomentKey): string =>
  doorsInOrder.filter(door => fromTheRecord[door].includes(key)).join(', ');

export const doorId = (door: Door): string => door.toLowerCase().split(' ').join('-');
