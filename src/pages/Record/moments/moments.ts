const ordered = <const Keys extends readonly string[]>(keys: Keys): Keys => keys;

export const inOrder = ordered([
  'need',
  'structureArrives',
  'webGoesPublic',
  'presentationLeavesHome',
  'behaviorBorn',
  'htmlTwo',
  'needOutrunsStandards',
  'cssOne',
  'ecmaScript',
  'browsersAgree',
  'wiredRedesign',
  'zenGarden',
  'browsersTakePen',
  'pageBecomesApplication',
  'esFive',
  'frameworks',
  'cssTwoOne',
  'someoneNeedsComponents',
  'html5SaysIt',
  'documentComesBack'
]);

export type MomentKey = typeof inOrder[number];

export const doorsInOrder = ['Structure', 'Presentation', 'Dynamic Interaction'] as const;

export type Door = typeof doorsInOrder[number];

export const fromTheRecord: Record<Door, readonly MomentKey[]> = {
  'Structure': ['need', 'structureArrives', 'webGoesPublic', 'htmlTwo', 'needOutrunsStandards', 'browsersTakePen', 'someoneNeedsComponents', 'html5SaysIt', 'documentComesBack'],
  'Presentation': ['presentationLeavesHome', 'needOutrunsStandards', 'cssOne', 'browsersAgree', 'wiredRedesign', 'zenGarden', 'cssTwoOne', 'someoneNeedsComponents'],
  'Dynamic Interaction': ['behaviorBorn', 'ecmaScript', 'pageBecomesApplication', 'esFive', 'frameworks', 'someoneNeedsComponents', 'documentComesBack']
};

export const doorsOf = (key: MomentKey): string =>
  doorsInOrder.filter(door => fromTheRecord[door].includes(key)).join(', ');

export type MomentHeading = {year: string; title: string; id: string; date?: string};

const named = (year: string, title: string, date?: string): MomentHeading =>
  ({year, title, date, id: title.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').join('-')});

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const monthOf = (date: string): string => months[Number(date.split('-')[1]) - 1];

export const moments: Record<MomentKey, MomentHeading> = {
  need: named('1989', 'Someone needs something'),
  structureArrives: named('1990', 'Researchers need to collaborate'),
  webGoesPublic: named('1991', 'The web needs the public'),
  presentationLeavesHome: named('1994', 'Authors need control of the look'),
  behaviorBorn: named('1995', 'Pages need to respond', '1995-05'),
  htmlTwo: named('1995', 'The browsers’ tags need a standard', '1995-11'),
  needOutrunsStandards: named('1996', 'The need outruns the standards', '1996-08'),
  cssOne: named('1996', 'The style sheet needs a standard', '1996-12-17'),
  ecmaScript: named('1997', 'The language needs a standard'),
  browsersAgree: named('1998', 'The browsers need to agree'),
  wiredRedesign: named('2002', 'Someone needs to go first'),
  zenGarden: named('2003', 'The separation needs proof'),
  browsersTakePen: named('2004', 'The standard needs the real world'),
  pageBecomesApplication: named('2005', 'The page needs to update in place'),
  esFive: named('2009', 'The standard needs to move again'),
  frameworks: named('2010', 'The application needs a frame'),
  cssTwoOne: named('2011', 'The specification needs its tests'),
  someoneNeedsComponents: named('2013', 'Someone needs components'),
  html5SaysIt: named('2014', 'The philosophy needs writing down'),
  documentComesBack: named('2016', 'The document needs to come first')
};
