import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {computeAccessibleName} from 'dom-accessibility-api';

const choice = (dial: string): Promise<HTMLElement> => screen.findByRole('group', {name: dial});
const option = (holder: HTMLElement, name: string): HTMLElement => within(holder).getByRole('radio', {name});

export const accordionsTab = {
  choice,
  choiceIn: (holder: HTMLElement, dial: string): HTMLElement => within(holder).getByRole('group', {name: dial}),
  choiceRow: async (dial: string): Promise<HTMLElement> => {
    await choice(dial);
    const rows = screen.getAllByRole('listitem').filter(item => within(item).queryByRole('group', {name: dial}) !== null);
    return rows[rows.length - 1];
  },
  option,
  choose: async (dial: string, name: string): Promise<void> => userEvent.click(option(await choice(dial), name)),
  readingIn: (row: HTMLElement): HTMLElement => within(row).getByRole('status'),
  openFold: (fold: HTMLElement): Promise<void> => userEvent.click(within(fold).getByText(computeAccessibleName(fold))),
  openFirstFold: async (part: HTMLElement): Promise<HTMLElement> => {
    const control = within(part).getAllByRole('radio')[0];
    await userEvent.click(control);
    return control;
  },
  buildsIn: (part: HTMLElement): string[] =>
    within(part).getAllByRole('article').map(build => within(build).getByRole('heading', {level: 3}).textContent),
  foldMeasuredByPlainScript: (holder: HTMLElement): Promise<HTMLElement> => within(holder).findByTitle('A fold measured by plain script')
};
