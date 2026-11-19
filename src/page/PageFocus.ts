import {createContext} from 'react';

export const PageFocus = createContext<() => boolean>(() => true);
