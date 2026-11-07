import {createContext} from 'react';

export type StoryDepth = 3 | 4;

export const StoryDepth = createContext<StoryDepth>(3);
