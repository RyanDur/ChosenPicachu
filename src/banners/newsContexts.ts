import {createContext, Dispatch} from 'react';
import {BannerChange} from './bannerChange';
import {bannerNews, News} from './bannerNews';

export const newsContexts = {
  News: createContext<News>(bannerNews.initial),
  Raising: createContext<Dispatch<BannerChange>>(() => undefined)
};
