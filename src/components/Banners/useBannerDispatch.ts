import {Dispatch, useContext} from 'react';
import {BannerChange, Raising} from './raising';

export const useBannerDispatch = (): Dispatch<BannerChange> => useContext(Raising);
