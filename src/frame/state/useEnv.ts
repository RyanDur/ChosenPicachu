import {useContext} from 'react';
import type {Env} from './environment';
import {envContext} from './envContext';

export const useEnv = (): Env => useContext(envContext);
