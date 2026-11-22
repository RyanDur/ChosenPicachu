import {FC, ReactNode} from 'react';
import {PartSection} from '@pages/Demos/PartSection';
import {ThePart} from '@pages/Demos/the-part';
import {PartOpening} from '@pages/Demos/PartOpening';
import {PartPanel} from '@pages/Demos/PartPanel';
import {PartDemo} from '@pages/Demos/PartDemo';
import {Behind, Beside, Onward, PartFoot} from '@pages/Demos/PartFoot';
import {useCarriedAddress} from '@pages/Demos/useCarriedAddress';
import {demoTab, DemoTopics} from '@pages/Demos';
import {ZIndexPart, zIndexParts} from './part-pages';
import {WhyThirdIsOnTop} from './WhyThirdIsOnTop';
import {WhereSecondGoes} from './WhereSecondGoes';
import {Why9999StillLoses} from './Why9999StillLoses';
import {WhatElseFormsAStackingContext} from './WhatElseFormsAStackingContext';
import {WhyThePopoverWins} from './WhyThePopoverWins';
import {WhyAFixedBannerStillLoses} from './WhyAFixedBannerStillLoses';
import {LetsBuildThisFeature} from './LetsBuildThisFeature';
import {WhyThirdIsOnTopIntroduction} from './WhyThirdIsOnTopIntroduction';
import {HowPositionPlacesABoxIntroduction} from './HowPositionPlacesABoxIntroduction';
import {Why9999StillLosesIntroduction} from './Why9999StillLosesIntroduction';
import {WhatElseFormsAStackingContextIntroduction} from './WhatElseFormsAStackingContextIntroduction';
import {WhyThePopoverWinsIntroduction} from './WhyThePopoverWinsIntroduction';
import {WhyAFixedBannerStillLosesIntroduction} from './WhyAFixedBannerStillLosesIntroduction';
import {LetsBuildThisFeatureIntroduction} from './LetsBuildThisFeatureIntroduction';
import {PartsAndMinutes} from './PartsAndMinutes';

type PartWriting = {
  readonly introduction: ReactNode;
  readonly exhibitAndRuns: ReactNode;
};

const partWritings: Record<ZIndexPart, PartWriting> = {
  'why-third-is-on-top': {
    introduction: <WhyThirdIsOnTopIntroduction/>,
    exhibitAndRuns: <WhyThirdIsOnTop/>
  },
  'how-position-places-a-box': {
    introduction: <HowPositionPlacesABoxIntroduction/>,
    exhibitAndRuns: <WhereSecondGoes/>
  },
  'why-9999-still-loses': {
    introduction: <Why9999StillLosesIntroduction/>,
    exhibitAndRuns: <Why9999StillLoses/>
  },
  'what-else-forms-a-stacking-context': {
    introduction: <WhatElseFormsAStackingContextIntroduction/>,
    exhibitAndRuns: <WhatElseFormsAStackingContext/>
  },
  'why-the-popover-wins': {
    introduction: <WhyThePopoverWinsIntroduction/>,
    exhibitAndRuns: <WhyThePopoverWins/>
  },
  'why-a-fixed-banner-still-loses': {
    introduction: <WhyAFixedBannerStillLosesIntroduction/>,
    exhibitAndRuns: <WhyAFixedBannerStillLoses/>
  },
  'lets-build-this-feature': {
    introduction: <LetsBuildThisFeatureIntroduction/>,
    exhibitAndRuns: <LetsBuildThisFeature/>
  }
};

const partWears: Partial<Record<ZIndexPart, string>> = {'lets-build-this-feature': 'tutorials'};

const theFirstPart: Behind = {kind: 'first-part'};
const theNextTab: Onward = {kind: 'tab', topic: DemoTopics.dragAndDrop};

export const PartPage: FC<{readonly part: ZIndexPart}> = ({part}) => {
  const carried = useCarriedAddress();
  const besidePart = (beside: ZIndexPart): Beside =>
    ({kind: 'part', title: zIndexParts.numbered(beside), address: carried(zIndexParts.addressOf(beside))});
  const behind = zIndexParts.previousOf(part).map((beside): Behind => besidePart(beside)).orElse(theFirstPart);
  const onward = zIndexParts.nextOf(part).map((beside): Onward => besidePart(beside)).orElse(theNextTab);
  const {name, ordinal} = zIndexParts.told(part);
  const place = `${demoTab.names[DemoTopics.zIndex]} · part ${ordinal} of ${zIndexParts.inTheBook}`;
  return <ThePart value={{heading: name, headingId: `${part}-heading`, place, previous: behind, next: onward}}>
    <PartSection>
      <PartOpening>{partWritings[part].introduction}</PartOpening>
      <PartPanel><PartsAndMinutes/></PartPanel>
      <PartDemo className={partWears[part]}>{partWritings[part].exhibitAndRuns}</PartDemo>
      <PartFoot/>
    </PartSection>
  </ThePart>;
};
