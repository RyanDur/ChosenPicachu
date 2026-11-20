import {FC, useEffect} from 'react';
import {bannerChange, useBannerDispatch} from '@banners';
import {useControls} from '../Controls';
import {ZIndexIntroduction} from './Introduction';
import {NaturalZIndex} from './NaturalZIndex';
import {PartPage} from './PartPage';
import {useShownPart} from './useShownPart';
import {PartsAndMinutes} from './PartsAndMinutes';

const usePlacingTheBanners = (): void => {
  const {side, align, enter, stack} = useControls();
  const dispatchBanner = useBannerDispatch();

  useEffect(() => dispatchBanner(bannerChange.placed({side, align, enter, stack})),
    [dispatchBanner, side, align, enter, stack]);
  useEffect(() => () => dispatchBanner(bannerChange.unplaced()), [dispatchBanner]);
};

export const Room: FC = () => {
  usePlacingTheBanners();

  return useShownPart().either(
    part => <PartPage part={part}/>,
    () => <>
      <ZIndexIntroduction/>
      <NaturalZIndex className="card rounded-corners lifted padded"/>
      <PartsAndMinutes/>
    </>);
};
