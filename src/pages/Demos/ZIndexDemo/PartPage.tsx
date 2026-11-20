import {FC, ReactNode, useId} from 'react';
import {classNames} from '@components';
import {demoTab, DemoTopics} from '@pages/Demos';
import {ZIndexPart, zIndexParts} from './part-pages';
import {PartFoot} from './PartFoot';
import {WhyThirdIsOnTop} from './WhyThirdIsOnTop';
import {Why9999StillLoses} from './Why9999StillLoses';
import {WhatElseFormsAStackingContext} from './WhatElseFormsAStackingContext';
import {WhyThePopoverWins} from './WhyThePopoverWins';
import {WhyAFixedBannerStillLoses} from './WhyAFixedBannerStillLoses';
import {LetsBuildThisFeature} from './LetsBuildThisFeature';
import {WhyThirdIsOnTopIntroduction} from './WhyThirdIsOnTopIntroduction';
import {Why9999StillLosesIntroduction} from './Why9999StillLosesIntroduction';
import {WhatElseFormsAStackingContextIntroduction} from './WhatElseFormsAStackingContextIntroduction';
import {WhyThePopoverWinsIntroduction} from './WhyThePopoverWinsIntroduction';
import {WhyAFixedBannerStillLosesIntroduction} from './WhyAFixedBannerStillLosesIntroduction';
import {LetsBuildThisFeatureIntroduction} from './LetsBuildThisFeatureIntroduction';
import {PartsAndMinutes} from './PartsAndMinutes';
import '../PartPage.css';

type PartWriting = {
  readonly introduction: ReactNode;
  readonly exhibitAndRuns: ReactNode;
};

const partWritings: Record<ZIndexPart, PartWriting> = {
  'why-third-is-on-top': {introduction: <WhyThirdIsOnTopIntroduction/>, exhibitAndRuns: <WhyThirdIsOnTop/>},
  'why-9999-still-loses': {introduction: <Why9999StillLosesIntroduction/>, exhibitAndRuns: <Why9999StillLoses/>},
  'what-else-forms-a-stacking-context': {introduction: <WhatElseFormsAStackingContextIntroduction/>, exhibitAndRuns: <WhatElseFormsAStackingContext/>},
  'why-the-popover-wins': {introduction: <WhyThePopoverWinsIntroduction/>, exhibitAndRuns: <WhyThePopoverWins/>},
  'why-a-fixed-banner-still-loses': {introduction: <WhyAFixedBannerStillLosesIntroduction/>, exhibitAndRuns: <WhyAFixedBannerStillLoses/>},
  'lets-build-this-feature': {introduction: <LetsBuildThisFeatureIntroduction/>, exhibitAndRuns: <LetsBuildThisFeature/>}
};

const partWears: Partial<Record<ZIndexPart, string>> = {'lets-build-this-feature': 'tutorials'};

export const PartPage: FC<{readonly part: ZIndexPart}> = ({part}) => {
  const titled = `part${useId()}`;
  const {name, ordinal} = zIndexParts.told(part);
  return <>
    <header className="part-opening">
      <hgroup>
        <p className="caption">{`${demoTab.names[DemoTopics.zIndex]} · part ${ordinal} of ${zIndexParts.inTheBook}`}</p>
        <h2 id={titled} className="title">{name}</h2>
      </hgroup>
      {partWritings[part].introduction}
    </header>
    <PartsAndMinutes/>
    <section aria-labelledby={titled} className={classNames('part-page', partWears[part])}>
      {partWritings[part].exhibitAndRuns}
      <PartFoot part={part}/>
    </section>
  </>;
};
