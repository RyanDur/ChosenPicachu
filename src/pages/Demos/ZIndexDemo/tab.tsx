import {FC, ReactNode, useEffect} from 'react';
import {bannerChange, useBannerDispatch} from '@banners';
import {useControls} from '../Controls';
import {BannerExplained} from './BannerExplained';
import {FormsContextExplained} from './FormsContextExplained';
import {MenuExplained} from './MenuExplained';
import {PopoverExplained} from './PopoverExplained';
import {ThirdOnTopListing} from './ThirdOnTopListing';
import {TopLayerTutorial} from './Tutorial';
import {ZIndexIntroduction} from './Introduction';
import {WhichCardIsOnTop} from './WhichCardIsOnTop';
import {NaturalZIndex} from './NaturalZIndex';
import {PartPage} from './PartPage';
import {ZIndexPart} from './part-pages';
import {useShownPart} from './useShownPart';
import {WhyThirdIsOnTop} from './WhyThirdIsOnTop';

const usePlacingTheBanners = (): void => {
  const {side, align, enter, stack} = useControls();
  const dispatchBanner = useBannerDispatch();

  useEffect(() => dispatchBanner(bannerChange.placed({side, align, enter, stack})),
    [dispatchBanner, side, align, enter, stack]);
  useEffect(() => () => dispatchBanner(bannerChange.unplaced()), [dispatchBanner]);
};

const pagesOfParts: Record<ZIndexPart, ReactNode> = {
  'why-third-is-on-top': <WhyThirdIsOnTop/>
};

export const Room: FC = () => {
  usePlacingTheBanners();

  return useShownPart().either(part => <PartPage part={part}>{pagesOfParts[part]}</PartPage>, () => <>
    <ZIndexIntroduction/>
    <NaturalZIndex className="card rounded-corners lifted padded"/>
    <ThirdOnTopListing/>
    <MenuExplained/>
    <FormsContextExplained/>
    <PopoverExplained/>
    <BannerExplained/>
    <WhichCardIsOnTop/>
    <TopLayerTutorial/>
  </>);
};
