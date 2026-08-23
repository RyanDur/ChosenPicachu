import {FC} from 'react';
import {Need} from './record/Need';
import {StructureArrives} from './record/StructureArrives';
import {PresentationLeavesHome} from './record/PresentationLeavesHome';
import {CascadeSettlement} from './record/CascadeSettlement';
import {BehaviorBorn} from './record/BehaviorBorn';
import {NeedOutrunsStandards} from './record/NeedOutrunsStandards';
import {BrowsersAgree} from './record/BrowsersAgree';
import {ZenGarden} from './record/ZenGarden';
import {BrowsersTakePen} from './record/BrowsersTakePen';
import {PageBecomesApplication} from './record/PageBecomesApplication';
import {SomeoneNeedsComponents} from './record/SomeoneNeedsComponents';
import {Html5SaysIt} from './record/Html5SaysIt';
import {DocumentComesBack} from './record/DocumentComesBack';

export const Timeline: FC = () =>
  <section className="record" aria-labelledby="the-record">
    <h2 className="record-title" id="the-record">How the web got its languages</h2>
    <p className="thesis paragraph">
      Even the standards changed how they arrive: the CSS working group chose independent
      modules over{' '}
      <a className="signpost" href="https://www.w3.org/TR/css-2023/">“a single monolithic
      specification”</a>, and TC39 ratifies a new ECMAScript{' '}
      <a className="signpost" href="https://tc39.es/process-document/">“in July of each year”</a>.
      The history below is the iteration. The rest of the site is my practice of it.
    </p>
    <figure className="feedback">
      <blockquote>
        <p className="quote">
          HyperText is a way to link and access information of various kinds as a web of nodes
          in which the user can browse at will.
        </p>
      </blockquote>
      <figcaption className="attribution">Tim Berners-Lee and Robert Cailliau,{' '}
        <a className="signpost" href="https://www.w3.org/History/19921103-hypertext/hypertext/WWW/Proposal.html">proposing
        the WorldWideWeb, 1990</a></figcaption>
    </figure>
    <p className="lede paragraph">
      Someone needed something: researchers, scattered across institutes, losing each other’s
      documents. Everything on the web is layered onto that one need.
    </p>
    <ol className="timeline" aria-label="the timeline">
      <Need/>
      <StructureArrives/>
      <PresentationLeavesHome/>
      <CascadeSettlement/>
      <BehaviorBorn/>
      <NeedOutrunsStandards/>
      <BrowsersAgree/>
      <ZenGarden/>
      <BrowsersTakePen/>
      <PageBecomesApplication/>
      <SomeoneNeedsComponents/>
      <Html5SaysIt/>
      <DocumentComesBack/>
    </ol>
    <p className="coda paragraph">
      Read the titles again, top to bottom: it is one sentence said thirteen ways. Someone
      needs something, the community answers, and the platform learns the answer. That
      feedback loop built an ecosystem where elegant solutions keep coming from places no
      specification thought to look. And the needs have not stopped arriving.
    </p>
  </section>;
