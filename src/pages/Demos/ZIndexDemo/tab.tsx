import {FC, ReactNode, useEffect} from 'react';
import {bannerChange, useBannerDispatch} from '@banners';
import {useControls} from '../Controls';
import {TabSidecar} from '../TabSidecar';
import {PartsIndex} from './PartsIndex';
import {ZIndexIntroduction} from './Introduction';
import {NaturalZIndex} from './NaturalZIndex';
import {PartPage} from './PartPage';
import {ZIndexPart} from './part-pages';
import {useShownPart} from './useShownPart';
import {WhyThirdIsOnTop} from './WhyThirdIsOnTop';
import {ZIndexSize} from './ZIndexSize';
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

const usePlacingTheBanners = (): void => {
  const {side, align, enter, stack} = useControls();
  const dispatchBanner = useBannerDispatch();

  useEffect(() => dispatchBanner(bannerChange.placed({side, align, enter, stack})),
    [dispatchBanner, side, align, enter, stack]);
  useEffect(() => () => dispatchBanner(bannerChange.unplaced()), [dispatchBanner]);
};

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

const PartsAndMinutes: FC = () =>
  <TabSidecar label="parts and minutes">
    <ZIndexSize/>
    <PartsIndex/>
  </TabSidecar>;

export const Room: FC = () => {
  usePlacingTheBanners();

  return useShownPart().either(
    part => <PartPage part={part} className={partWears[part]} introduction={partWritings[part].introduction}
      panel={<PartsAndMinutes/>}>{partWritings[part].exhibitAndRuns}</PartPage>,
    () => <>
      <ZIndexIntroduction/>
      <NaturalZIndex className="card rounded-corners lifted padded"/>
      <PartsAndMinutes/>
    </>);
};
