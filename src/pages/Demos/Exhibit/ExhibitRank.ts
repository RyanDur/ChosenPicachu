import {createContext} from 'react';

export type ExhibitRank = 2 | 3;

export const ExhibitRank = createContext<ExhibitRank>(2);
