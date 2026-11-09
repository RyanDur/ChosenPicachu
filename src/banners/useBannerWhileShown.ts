import {useEffect} from 'react';
import {useLocation} from 'react-router';
import {bannerChange} from './bannerChange';
import {useBannerDispatch} from './useBannerDispatch';

export const useBannerWhileShown = (message: string): void => {
  const dispatchBanner = useBannerDispatch();
  const {pathname} = useLocation();
  useEffect(() => {
    const raised = bannerChange.raised(message);
    dispatchBanner(raised);
    return () => dispatchBanner(bannerChange.lowered(raised.banner.id));
  }, [dispatchBanner, message, pathname]);
};
