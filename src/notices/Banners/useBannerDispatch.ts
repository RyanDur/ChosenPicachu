import {Dispatch, useContext} from 'react';
import {BannerChange} from './bannerChange';
import {newsContexts} from './newsContexts';

export const useBannerDispatch = (): Dispatch<BannerChange> => useContext(newsContexts.Raising);
