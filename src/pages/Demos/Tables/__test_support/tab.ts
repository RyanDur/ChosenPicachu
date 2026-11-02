import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {untilTheTablesTabRenders} from './controls';

type Headers = {
  readonly columns: HTMLElement[];
  readonly rows: HTMLElement[];
};

const recipe = (build: string): Promise<HTMLElement> =>
  screen.findByRole('region', {name: `build the ${build} yourself`}, untilTheTablesTabRenders);
const part = (name: string): HTMLElement => screen.getByRole('region', {name});
const headersOf = (holder: HTMLElement): Headers =>
  ({columns: within(holder).getAllByRole('columnheader'), rows: within(holder).getAllByRole('rowheader')});

export const tablesTab = {
  recipe,
  recipeShown: (build: string): HTMLElement | null => screen.queryByRole('region', {name: `build the ${build} yourself`}),
  frame: (): HTMLElement | null => screen.queryByTitle('the living table, in vanilla'),
  findRadios: (name: string): Promise<HTMLElement[]> => screen.findAllByRole('radio', {name, hidden: true}),
  pick: async (...radios: string[]): Promise<void> => {
    for (const name of radios) {
      await userEvent.click(await screen.findByRole('radio', {name}, untilTheTablesTabRenders));
    }
  },
  columnHeader: (name: string): HTMLElement => screen.getByRole('columnheader', {name}),
  table: (name: string): Headers => headersOf(screen.getByRole('table', {name})),
  headersIn: (name: string): Headers => headersOf(part(name)),
  columnIn: (name: string, column: string): HTMLElement => within(part(name)).getByRole('columnheader', {name: column}),
  linksIn: async (build: string, name: string | RegExp): Promise<HTMLElement[]> =>
    within(await recipe(build)).getAllByRole('link', {name}),
  radioIn: async (build: string, name: string): Promise<HTMLElement | null> => within(await recipe(build)).queryByRole('radio', {name}),
  chooseInRecipe: async (build: string, ...dials: string[]): Promise<void> => {
    for (const name of dials) {
      await userEvent.click(within(await recipe(build)).getByRole('radio', {name}));
    }
  },
  linkIn: async (build: string, name: string): Promise<HTMLElement> =>
    within(await recipe(build)).getByRole('link', {name, hidden: true})
};
