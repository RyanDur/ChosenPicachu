export const sortChoices = ['name', 'date', 'size'] as const;

export type SortChoice = typeof sortChoices[number];
