import {screen} from '@testing-library/react';

export const recipeSteps = {
  words: (heading: string): HTMLElement => screen.getByRole('article', {name: heading}),
  findWords: (heading: string): Promise<HTMLElement> => screen.findByRole('article', {name: heading}),
  code: (heading: string): HTMLElement => screen.getByRole('figure', {name: heading})
};
