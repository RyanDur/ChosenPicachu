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
