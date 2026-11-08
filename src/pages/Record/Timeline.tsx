import {FC} from 'react';
import {maybe, some} from '@ryandur/sand';
import {
  Need, StructureArrives, PresentationLeavesHome, BehaviorBorn, NeedOutrunsStandards, BrowsersAgree, ZenGarden,
  BrowsersTakePen, PageBecomesApplication, SomeoneNeedsComponents, Html5SaysIt, OneDirection, DocumentComesBack,
  WebGoesPublic, HtmlTwo, CssOne, WiredRedesign, CssTwoOne, EcmaScript, EsFive, DefaultsAgree, ConstantsNeedHome,
  ElementsArrive, Frameworks, concerns, ConcernsInTheYear, MomentKey, moments, SharedYear, spelled
} from './moments';

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
  | {readonly kind: 'year'; readonly year: string; readonly moments: readonly MomentKey[]; readonly sharedYear: SharedYear};

const entries = moments.inOrder.reduce<readonly Entry[]>((entriesSoFar, key) => {
  const {year} = moments.headings[key].date;
  return maybe(moments.sharedYears[year]).either(
    (sharedYear): readonly Entry[] => entriesSoFar.some(entry => entry.kind === 'year' && entry.year === year)
      ? entriesSoFar
      : [...entriesSoFar, {
        kind: 'year', year, moments: moments.inOrder.filter(other => moments.headings[other].date.year === year), sharedYear
      }],
    (): readonly Entry[] => [...entriesSoFar, {kind: 'moment', key}]);
}, []);

const Story: FC<{moment: MomentKey}> = ({moment}) => {
  const MomentComponent = momentComponents[moment];
  return <MomentComponent/>;
};

const lowercased = (title: string): string => `${title.charAt(0).toLowerCase()}${title.slice(1)}`;

const joinedTitle = ([first, ...rest]: readonly string[]): string => [first, ...rest.map(lowercased)].join(', and ');

const Year: FC<{year: string; moments: readonly MomentKey[]; sharedYear: SharedYear}> = ({
  year, moments: inTheYear, sharedYear: {summary}
}) =>
  <li className="moment trim-rail-along">
    <time dateTime={year} className="year caption bold">{year}</time>
    <h3 className="moment-title sub-title void-dot-before">{joinedTitle(inTheYear.map(key => moments.headings[key].title))}</h3>
    <p className="moment-summary paragraph muted-ink hyphenated">{summary}</p>
    <details className="fuller-story" name="record">
      <summary className="prompt caption">the fuller story</summary>
      <ol className="moments-of-a-year timeline" aria-label={year}>
        {inTheYear.map(key =>
          <ConcernsInTheYear.Provider key={key} value={some(concerns.ofMoment(key))}>
            <Story moment={key}/>
          </ConcernsInTheYear.Provider>)}
      </ol>
    </details>
  </li>;

export const Timeline: FC = () =>
  <section className="record trim-rule-above" aria-labelledby="the-record">
    <h2 className="record-title title" id="the-record">How the web got its languages</h2>
    <ol className="timeline" aria-label="the timeline">
      {entries.map(entry => entry.kind === 'moment'
        ? <Story key={entry.key} moment={entry.key}/>
        : <Year key={entry.year} year={entry.year} moments={entry.moments} sharedYear={entry.sharedYear}/>)}
    </ol>
    <p className="sub-title">
      Read the titles again, top to bottom: it is one sentence said {spelled.out(moments.inOrder.length)} ways. Someone
      needs something, the community answers, and the platform learns the answer. The concert below reads the moments
      together.
    </p>
  </section>;
