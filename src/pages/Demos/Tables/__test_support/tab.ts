import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {computeAccessibleName} from 'dom-accessibility-api';
import {untilTheTablesTabRenders} from './controls';

type Headers = {
  readonly columns: HTMLElement[];
  readonly rows: HTMLElement[];
};

const recipe = (build: string): Promise<HTMLElement> =>
  screen.findByRole('region', {name: `build the ${build} yourself`}, untilTheTablesTabRenders);
const part = (name: string): HTMLElement => screen.getByRole('region', {name});
const tutorialLink = async (name: string | RegExp): Promise<HTMLElement> =>
  within(await screen.findByRole('region', {name: 'Tables'}, untilTheTablesTabRenders)).findByRole('link', {name}, untilTheTablesTabRenders);
const headersOf = (holder: HTMLElement): Headers =>
  ({columns: within(holder).getAllByRole('columnheader'), rows: within(holder).getAllByRole('rowheader')});

export const tablesTab = () => ({
  titleShown: (name: string): HTMLElement | null => screen.queryByRole('heading', {name}),
  recipe,
  tutorialLink,
  follow: async (name: string): Promise<void> => userEvent.click(await tutorialLink(name)),
  backToTheTab: async (): Promise<void> => userEvent.click(await tutorialLink('Tables')),
  tutorialReadingTimeOf: async (name: string): Promise<HTMLElement> => {
    const tutorials = await screen.findByRole('list', {name: 'the tutorials'}, untilTheTablesTabRenders);
    const [entry] = within(tutorials).getAllByRole('listitem').filter(item => within(item).queryByRole('link', {name}));
    return within(entry).getByText(/to read$/);
  },
  tutorialsListed: async (): Promise<string[]> =>
    within(await screen.findByRole('list', {name: 'the tutorials'}, untilTheTablesTabRenders)).getAllByRole('link')
      .map(link => computeAccessibleName(link)),
  place: (): Promise<HTMLElement> => screen.findByText(/tutorial \d+ of \d+/),
  partPlace: (): Promise<HTMLElement> => screen.findByText(/part \d+ of \d+/),
  readingTimeOf: async (title: string): Promise<HTMLElement> => {
    await tutorialLink(title);
    const [entry] = screen.getAllByRole('listitem').filter(item => within(item).queryByRole('heading', {name: title}));
    return within(entry).getByText(/to read$/);
  },
  titles: (name: string, level?: number): HTMLElement[] => screen.queryAllByRole('heading', {name, level}),
  tableShown: (name: string): HTMLElement | null => screen.queryByRole('table', {name}),
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
  columnsIn: (name: string): string[] => within(part(name)).getAllByRole('columnheader').map(column => computeAccessibleName(column)),
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
});
