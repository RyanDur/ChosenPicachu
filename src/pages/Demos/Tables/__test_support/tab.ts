import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {untilTheTablesTabRenders} from './controls';

type Headers = {
  readonly columns: HTMLElement[];
  readonly rows: HTMLElement[];
};

const region = (): Promise<HTMLElement> => screen.findByRole('region', {name: 'Tables'}, untilTheTablesTabRenders);
const recipe = (build: string): Promise<HTMLElement> =>
  screen.findByRole('region', {name: `build the ${build} yourself`}, untilTheTablesTabRenders);
const part = (name: string): HTMLElement => screen.getByRole('region', {name});
const headersOf = (holder: HTMLElement): Headers =>
  ({columns: within(holder).getAllByRole('columnheader'), rows: within(holder).getAllByRole('rowheader')});
const slices = (): HTMLElement => screen.getByRole('list', {name: 'the slices'});

export const tablesTab = {
  region,
  recipe,
  part,
  heading: (name: string): HTMLElement => screen.getByRole('heading', {name}),
  findHeading: (name: string): Promise<HTMLElement> => screen.findByRole('heading', {name}, untilTheTablesTabRenders),
  words: (told: string | RegExp): HTMLElement => screen.getByText(told),
  findWords: (told: string): Promise<HTMLElement> => screen.findByText(told, {}, untilTheTablesTabRenders),
  missingWords: (told: string): HTMLElement | null => screen.queryByText(told),
  wordsIn: (holder: HTMLElement, told: string): HTMLElement => within(holder).getByText(told),
  recipeShown: (build: string): HTMLElement | null => screen.queryByRole('region', {name: `build the ${build} yourself`}),
  frame: (): HTMLElement | null => screen.queryByTitle('the living table, in vanilla'),
  urlSearch: (): HTMLElement => screen.getByRole('status', {name: 'url search'}),
  findRadios: (name: string): Promise<HTMLElement[]> => screen.findAllByRole('radio', {name, hidden: true}),
  pick: async (...radios: string[]): Promise<void> => {
    for (const name of radios) {
      await userEvent.click(await screen.findByRole('radio', {name}, untilTheTablesTabRenders));
    }
  },
  link: (name: string): HTMLElement => screen.getByRole('link', {name}),
  cell: (name: string): HTMLElement => screen.getByRole('cell', {name}),
  columnHeader: (name: string): HTMLElement => screen.getByRole('columnheader', {name}),
  rowHeader: (name: string | RegExp): HTMLElement => screen.getByRole('rowheader', {name}),
  aside: (name: string): HTMLElement => screen.getByRole('complementary', {name}),
  table: (name: string): Headers => headersOf(screen.getByRole('table', {name})),
  headersIn: (name: string): Headers => headersOf(part(name)),
  columnIn: (name: string, column: string): HTMLElement => within(part(name)).getByRole('columnheader', {name: column}),
  slice: (title: string): HTMLElement | undefined =>
    within(slices()).getAllByRole('listitem').find(item => within(item).queryByText(title) !== null),
  sliceLinks: (): (string | null)[] => within(slices()).getAllByRole('link').map(link => link.getAttribute('href')),
  stationsHolding: (holds: string): string[] =>
    within(screen.getByRole('list', {name: 'the stations'})).getAllByRole('listitem')
      .filter(station => within(station).queryAllByText(holds).length > 0).map(station => station.id),
  linksIn: async (build: string, name: string | RegExp): Promise<HTMLElement[]> =>
    within(await recipe(build)).getAllByRole('link', {name}),
  radioIn: async (build: string, name: string): Promise<HTMLElement | null> => within(await recipe(build)).queryByRole('radio', {name}),
  labelledIn: async (build: string, label: string): Promise<HTMLElement[]> => within(await recipe(build)).getAllByLabelText(label),
  chooseInRecipe: async (build: string, ...dials: string[]): Promise<void> => {
    for (const name of dials) {
      await userEvent.click(within(await recipe(build)).getByRole('radio', {name}));
    }
  },
  codeIn: async (run: RegExp): Promise<(string | null)[]> =>
    within(within(await region()).getAllByText(run)[0]).getAllByRole('code').map(code => code.textContent),
  linkIn: async (build: string, name: string): Promise<HTMLElement> =>
    within(await recipe(build)).getByRole('link', {name, hidden: true})
};
