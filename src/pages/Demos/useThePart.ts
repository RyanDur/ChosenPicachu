import {useContext} from 'react';
import {Part, ThePart} from './the-part';

export const useThePart = (): Part => useContext(ThePart);
