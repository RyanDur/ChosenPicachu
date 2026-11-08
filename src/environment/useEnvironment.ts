import {useContext} from 'react';
import type {Environment} from '@transport';
import {environmentContext} from './environmentContext';

export const useEnvironment = (): Environment => useContext(environmentContext);
