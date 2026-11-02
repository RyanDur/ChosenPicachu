import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

type Control = 'checkbox' | 'radio';

const foldsGroup = (): HTMLElement => screen.getByRole('group', {name: 'folds'});

export const accordionFolds = (kind: Control) => {
  const control = (fold: string): HTMLElement => screen.getByRole(kind, {name: new RegExp(fold)});
  return {
    press: (fold: string): Promise<void> => userEvent.click(control(fold)),
    pressName: (fold: string): Promise<void> => userEvent.click(screen.getAllByText(fold)[0]),
    holdSpace: async (): Promise<void> => {
      await userEvent.keyboard('[Space>]');
    },
    isOpen: (fold: string): boolean => control(fold).matches(':checked'),
    controls: (): HTMLElement[] => within(foldsGroup()).getAllByRole(kind),
    items: (): HTMLElement[] => within(foldsGroup()).getAllByRole('listitem'),
    articles: (): HTMLElement[] => screen.getAllByRole('article')
  };
};

export const foldTextUnder = (bar: string): HTMLElement => screen.getByRole('region', {name: bar});
