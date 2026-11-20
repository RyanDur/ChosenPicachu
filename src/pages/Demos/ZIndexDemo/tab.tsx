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

type Contents = {
  readonly introduction: ReactNode;
  readonly body: ReactNode;
};

const partContents: Record<ZIndexPart, Contents> = {
  'why-third-is-on-top': {introduction: <WhyThirdIsOnTopIntroduction/>, body: <WhyThirdIsOnTop/>},
  'why-9999-still-loses': {introduction: <Why9999StillLosesIntroduction/>, body: <Why9999StillLoses/>},
  'what-else-forms-a-stacking-context': {introduction: <WhatElseFormsAStackingContextIntroduction/>, body: <WhatElseFormsAStackingContext/>},
  'why-the-popover-wins': {introduction: <WhyThePopoverWinsIntroduction/>, body: <WhyThePopoverWins/>},
  'why-a-fixed-banner-still-loses': {introduction: <WhyAFixedBannerStillLosesIntroduction/>, body: <WhyAFixedBannerStillLoses/>},
  'lets-build-this-feature': {introduction: <LetsBuildThisFeatureIntroduction/>, body: <LetsBuildThisFeature/>}
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
    part => <PartPage part={part} className={partWears[part]} introduction={partContents[part].introduction}
      panel={<PartsAndMinutes/>}>{partContents[part].body}</PartPage>,
    () => <>
      <ZIndexIntroduction/>
      <NaturalZIndex className="card rounded-corners lifted padded"/>
      <PartsAndMinutes/>
    </>);
};
