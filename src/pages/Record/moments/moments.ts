const ordered = <const Keys extends readonly string[]>(keys: Keys): Keys => keys;

export const inOrder = ordered([
  'need',
  'structureArrives',
  'webGoesPublic',
  'presentationLeavesHome',
  'cascadeSettlement',
  'behaviorBorn',
  'htmlTwo',
  'needOutrunsStandards',
  'browsersAgree',
  'zenGarden',
  'browsersTakePen',
  'pageBecomesApplication',
  'someoneNeedsComponents',
  'html5SaysIt',
  'documentComesBack'
]);

export type MomentKey = typeof inOrder[number];

export type MomentHeading = {year: string; title: string; id: string};

const named = (year: string, title: string): MomentHeading =>
  ({year, title, id: title.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').join('-')});

export const moments: Record<MomentKey, MomentHeading> = {
  need: named('1989', 'Someone needs something'),
  structureArrives: named('1990', 'Researchers need to collaborate'),
  webGoesPublic: named('1991', 'The web needs the public'),
  presentationLeavesHome: named('1994', 'Authors need control of the look'),
  cascadeSettlement: named('1994', 'Author and reader need a referee'),
  behaviorBorn: named('1995', 'Pages need to respond'),
  htmlTwo: named('1995', 'The browsers’ tags need a standard'),
  needOutrunsStandards: named('1996', 'The need outruns the standards'),
  browsersAgree: named('1998', 'The browsers need to agree'),
  zenGarden: named('2003', 'The separation needs proof'),
  browsersTakePen: named('2004', 'The standard needs the real world'),
  pageBecomesApplication: named('2005', 'The page needs to update in place'),
  someoneNeedsComponents: named('2013', 'Someone needs components'),
  html5SaysIt: named('2014', 'The philosophy needs writing down'),
  documentComesBack: named('2016', 'The document needs to come first')
};
