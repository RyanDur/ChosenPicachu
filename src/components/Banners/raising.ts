import {createContext} from 'react';

export type Banner = {
  id: string;
  message: string;
};

export type Raising = {
  banners: readonly Banner[];
  raise: (message: string) => void;
  lower: (id: string) => void;
};

export const quietly: Raising = {
  banners: [],
  raise: () => undefined,
  lower: () => undefined
};

export const Raised = createContext<Raising>(quietly);
