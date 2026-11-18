import {createContext} from 'react';
import {Doors, doors} from '@pages/Gallery/doors';

export const KnownDoors = createContext<Doors>(doors.initial);
