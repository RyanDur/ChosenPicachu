import {Maybe} from '@ryandur/sand';

const all = ['name', 'date', 'size'] as const;

export type SortChoice = typeof all[number];

const byWords = (chosen: Maybe<SortChoice>): string => chosen.map(choice => `Sort by: ${choice}`).orElse('Sort by');

type SortChoices = {all: typeof all; byWords: (chosen: Maybe<SortChoice>) => string};

export const sortChoices: SortChoices = {all, byWords};
