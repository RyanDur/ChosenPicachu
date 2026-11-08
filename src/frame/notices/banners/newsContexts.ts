import {createContext, Dispatch} from 'react';
import {BannerChange} from './bannerChange';
import {bannerNews, News} from './bannerNews';

export const newsContexts = {
  Raised: createContext<News>(bannerNews.initial),
  Raising: createContext<Dispatch<BannerChange>>(() => undefined)
};
