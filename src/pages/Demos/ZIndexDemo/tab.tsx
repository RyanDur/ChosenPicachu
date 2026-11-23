import {FC, useEffect} from 'react';
import {bannerChange, useBannerDispatch} from '@banners';
import {useControls} from '../Controls';
import {PageWithParts} from '../PageWithParts';
import {ZIndexIntroduction} from './Introduction';
import {ThePile} from './ThePile';
import {WhatTheTabGives} from './WhatTheTabGives';
import {PartPage} from './PartPage';
import {useShownPart} from './useShownPart';

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
    () => <PageWithParts>
      <ZIndexIntroduction/>
      <ThePile/>
      <WhatTheTabGives/>
    </PageWithParts>);
};
