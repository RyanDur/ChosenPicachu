import {createContext, useContext} from 'react';

export type Ranks = {
  readonly story: 'h3' | 'h4';
  readonly step: 'h4' | 'h5';
};

export const Ranks = createContext<Ranks>({story: 'h3', step: 'h4'});

export const useRanks = (): Ranks => useContext(Ranks);
