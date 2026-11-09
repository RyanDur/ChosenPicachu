import {createContext} from 'react';
import {Arrival} from './arrival';

export const ArrivalDrawn = createContext<Arrival['drawn']>(() => undefined);
