import {screen, within} from '@testing-library/react';

type Control = 'checkbox' | 'radio';

const foldsGroup = (): HTMLElement => screen.getByRole('group', {name: 'folds'});

export const accordionFolds = (kind: Control) => ({
  controls: (): HTMLElement[] => within(foldsGroup()).getAllByRole(kind),
  items: (): HTMLElement[] => within(foldsGroup()).getAllByRole('listitem'),
  articles: (): HTMLElement[] => screen.getAllByRole('article')
});

export const foldTextUnder = (bar: string): HTMLElement => screen.getByRole('region', {name: bar});
