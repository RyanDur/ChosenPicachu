import {useContext} from 'react';
import {StoryDepth} from './StoryDepth';

type Ranks = {
  readonly story: `h${StoryDepth}`;
  readonly step: 'h4' | 'h5';
};

const stepBelow: Record<StoryDepth, Ranks['step']> = {3: 'h4', 4: 'h5'};

export const useRanks = (): Ranks => {
  const depth = useContext(StoryDepth);
  return {story: `h${depth}`, step: stepBelow[depth]};
};
