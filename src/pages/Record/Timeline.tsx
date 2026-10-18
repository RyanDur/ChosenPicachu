import {FC} from 'react';
import {maybe, some} from '@ryandur/sand';
import {Quotation} from '@components/Quotation';
import {Need} from './moments/Need';
import {StructureArrives} from './moments/StructureArrives';
import {PresentationLeavesHome} from './moments/PresentationLeavesHome';
import {BehaviorBorn} from './moments/BehaviorBorn';
import {NeedOutrunsStandards} from './moments/NeedOutrunsStandards';
import {BrowsersAgree} from './moments/BrowsersAgree';
import {ZenGarden} from './moments/ZenGarden';
import {BrowsersTakePen} from './moments/BrowsersTakePen';
import {PageBecomesApplication} from './moments/PageBecomesApplication';
import {SomeoneNeedsComponents} from './moments/SomeoneNeedsComponents';
import {Html5SaysIt} from './moments/Html5SaysIt';
import {DocumentComesBack} from './moments/DocumentComesBack';
import {WebGoesPublic} from './moments/WebGoesPublic';
import {HtmlTwo} from './moments/HtmlTwo';
import {CssOne} from './moments/CssOne';
import {WiredRedesign} from './moments/WiredRedesign';
import {CssTwoOne} from './moments/CssTwoOne';
import {EcmaScript} from './moments/EcmaScript';
import {EsFive} from './moments/EsFive';
import {Frameworks} from './moments/Frameworks';
import {inOrder, MomentKey, moments, YearOfTwo, yearsOfTwo} from './moments/moments';
import {doorsOf} from './moments/doors';
import {DoorsInTheYear} from './moments/Moment';
import {spelledOut} from './moments/spelled-out';

const stories: Record<MomentKey, FC> = {
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
  esFive: EsFive,
  frameworks: Frameworks,
  cssTwoOne: CssTwoOne,
  someoneNeedsComponents: SomeoneNeedsComponents,
  html5SaysIt: Html5SaysIt,
  documentComesBack: DocumentComesBack
};

type Entry = {readonly kind: 'moment'; readonly key: MomentKey} | {readonly kind: 'year'; readonly year: string; readonly of: readonly MomentKey[]; readonly told: YearOfTwo};

const entries = inOrder.reduce<readonly Entry[]>((told, key) => {
  const {year} = moments[key].date;
  return maybe(yearsOfTwo[year]).either(
    (ofTwo): readonly Entry[] => told.some(entry => entry.kind === 'year' && entry.year === year) ? told : [...told, {kind: 'year', year, of: inOrder.filter(other => moments[other].date.year === year), told: ofTwo}],
    (): readonly Entry[] => [...told, {kind: 'moment', key}]);
}, []);

const Story: FC<{of: MomentKey}> = ({of}) => {
  const Told = stories[of];
  return <Told/>;
};

const lowercased = (title: string): string => `${title.charAt(0).toLowerCase()}${title.slice(1)}`;

const joinedTitle = ([first, ...rest]: readonly string[]): string => [first, ...rest.map(lowercased)].join(', and ');

const Year: FC<{year: string; of: readonly MomentKey[]; told: YearOfTwo}> = ({year, of, told: {tells}}) =>
  <li className="moment trim-rail-along">
    <time dateTime={year} className="year caption bold">{year}</time>
    <h3 className="beat-title sub-title void-dot-before">{joinedTitle(of.map(key => moments[key].title))}</h3>
    <p className="beat-tells paragraph muted-ink hyphenated">{tells}</p>
    <details className="fuller-story" name="record">
      <summary className="prompt caption">the fuller story</summary>
      <ol className="moments-of-a-year timeline" aria-label={year}>
        {of.map(key =>
          <DoorsInTheYear.Provider key={key} value={some(doorsOf(key))}>
            <Story of={key}/>
          </DoorsInTheYear.Provider>)}
      </ol>
    </details>
  </li>;

export const Timeline: FC = () =>
  <section className="record trim-rule-above" aria-labelledby="the-record">
    <h2 className="record-title title" id="the-record">How the web got its languages</h2>
    <Quotation voice="sub-title" source={<>Tim Berners-Lee and Robert Cailliau,{' '}
      <a className="signpost" href="https://www.w3.org/History/19921103-hypertext/hypertext/WWW/Proposal.html">proposing
        the WorldWideWeb, 1990</a></>}>
      HyperText is a way to link and access information of various kinds as a web of nodes
      in which the user can browse at will.
    </Quotation>
    <p className="lede sub-title">
      Someone needed something: several thousand people at CERN, spread across institutes and experiments, who had to share what they knew. Every moment below opens on a need of the same kind, and the concert at the end reads them as one method.
    </p>
    <ol className="timeline" aria-label="the timeline">
      {entries.map(entry => entry.kind === 'moment'
        ? <Story key={entry.key} of={entry.key}/>
        : <Year key={entry.year} year={entry.year} of={entry.of} told={entry.told}/>)}
    </ol>
    <p className="sub-title">
      Read the titles again, top to bottom: it is one sentence said {spelledOut(inOrder.length)} ways. Someone needs something, the community answers, and the platform learns the answer. The concert below reads the moments together.
    </p>
  </section>;
