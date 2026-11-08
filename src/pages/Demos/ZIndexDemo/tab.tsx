import {FC, useEffect} from 'react';
import {bannerChange, useBannerDispatch} from '@banners';
import {useControls} from '../Controls';
import {BannerExplained} from './BannerExplained';
import {FormsContextExplained} from './FormsContextExplained';
import {MenuExplained} from './MenuExplained';
import {PopoverExplained} from './PopoverExplained';
import {StackingExplained} from './Explained';
import {TopLayerTutorial} from './Tutorial';
import {ZIndexIntroduction} from './Introduction';

const usePlacingTheBanners = (): void => {
  const {side, align, enter, stack} = useControls();
  const dispatchBanner = useBannerDispatch();

  useEffect(() => dispatchBanner(bannerChange.placed({side, align, enter, stack})),
    [dispatchBanner, side, align, enter, stack]);
  useEffect(() => () => dispatchBanner(bannerChange.unplaced()), [dispatchBanner]);
};

export const Room: FC = () => {
  usePlacingTheBanners();

  return <>
    <ZIndexIntroduction/>
    <StackingExplained/>
    <MenuExplained/>
    <FormsContextExplained/>
    <PopoverExplained/>
    <BannerExplained/>
    <TopLayerTutorial/>
  </>;
};
