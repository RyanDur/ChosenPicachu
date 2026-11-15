import {useContext} from 'react';
import {OpenFolds} from './OpenFolds';

export const useOpenFolds = (): readonly string[] => useContext(OpenFolds);
