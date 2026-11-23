import {createContext} from 'react';
import type {Behind, Onward} from './PartFoot';

export type Part = {
  readonly heading: string;
  readonly headingId: string;
  readonly place: string;
  readonly previous: Behind;
  readonly next: Onward;
};

export const ThePart = createContext<Part | undefined>(undefined);
