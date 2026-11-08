import {useContext} from 'react';
import type {Environment} from '@transport';
import {envContext} from './envContext';

export const useEnv = (): Environment => useContext(envContext);
