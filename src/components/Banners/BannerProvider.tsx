import {FC, PropsWithChildren, useCallback, useMemo, useState} from 'react';
import {Banner, Raised} from './raising';

export const BannerProvider: FC<PropsWithChildren> = ({children}) => {
  const [banners, setBanners] = useState<readonly Banner[]>([]);

  const raise = useCallback((message: string) =>
    setBanners(standing => standing.some(banner => banner.message === message)
      ? standing
      : [...standing, {id: crypto.randomUUID(), message}]), []);

  const lower = useCallback((id: string) =>
    setBanners(standing => standing.filter(banner => banner.id !== id)), []);

  const raising = useMemo(() => ({banners, raise, lower}), [banners, raise, lower]);

  return <Raised.Provider value={raising}>
    {children}
  </Raised.Provider>;
};
