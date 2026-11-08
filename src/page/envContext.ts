import {createContext} from 'react';
import {Environment, unconfigured} from '@transport';

export const envContext = createContext<Environment>(unconfigured);
