import {createContext} from 'react';
import {paintsAtOnce} from './paintsAtOnce';

export type Paints = Pick<Window, 'requestAnimationFrame' | 'cancelAnimationFrame'>;

export const PagePaints = createContext<Paints>(paintsAtOnce);
