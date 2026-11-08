import {useContext} from 'react';
import type {Environment} from './environment';
import {envContext} from './envContext';

export const useEnv = (): Environment => useContext(envContext);
