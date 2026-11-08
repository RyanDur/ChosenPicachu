import {useContext} from 'react';
import {News} from './bannerNews';
import {newsContexts} from './newsContexts';

export const useBanners = (): News => useContext(newsContexts.Raised);
