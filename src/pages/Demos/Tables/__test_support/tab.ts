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
  words: (told: RegExp): HTMLElement => screen.getByText(told),
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
