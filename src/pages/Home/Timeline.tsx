import {FC} from 'react';
import {Need} from './record/Need';
import {StructureArrives} from './record/StructureArrives';
import {PresentationLeavesHome} from './record/PresentationLeavesHome';
import {CascadeSettlement} from './record/CascadeSettlement';
import {BehaviorBorn} from './record/BehaviorBorn';
import {Blur} from './record/Blur';
import {CorrectionGrinds} from './record/CorrectionGrinds';
import {ZenGarden} from './record/ZenGarden';
import {BrowsersTakePen} from './record/BrowsersTakePen';
import {PageBecomesApplication} from './record/PageBecomesApplication';
import {BlurReturns} from './record/BlurReturns';
import {Html5SaysIt} from './record/Html5SaysIt';
import {DocumentComesBack} from './record/DocumentComesBack';
import {ThisSite} from './record/ThisSite';

export const Timeline: FC = () =>
  <section className="record" aria-label="the history">
    <h2 className="record-title">How the web got its languages</h2>
    <ol className="timeline" aria-label="the timeline">
      <Need/>
      <StructureArrives/>
      <PresentationLeavesHome/>
      <CascadeSettlement/>
      <BehaviorBorn/>
      <Blur/>
      <CorrectionGrinds/>
      <ZenGarden/>
      <BrowsersTakePen/>
      <PageBecomesApplication/>
      <BlurReturns/>
      <Html5SaysIt/>
      <DocumentComesBack/>
      <ThisSite/>
    </ol>
  </section>;
