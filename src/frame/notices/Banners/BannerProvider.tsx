import {FC, PropsWithChildren, useReducer} from 'react';
import {bannerNews} from './bannerNews';
import {newsContexts} from './newsContexts';

export const BannerProvider: FC<PropsWithChildren> = ({children}) => {
  const [news, dispatch] = useReducer(bannerNews.reduce, bannerNews.initial);

  return <newsContexts.Raising.Provider value={dispatch}>
    <newsContexts.Raised.Provider value={news}>
      {children}
    </newsContexts.Raised.Provider>
  </newsContexts.Raising.Provider>;
};
