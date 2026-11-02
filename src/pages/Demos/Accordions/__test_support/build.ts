import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

type Control = 'checkbox' | 'radio';

const control = (kind: Control, fold: string): HTMLElement => screen.getByRole(kind, {name: new RegExp(fold)});
const foldsGroup = (): HTMLElement => screen.getByRole('group', {name: 'folds'});

export const accordionBuild = {
  checkbox: (fold: string): HTMLElement => control('checkbox', fold),
  radio: (fold: string): HTMLElement => control('radio', fold),
  press: (pressed: HTMLElement): Promise<void> => userEvent.click(pressed),
  pressName: (fold: string): Promise<void> => userEvent.click(screen.getAllByText(fold)[0]),
  holdSpace: async (): Promise<void> => {
    await userEvent.keyboard('[Space>]');
  },
  controlsInFolds: (kind: Control): HTMLElement[] => within(foldsGroup()).getAllByRole(kind),
  itemsInFolds: (): HTMLElement[] => within(foldsGroup()).getAllByRole('listitem'),
  articles: (): HTMLElement[] => screen.getAllByRole('article'),
  textNamed: (bar: string): HTMLElement => screen.getByRole('region', {name: bar})
};
