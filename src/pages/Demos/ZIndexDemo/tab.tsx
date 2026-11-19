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

const usePlacingTheBanners = (): void => {
  const {side, align, enter, stack} = useControls();
  const dispatchBanner = useBannerDispatch();

  useEffect(() => dispatchBanner(bannerChange.placed({side, align, enter, stack})),
    [dispatchBanner, side, align, enter, stack]);
  useEffect(() => () => dispatchBanner(bannerChange.unplaced()), [dispatchBanner]);
};

const partContents: Record<ZIndexPart, ReactNode> = {
  'why-third-is-on-top': <WhyThirdIsOnTop/>,
  'why-9999-still-loses': <Why9999StillLoses/>,
  'what-else-forms-a-stacking-context': <WhatElseFormsAStackingContext/>,
  'why-the-popover-wins': <WhyThePopoverWins/>,
  'why-a-fixed-banner-still-loses': <WhyAFixedBannerStillLoses/>,
  'lets-build-this-feature': <LetsBuildThisFeature/>
};

const partWears: Partial<Record<ZIndexPart, string>> = {'lets-build-this-feature': 'tutorials'};

export const Room: FC = () => {
  usePlacingTheBanners();

  return useShownPart().either(
    part => <PartPage part={part} className={partWears[part]}>{partContents[part]}</PartPage>,
    () => <>
      <ZIndexIntroduction/>
      <NaturalZIndex className="card rounded-corners lifted padded"/>
      <TabSidecar label="parts and minutes">
        <ZIndexSize/>
        <PartsIndex/>
      </TabSidecar>
    </>);
};
