import {maybe} from '@ryandur/sand';

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

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type MomentDate =
  | {readonly kind: 'year'; readonly year: string}
  | {readonly kind: 'month'; readonly year: string; readonly month: Month}
  | {readonly kind: 'day'; readonly year: string; readonly month: Month; readonly day: number};

export type Dated = Exclude<MomentDate, {kind: 'year'}>;

export type MomentHeading = {date: MomentDate; title: string; id: string};

export type Written =
  | {readonly year: string; readonly month?: never; readonly day?: never}
  | {readonly year: string; readonly month: Month; readonly day?: never}
  | {readonly year: string; readonly month: Month; readonly day: number};

const dateOf = ({year, month, day}: Written): MomentDate => maybe(month).either(
  (inMonth): MomentDate => maybe(day).either(
    (onDay): MomentDate => ({kind: 'day', year, month: inMonth, day: onDay}),
    (): MomentDate => ({kind: 'month', year, month: inMonth})),
  (): MomentDate => ({kind: 'year', year}));

const named = (written: Written, title: string): MomentHeading =>
  ({date: dateOf(written), title, id: title.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').join('-')});

const twoDigits = (part: number): string => String(part).padStart(2, '0');

export const writtenAs = (date: MomentDate): string => {
  switch (date.kind) {
    case 'year': return date.year;
    case 'month': return `${date.year}-${twoDigits(date.month)}`;
    case 'day': return `${date.year}-${twoDigits(date.month)}-${twoDigits(date.day)}`;
  }
};

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const monthOf = (date: Dated): string => months[date.month - 1];

export const moments: Record<MomentKey, MomentHeading> = {
  need: named({year: '1989'}, 'CERN needs to share what it knows'),
  structureArrives: named({year: '1990'}, 'The information needs one interface'),
  webGoesPublic: named({year: '1991'}, 'The web needs collaborators'),
  presentationLeavesHome: named({year: '1994'}, 'Authors need control of the look'),
  behaviorBorn: named({year: '1995', month: 5}, 'Pages need to respond'),
  htmlTwo: named({year: '1995', month: 11}, 'The browsers’ tags need a standard'),
  needOutrunsStandards: named({year: '1996', month: 8}, 'The pages need to look the same'),
  cssOne: named({year: '1996', month: 12, day: 17}, 'The style sheet needs a standard'),
  ecmaScript: named({year: '1997'}, 'The language needs a standard'),
  browsersAgree: named({year: '1998'}, 'The browsers need to agree'),
  wiredRedesign: named({year: '2002'}, 'Someone needs to go first'),
  zenGarden: named({year: '2003'}, 'The separation needs proof'),
  browsersTakePen: named({year: '2004'}, 'The standard needs the real world'),
  pageBecomesApplication: named({year: '2005'}, 'The page needs to update in place'),
  esFive: named({year: '2009'}, 'The standard needs to move again'),
  frameworks: named({year: '2010'}, 'The application needs a frame'),
  cssTwoOne: named({year: '2011'}, 'The specification needs its tests'),
  someoneNeedsComponents: named({year: '2013'}, 'Someone needs components'),
  html5SaysIt: named({year: '2014'}, 'The rules need writing down'),
  documentComesBack: named({year: '2016'}, 'The document needs to come first')
};

export type YearOfTwo = {
  readonly tells: string;
};

export const yearsOfTwo: Partial<Record<string, YearOfTwo>> = {
  '1995': {
    tells: 'Two concerns moved in 1995. At Netscape, Brendan Eich wrote the interpreter for a scripting language in about ten days, a glue language for web designers beside Java for the components, and the page could respond. At the IETF, the first HTML standard was written after the fact: HTML 2.0, published in November, is the set of tags the browsers already used, collected and defined, because each browser had added its own and the language was becoming ill-defined.'
  },
  '1996': {
    tells: 'Two concerns moved in 1996. Markup still carried presentation because nothing else could, Netscape’s tags multiplied the dialects, and in Navigator 4, which came the next year, CSS itself ran as JavaScript. The same year CSS level 1 became a W3C Recommendation, the first standard for the look, ahead of every browser and set to stay ahead for years.'
  }
};
