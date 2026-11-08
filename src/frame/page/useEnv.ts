import {useContext} from 'react';
import {Env} from '@env';
import {envContext} from './envContext';

export const useEnv = (): Env => useContext(envContext);
