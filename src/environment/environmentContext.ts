import {createContext} from 'react';
import {Environment, unconfigured} from '@transport';

export const environmentContext = createContext<Environment>(unconfigured);
