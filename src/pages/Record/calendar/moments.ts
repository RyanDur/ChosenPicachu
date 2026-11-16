import {maybe} from '@ryandur/sand';

const inOrder = [
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
  'defaultsAgree',
  'esFive',
  'frameworks',
  'cssTwoOne',
  'someoneNeedsComponents',
  'oneDirection',
  'html5SaysIt',
  'documentComesBack',
  'constantsNeedHome',
  'elementsArrive'
] as const;

export type MomentKey = typeof inOrder[number];

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

type YearDate<Year extends string = string> = {readonly kind: 'year'; readonly year: Year};

type DateWithMonth<Year extends string = string> =
  | {readonly kind: 'month'; readonly year: Year; readonly month: Month}
  | {readonly kind: 'day'; readonly year: Year; readonly month: Month; readonly day: number};

type MomentDate = YearDate | DateWithMonth;

export type YearHeading<Year extends string = string> = {date: YearDate<Year>; title: string; id: string};

export type MonthHeading<Year extends string = string> = {date: DateWithMonth<Year>; title: string; id: string};

type DatedInMonth<Year extends string> = {readonly year: Year; readonly month: Month; readonly day?: number};

const idOf = (title: string): string => title.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').join('-');

const inYear = <const Year extends string>(year: Year, title: string): YearHeading<Year> =>
  ({date: {kind: 'year', year}, title, id: idOf(title)});

const inMonth = <const Year extends string>(
  {year, month, day}: DatedInMonth<Year>,
  title: string
): MonthHeading<Year> => ({
  date: maybe(day).either(
    (onDay): DateWithMonth<Year> => ({kind: 'day', year, month, day: onDay}),
    (): DateWithMonth<Year> => ({kind: 'month', year, month})),
  title,
  id: idOf(title)
});

const twoDigits = (part: number): string => String(part).padStart(2, '0');

const isoDateOf = (date: MomentDate): string => {
  switch (date.kind) {
    case 'year':
      return date.year;
    case 'month':
      return `${date.year}-${twoDigits(date.month)}`;
    case 'day':
      return `${date.year}-${twoDigits(date.month)}-${twoDigits(date.day)}`;
  }
};

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const monthOf = (date: DateWithMonth): string => months[date.month - 1];

const headings = {
  need: inYear('1989', 'CERN needs to share what it knows'),
  structureArrives: inYear('1990', 'The information needs one interface'),
  webGoesPublic: inYear('1991', 'The web needs collaborators'),
  presentationLeavesHome: inYear('1994', 'Authors need control of the look'),
  behaviorBorn: inMonth({year: '1995', month: 5}, 'Pages need to respond'),
  htmlTwo: inMonth({year: '1995', month: 11}, 'The browsers’ tags need a standard'),
  needOutrunsStandards: inMonth({year: '1996', month: 8}, 'The pages need to look the same'),
  cssOne: inMonth({year: '1996', month: 12, day: 17}, 'The style sheet needs a standard'),
  ecmaScript: inYear('1997', 'The language needs a standard'),
  browsersAgree: inYear('1998', 'The browsers need to agree'),
  wiredRedesign: inYear('2002', 'Someone needs to go first'),
  zenGarden: inYear('2003', 'The separation needs proof'),
  browsersTakePen: inYear('2004', 'The standard needs the real world'),
  pageBecomesApplication: inYear('2005', 'The page needs to update in place'),
  defaultsAgree: inYear('2007', 'The defaults need to agree'),
  esFive: inYear('2009', 'The standard needs to move again'),
  frameworks: inYear('2010', 'The application needs a frame'),
  cssTwoOne: inYear('2011', 'The specification needs its tests'),
  someoneNeedsComponents: inYear('2013', 'Someone needs components'),
  oneDirection: inMonth({year: '2014', month: 7}, 'The data needs one direction'),
  html5SaysIt: inMonth({year: '2014', month: 10}, 'The rules need writing down'),
  documentComesBack: inYear('2016', 'The document needs to come first'),
  constantsNeedHome: inYear('2017', 'The constants need a home'),
  elementsArrive: inYear('2025', 'The elements need to arrive')
} satisfies Record<MomentKey, YearHeading | MonthHeading>;

export type SharedYear = {
  readonly inBrief: string;
};

type Headings = typeof headings;

type YearOf<Key extends MomentKey> = Headings[Key]['date']['year'];

type MonthMomentKeys = {[Key in MomentKey]: Headings[Key] extends MonthHeading ? Key : never}[MomentKey];

type YearMomentKeys = Exclude<MomentKey, MonthMomentKeys>;

type YearsOfMonthMoments = YearOf<MonthMomentKeys>;

type YearsOfYearMoments = YearOf<YearMomentKeys>;

type LoneMonthYears = {
  [Key in MonthMomentKeys]: YearOf<Key> extends YearOf<Exclude<MonthMomentKeys, Key>> ? never : YearOf<Key>
}[MonthMomentKeys];

type AMonthMomentNeverStandsAlone = Record<LoneMonthYears, never>;

type AYearMomentNeverJoinsASharedYear = Record<Extract<YearsOfMonthMoments, YearsOfYearMoments>, never>;

type SharedYears = Exclude<Exclude<YearsOfMonthMoments, YearsOfYearMoments>, LoneMonthYears>;

type BriefsOfSharedYears = Record<SharedYears, SharedYear>
  & AMonthMomentNeverStandsAlone
  & AYearMomentNeverJoinsASharedYear;

const sharedYears: BriefsOfSharedYears = {
  '1995': {
    inBrief: 'Two concerns moved in 1995. At Netscape, Brendan Eich wrote the interpreter for a scripting language in about ten days, a glue language for web designers beside Java for the components, and the page could respond. At the IETF, the first HTML standard was written after the fact: HTML 2.0, published in November, is the set of tags the browsers already used, collected and defined, because each browser had added its own and the language was becoming ill-defined.'
  },
  '1996': {
    inBrief: 'Two concerns moved in 1996. Markup still carried presentation because nothing else could, Netscape’s tags multiplied the dialects, and in Navigator 4, which came the next year, CSS itself ran as JavaScript. In December 1996 CSS level 1 became a W3C Recommendation, the first standard for the look, ahead of every browser and set to stay ahead for years.'
  },
  '2014': {
    inBrief: 'Two concerns moved in 2014. In July Flux’s code went public. Flux is a pattern in which data moves one way through a page instead of binding both ways. In October HTML5 became a W3C Recommendation, and the rules the browsers had been following were written down.'
  }
};

export const moments = {inOrder, headings, sharedYears, isoDateOf, monthOf};
