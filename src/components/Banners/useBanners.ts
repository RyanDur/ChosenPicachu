import {useContext} from 'react';
import {Banner, Raised} from './raising';

export const useBanners = (): readonly Banner[] => useContext(Raised);
