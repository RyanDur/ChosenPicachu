import {FC} from 'react';
import {useLocation} from 'react-router';
import {some} from '@ryandur/sand';
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
import {doorsOf, inOrder, MomentKey, moments} from './moments/moments';
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

const yearsOfTwo: Record<string, {readonly title: string; readonly tells: string}> = {
  '1995': {
    title: 'Pages need to respond, and the browsers’ tags need a standard',
    tells: 'Two doors moved in 1995. At Netscape, Brendan Eich wrote the interpreter for a scripting language in about ten days, a glue language for web designers beside Java for the components, and the page could respond. At the IETF, the first HTML standard was written after the fact: HTML 2.0, published in November, is the set of tags the browsers already used, collected and defined, because each browser had added its own and the language was becoming ill-defined.'
  },
  '1996': {
    title: 'The need outruns the standards, and the style sheet needs a standard',
    tells: 'Two doors moved in 1996. Markup still carried presentation because nothing else could, Netscape’s tags multiplied the dialects, and in Navigator 4 CSS itself ran as JavaScript. The same year CSS level 1 became a W3C Recommendation, the first standard for the look, ahead of every browser and set to stay ahead for years.'
  }
};

const byYear = inOrder.reduce<readonly (readonly MomentKey[])[]>((years, key) => {
  const last = years[years.length - 1] ?? [];
  return last.length > 0 && moments[last[0]].year === moments[key].year
    ? [...years.slice(0, -1), [...last, key]]
    : [...years, [key]];
}, []);

const Story: FC<{of: MomentKey}> = ({of}) => {
  const Told = stories[of];
  return <Told/>;
};

const Year: FC<{keys: readonly MomentKey[]}> = ({keys}) => {
  const {hash} = useLocation();
  const {year} = moments[keys[0]];
  const {title, tells} = yearsOfTwo[year];
  return <li className="moment trim-rail-along">
    <time dateTime={year} className="year caption bold">{year}</time>
    <h3 className="beat-title sub-title void-dot-before">{title}</h3>
    <p className="beat-tells paragraph muted-ink hyphenated">{tells}</p>
    <details className="fuller-story" name="record" open={keys.some(key => hash === `#${moments[key].id}`) || undefined}>
      <summary className="prompt caption">the fuller story</summary>
      <ol className="moments-of-a-year timeline" aria-label={year}>
        {keys.map(key =>
          <DoorsInTheYear.Provider key={key} value={some(doorsOf(key))}>
            <Story of={key}/>
          </DoorsInTheYear.Provider>)}
      </ol>
    </details>
  </li>;
};

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
      Someone needed something: researchers, scattered across institutes, losing each other’s
      documents. Everything on the web is layered onto that one need.
    </p>
    <ol className="timeline" aria-label="the timeline">
      {byYear.map(keys => keys.length === 1
        ? <Story key={keys[0]} of={keys[0]}/>
        : <Year key={moments[keys[0]].year} keys={keys}/>)}
    </ol>
    <p className="sub-title">
      Read the titles again, top to bottom: it is one sentence said {spelledOut(inOrder.length)} ways. Someone
      needs something, the community answers, and the platform learns the answer. The needs have not stopped arriving.
    </p>
  </section>;
