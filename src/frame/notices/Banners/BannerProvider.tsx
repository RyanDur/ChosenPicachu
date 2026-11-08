import {FC, PropsWithChildren, useReducer} from 'react';
import {bannerNews} from './bannerNews';
import {newsContexts} from './newsContexts';

export const BannerProvider: FC<PropsWithChildren> = ({children}) => {
  const [news, dispatch] = useReducer(bannerNews.reduce, bannerNews.initial);

  return <newsContexts.Raising.Provider value={dispatch}>
    <newsContexts.News.Provider value={news}>
      {children}
    </newsContexts.News.Provider>
  </newsContexts.Raising.Provider>;
};
