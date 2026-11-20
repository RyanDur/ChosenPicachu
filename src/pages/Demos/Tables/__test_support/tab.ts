import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {computeAccessibleName} from 'dom-accessibility-api';
import {not} from '@ryandur/sand';
import {untilTheTablesTabRenders} from './controls';

type Headers = {
  readonly columns: HTMLElement[];
  readonly rows: HTMLElement[];
};

const sizeLine = /^Eight parts, about \d+ minutes\.$/;

const recipe = (build: string): Promise<HTMLElement> =>
  screen.findByRole('region', {name: `build the ${build} yourself`}, untilTheTablesTabRenders);
const part = (name: string): HTMLElement => screen.getByRole('region', {name});
const link = async (name: string | RegExp): Promise<HTMLElement> => {
  const index = await screen.findByRole('navigation', {name: 'Parts'}, untilTheTablesTabRenders);
  const links = await within(await screen.findByRole('region', {name: 'Tables'}, untilTheTablesTabRenders))
    .findAllByRole('link', {name}, untilTheTablesTabRenders);
  const inTheText = links.filter(found => not(index.contains(found)));
  if (not(inTheText.length)) {
    throw new Error(`no link named ${String(name)} outside the parts index`);
  }
  return inTheText[0];
};
const partLink = async (name: string): Promise<HTMLElement> =>
  within(await screen.findByRole('navigation', {name: 'Parts'}, untilTheTablesTabRenders)).findByRole('link', {name}, untilTheTablesTabRenders);
const headersOf = (holder: HTMLElement): Headers =>
  ({columns: within(holder).getAllByRole('columnheader'), rows: within(holder).getAllByRole('rowheader')});

export const tablesTab = () => ({
  titleShown: (name: string): HTMLElement | null => screen.queryByRole('heading', {name}),
  recipe,
  features: (): HTMLElement => screen.getByRole('region', {name: 'let’s build this feature'}),
  featureLinks: (): (string | null)[][] =>
    within(screen.getByRole('region', {name: 'let’s build this feature'})).getAllByRole('link')
      .map(anchor => [computeAccessibleName(anchor), anchor.getAttribute('href')]),
  partLink,
  follow: async (name: string): Promise<void> => userEvent.click(await link(name)),
  followPart: async (name: string): Promise<void> => userEvent.click(await partLink(name)),
  backToTheTab: async (): Promise<void> => userEvent.click(await link('Tables')),
  tutorialsListed: async (): Promise<string[]> =>
    within(await screen.findByRole('list', {name: 'Add what the trader asked for'}, untilTheTablesTabRenders))
      .getAllByRole('link').map(anchor => computeAccessibleName(anchor)),
  place: (): Promise<HTMLElement> => screen.findByText(/part \d+ of \d+/),
  opening: (): Promise<HTMLElement> =>
    screen.findByText(/^A table of live trades is the hardest thing on this site/, {}, untilTheTablesTabRenders),
  size: (): Promise<HTMLElement> => screen.findByText(sizeLine, {}, untilTheTablesTabRenders),
  sizeIn: (holder: HTMLElement): Promise<HTMLElement> =>
    within(holder).findByText(sizeLine, {}, untilTheTablesTabRenders),
  worldDial: (): Promise<HTMLElement> => screen.findByRole('group', {name: 'world'}, untilTheTablesTabRenders),
  partsIn: async (group: string): Promise<(string | null)[][]> =>
    within(await screen.findByRole('list', {name: group}, untilTheTablesTabRenders)).getAllByRole('link')
      .map(anchor => [computeAccessibleName(anchor), anchor.getAttribute('href')]),
  minutesOf: async (name: string): Promise<HTMLElement> => {
    const parts = await screen.findByRole('navigation', {name: 'Parts'}, untilTheTablesTabRenders);
    const [entry] = within(parts).getAllByRole('listitem').filter(item => within(item).queryByRole('link', {name}));
    return within(entry).getByRole('time');
  },
  titles: (name: string, level?: number): HTMLElement[] => screen.queryAllByRole('heading', {name, level}),
  partPage: (name: string): Promise<HTMLElement> => screen.findByRole('article', {name}, untilTheTablesTabRenders),
  tutorialPage: (name: string): Promise<HTMLElement> => screen.findByRole('region', {name}, untilTheTablesTabRenders),
  titlesIn: (page: HTMLElement): (string | null)[] =>
    within(page).getAllByRole('heading', {level: 2}).map(heading => heading.textContent),
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
