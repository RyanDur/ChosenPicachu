import {useContext} from 'react';
import {Doors} from '@pages/Gallery/doors';
import {KnownDoors} from './knownDoors';

export const useKnownDoors = (): Doors => useContext(KnownDoors);
