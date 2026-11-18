import {createContext} from 'react';
import {PhoneLayout} from './phoneLayout';

export const ThePhoneLayout = createContext<PhoneLayout>({ends: () => () => undefined});
