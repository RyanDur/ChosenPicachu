import {createContext, useContext} from 'react';

export type StoryDepth = 3 | 4;

type Ranks = {
  readonly story: `h${StoryDepth}`;
  readonly step: 'h4' | 'h5';
};

const stepBelow: Record<StoryDepth, Ranks['step']> = {3: 'h4', 4: 'h5'};

export const StoryDepth = createContext<StoryDepth>(3);

export const useRanks = (): Ranks => {
  const depth = useContext(StoryDepth);
  return {story: `h${depth}`, step: stepBelow[depth]};
};
