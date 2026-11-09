import {useEffect} from 'react';
import {bannerChange} from './bannerChange';
import {useBannerDispatch} from './useBannerDispatch';

export const useBannerWhileShown = (message: string): void => {
  const dispatchBanner = useBannerDispatch();
  useEffect(() => {
    const raised = bannerChange.raised(message);
    dispatchBanner(raised);
    return () => dispatchBanner(bannerChange.lowered(raised.banner.id));
  }, [dispatchBanner, message]);
};
