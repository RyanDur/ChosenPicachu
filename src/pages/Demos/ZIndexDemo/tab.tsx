import {FC, ReactNode, useEffect} from 'react';
import {bannerChange, useBannerDispatch} from '@banners';
import {useControls} from '../Controls';
import {BannerExplained} from './BannerExplained';
import {PartListing} from './PartListing';
import {TopLayerTutorial} from './Tutorial';
import {ZIndexIntroduction} from './Introduction';
import {WhichCardIsOnTop} from './WhichCardIsOnTop';
import {NaturalZIndex} from './NaturalZIndex';
import {PartPage} from './PartPage';
import {ZIndexPart} from './part-pages';
import {useShownPart} from './useShownPart';
import {WhyThirdIsOnTop} from './WhyThirdIsOnTop';
import {Why9999StillLoses} from './Why9999StillLoses';
import {WhatElseFormsAStackingContext} from './WhatElseFormsAStackingContext';
import {WhyThePopoverWins} from './WhyThePopoverWins';

const usePlacingTheBanners = (): void => {
  const {side, align, enter, stack} = useControls();
  const dispatchBanner = useBannerDispatch();

  useEffect(() => dispatchBanner(bannerChange.placed({side, align, enter, stack})),
    [dispatchBanner, side, align, enter, stack]);
  useEffect(() => () => dispatchBanner(bannerChange.unplaced()), [dispatchBanner]);
};

const pagesOfParts: Record<ZIndexPart, ReactNode> = {
  'why-third-is-on-top': <WhyThirdIsOnTop/>,
  'why-9999-still-loses': <Why9999StillLoses/>,
  'what-else-forms-a-stacking-context': <WhatElseFormsAStackingContext/>,
  'why-the-popover-wins': <WhyThePopoverWins/>
};

export const Room: FC = () => {
  usePlacingTheBanners();

  return useShownPart().either(part => <PartPage part={part}>{pagesOfParts[part]}</PartPage>, () => <>
    <ZIndexIntroduction/>
    <NaturalZIndex className="card rounded-corners lifted padded"/>
    <PartListing part="why-third-is-on-top"/>
    <PartListing part="why-9999-still-loses"/>
    <PartListing part="what-else-forms-a-stacking-context"/>
    <PartListing part="why-the-popover-wins"/>
    <BannerExplained/>
    <WhichCardIsOnTop/>
    <TopLayerTutorial/>
  </>);
};
