import {FC, PropsWithChildren, useReducer} from 'react';
import {bannerNews, Raised, Raising} from './raising';

export const BannerProvider: FC<PropsWithChildren> = ({children}) => {
  const [banners, dispatch] = useReducer(bannerNews.reduce, bannerNews.initial);

  return <Raising.Provider value={dispatch}>
    <Raised.Provider value={banners}>
      {children}
    </Raised.Provider>
  </Raising.Provider>;
};
