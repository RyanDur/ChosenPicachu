import {useContext} from 'react';
import {Raised, Raising} from './raising';

export const useBanners = (): Raising => useContext(Raised);
