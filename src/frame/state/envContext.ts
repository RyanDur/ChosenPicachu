import {createContext} from 'react';
import type {Environment} from './environment';
import {unconfigured} from './unconfigured';

export const envContext = createContext<Environment>(unconfigured);
