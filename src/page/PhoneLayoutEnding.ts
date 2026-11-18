import {createContext} from 'react';
import {PhoneLayoutEnds} from './phoneLayout';

export const PhoneLayoutEnding = createContext<PhoneLayoutEnds>(() => () => undefined);
