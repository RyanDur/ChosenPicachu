import {createContext} from 'react';
import type {Env} from './environment';
import {unconfigured} from './unconfigured';

export const envContext = createContext<Env>(unconfigured);
