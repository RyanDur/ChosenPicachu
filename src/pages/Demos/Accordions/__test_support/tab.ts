import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
  openFirstFold: async (part: HTMLElement): Promise<HTMLElement> => {
    const control = within(part).getAllByRole('radio')[0];
    await userEvent.click(control);
    return control;
  },
  urlSearch: (): HTMLElement => screen.getByRole('status', {name: 'url search'}),
  buildsIn: (part: HTMLElement): string[] =>
    within(part).getAllByRole('article').map(build => within(build).getByRole('heading', {level: 3}).textContent),
  frameIn: (holder: HTMLElement, title: string): Promise<HTMLElement> => within(holder).findByTitle(title),
  tableIn: (holder: HTMLElement, name: string): HTMLElement => within(holder).getByRole('table', {name}),
  rowIn: (table: HTMLElement, name: string): HTMLElement => within(table).getByRole('row', {name}),
  htmlAloneMarkup: async (): Promise<string> => {
    const htmlAlone = await screen.findByRole('region', {name: 'An accordion in HTML alone'});
    return within(within(htmlAlone).getAllByRole('listitem')[0]).getAllByRole('code').map(code => code.textContent).join();
  }
};
