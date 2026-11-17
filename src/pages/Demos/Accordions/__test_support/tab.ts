import {is} from '@ryandur/sand';
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
    const rows = screen.getAllByRole('listitem').filter(item => is(within(item).queryByRole('group', {name: dial})));
    return rows[rows.length - 1];
  },
  option,
  choose: async (dial: string, name: string): Promise<void> => userEvent.click(option(await choice(dial), name)),
  readingIn: (row: HTMLElement): HTMLElement => within(row).getByRole('status'),
  openFold: (fold: HTMLElement): Promise<void> => userEvent.click(within(fold).getByText(computeAccessibleName(fold))),
  openFirstFoldIn: async (part: HTMLElement): Promise<HTMLElement> => {
    const fold = within(part).getAllByRole('group')[0];
    await userEvent.click(within(fold).getAllByText(/^\w+$/)[0]);
    return within(fold).getByRole('paragraph');
  },
  partsHolding: async (element: HTMLElement, parts: string[]): Promise<string[]> => {
    const holding = await Promise.all(parts.map(async name => (await screen.findByRole('region', {name})).contains(element)));
    return parts.filter((_, at) => holding[at]);
  },
  buildIn: (part: HTMLElement): HTMLElement => within(part).getByRole('article'),
  buildsIn: (part: HTMLElement): string[] =>
    within(part).getAllByRole('article').map(build => within(build).getByRole('heading', {level: 3}).textContent),
  openPart: async (name: string): Promise<void> => userEvent.click(await screen.findByRole('link', {name})),
  place: (): Promise<HTMLElement> => screen.findByText(/part \d+ of \d+/),
  foldMeasuredByPlainScript: (holder: HTMLElement): Promise<HTMLElement> => within(holder).findByTitle('A fold measured by plain script')
};
