import {useContext} from 'react';
import {maybe} from '@ryandur/sand';
import {Part, ThePart} from './the-part';

export const useThePart = (): Part => maybe(useContext(ThePart)).either(part => part, () => {
  throw new Error('useThePart is read outside ThePart');
});
