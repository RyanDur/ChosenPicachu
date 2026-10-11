import {FC} from 'react';
import {Quotation} from '@components/Quotation';
import {Need} from './moments/Need';
import {StructureArrives} from './moments/StructureArrives';
import {PresentationLeavesHome} from './moments/PresentationLeavesHome';
import {CascadeSettlement} from './moments/CascadeSettlement';
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
import {inOrder, MomentKey} from './moments/moments';

const stories: Record<MomentKey, FC> = {
  need: Need,
  structureArrives: StructureArrives,
  webGoesPublic: WebGoesPublic,
  presentationLeavesHome: PresentationLeavesHome,
  cascadeSettlement: CascadeSettlement,
  behaviorBorn: BehaviorBorn,
  htmlTwo: HtmlTwo,
  needOutrunsStandards: NeedOutrunsStandards,
  browsersAgree: BrowsersAgree,
  zenGarden: ZenGarden,
  browsersTakePen: BrowsersTakePen,
  pageBecomesApplication: PageBecomesApplication,
  someoneNeedsComponents: SomeoneNeedsComponents,
  html5SaysIt: Html5SaysIt,
  documentComesBack: DocumentComesBack
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
      {inOrder.map(key => {
        const Story = stories[key];
        return <Story key={key}/>;
      })}
    </ol>
    <p className="sub-title">
      Read the titles again, top to bottom: it is one sentence said fifteen ways. Someone
      needs something, the community answers, and the platform learns the answer. That
      feedback loop built an ecosystem where elegant solutions keep coming from places no
      specification thought to look. And the needs have not stopped arriving.
    </p>
  </section>;
