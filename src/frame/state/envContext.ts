import {createContext} from 'react';
import {Env, unconfigured} from './env';

export const envContext = createContext<Env>(unconfigured);
