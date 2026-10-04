import {Maybe} from '@ryandur/sand';

export const sortChoices = ['name', 'date', 'size'] as const;

export type SortChoice = typeof sortChoices[number];

export const sortByWords = (chosen: Maybe<SortChoice>): string => chosen.map(choice => `Sort by: ${choice}`).orElse('Sort by');
