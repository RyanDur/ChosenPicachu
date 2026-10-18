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

export type MomentHeading = {date: string; year: string; title: string; id: string};

const named = (date: string, title: string): MomentHeading =>
  ({date, year: date.split('-')[0], title, id: title.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').join('-')});

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const monthOf = (date: string): string => months[Number(date.split('-')[1]) - 1];

export const moments: Record<MomentKey, MomentHeading> = {
  need: named('1989', 'Someone needs something'),
  structureArrives: named('1990', 'Researchers need to collaborate'),
  webGoesPublic: named('1991', 'The web needs the public'),
  presentationLeavesHome: named('1994', 'Authors need control of the look'),
  behaviorBorn: named('1995-05', 'Pages need to respond'),
  htmlTwo: named('1995-11', 'The browsers’ tags need a standard'),
  needOutrunsStandards: named('1996-08', 'The need outruns the standards'),
  cssOne: named('1996-12-17', 'The style sheet needs a standard'),
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

export type YearOfTwo = {
  readonly title: string;
  readonly tells: string;
};

export const yearsOfTwo: Partial<Record<string, YearOfTwo>> = {
  '1995': {
    title: 'Pages need to respond, and the browsers’ tags need a standard',
    tells: 'Two doors moved in 1995. At Netscape, Brendan Eich wrote the interpreter for a scripting language in about ten days, a glue language for web designers beside Java for the components, and the page could respond. At the IETF, the first HTML standard was written after the fact: HTML 2.0, published in November, is the set of tags the browsers already used, collected and defined, because each browser had added its own and the language was becoming ill-defined.'
  },
  '1996': {
    title: 'The need outruns the standards, and the style sheet needs a standard',
    tells: 'Two doors moved in 1996. Markup still carried presentation because nothing else could, Netscape’s tags multiplied the dialects, and in Navigator 4 CSS itself ran as JavaScript. The same year CSS level 1 became a W3C Recommendation, the first standard for the look, ahead of every browser and set to stay ahead for years.'
  }
};
