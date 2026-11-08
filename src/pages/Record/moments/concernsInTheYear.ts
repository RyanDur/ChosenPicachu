import {createContext} from 'react';
import {Maybe, nothing} from '@ryandur/sand';

const noConcerns: Maybe<string> = nothing();

export const ConcernsInTheYear = createContext<Maybe<string>>(noConcerns);
