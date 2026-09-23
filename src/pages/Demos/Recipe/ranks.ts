import {createContext, useContext} from 'react';

type StoryDepth = 3 | 4;

type Ranks = {
  readonly story: `h${StoryDepth}`;
  readonly step: 'h4' | 'h5';
};

const stepBelow: Record<StoryDepth, Ranks['step']> = {3: 'h4', 4: 'h5'};

export const Depth = createContext<StoryDepth>(3);

export const useRanks = (): Ranks => {
  const depth = useContext(Depth);
  return {story: `h${depth}`, step: stepBelow[depth]};
};
