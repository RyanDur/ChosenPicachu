import {FC} from 'react';
import {some} from '@ryandur/sand';
import {
  BehaviorBorn,
  BrowsersAgree,
  BrowsersTakePen,
  ConcernsInTheYear,
  ConstantsNeedHome,
  CssOne,
  CssTwoOne,
  DefaultsAgree,
  DocumentComesBack,
  EcmaScript,
  ElementsArrive,
  EsFive,
  Frameworks,
  FullerStory,
  Html5SaysIt,
  HtmlTwo,
  MomentInBrief,
  Need,
  NeedOutrunsStandards,
  OneDirection,
  PageBecomesApplication,
  PresentationLeavesHome,
  SomeoneNeedsComponents,
  spelled,
  StructureArrives,
  WebGoesPublic,
  WiredRedesign,
  ZenGarden
} from './moments';
import {MomentKey, moments, SharedYear} from './calendar';
import {concerns} from './concerns';

const momentComponents: Record<MomentKey, FC> = {
  need: Need,
  structureArrives: StructureArrives,
  webGoesPublic: WebGoesPublic,
  presentationLeavesHome: PresentationLeavesHome,
  behaviorBorn: BehaviorBorn,
  htmlTwo: HtmlTwo,
  needOutrunsStandards: NeedOutrunsStandards,
  cssOne: CssOne,
  ecmaScript: EcmaScript,
  browsersAgree: BrowsersAgree,
  wiredRedesign: WiredRedesign,
  zenGarden: ZenGarden,
  browsersTakePen: BrowsersTakePen,
  pageBecomesApplication: PageBecomesApplication,
  defaultsAgree: DefaultsAgree,
  esFive: EsFive,
  frameworks: Frameworks,
  cssTwoOne: CssTwoOne,
  someoneNeedsComponents: SomeoneNeedsComponents,
  oneDirection: OneDirection,
  html5SaysIt: Html5SaysIt,
  documentComesBack: DocumentComesBack,
  constantsNeedHome: ConstantsNeedHome,
  elementsArrive: ElementsArrive
};

type Entry = {readonly kind: 'moment'; readonly key: MomentKey}
  | {
    readonly kind: 'shared year';
    readonly year: string;
    readonly momentsInTheYear: readonly MomentKey[];
    readonly sharedYear: SharedYear;
  };

const entries = moments.inOrder.reduce<readonly Entry[]>((entriesSoFar, key) => {
  const {date} = moments.headings[key];
  if (date.kind === 'year') return [...entriesSoFar, {kind: 'moment', key}];
  const {year} = date;
  return entriesSoFar.some(entry => entry.kind === 'shared year' && entry.year === year)
    ? entriesSoFar
    : [...entriesSoFar, {
      kind: 'shared year',
      year,
      momentsInTheYear: moments.inOrder.filter(other => moments.headings[other].date.year === year),
      sharedYear: moments.sharedYears[year]
    }];
}, []);

const TimelineMoment: FC<{moment: MomentKey}> = ({moment}) => {
  const MomentComponent = momentComponents[moment];
  return <MomentComponent/>;
};

const momentCount = moments.inOrder.length;

const momentCountInWords = spelled.out(momentCount).orElse(String(momentCount));

const lowercased = (title: string): string => `${title.charAt(0).toLowerCase()}${title.slice(1)}`;

const joinedTitle = ([first, ...rest]: readonly string[]): string => [first, ...rest.map(lowercased)].join(', and ');

const SharedYearFold: FC<{year: string; momentsInTheYear: readonly MomentKey[]; sharedYear: SharedYear}> = ({
  year,
  momentsInTheYear,
  sharedYear: {inBrief}
}) => {
  const heading = joinedTitle(momentsInTheYear.map(key => moments.headings[key].title));
  return <li className="moment trim-rail-along">
    <time dateTime={year} className="year caption bold">{year}</time>
    <h3 className="moment-title sub-title void-dot-before">{heading}</h3>
    <MomentInBrief>{inBrief}</MomentInBrief>
    <FullerStory>
      <ol className="moments-of-a-year timeline" aria-label={year}>
        {momentsInTheYear.map(key =>
          <ConcernsInTheYear.Provider key={key} value={some(concerns.ofMoment(key))}>
            <TimelineMoment moment={key}/>
          </ConcernsInTheYear.Provider>)}
      </ol>
    </FullerStory>
  </li>;
};

export const Timeline: FC = () =>
  <section className="record trim-rule-above" aria-labelledby="the-record">
    <h2 className="record-title title" id="the-record">How the web got its languages</h2>
    <ol className="timeline" aria-label="the timeline">
      {entries.map(entry => entry.kind === 'moment'
        ? <TimelineMoment key={entry.key} moment={entry.key}/>
        : <SharedYearFold key={entry.year} year={entry.year}
          momentsInTheYear={entry.momentsInTheYear} sharedYear={entry.sharedYear}/>)}
    </ol>
    <p className="sub-title">
      Read the titles again, top to bottom: it is one sentence said {momentCountInWords} ways. Someone
      needs something, the community answers, and the platform learns the answer. The concert below reads the moments
      together.
    </p>
  </section>;
