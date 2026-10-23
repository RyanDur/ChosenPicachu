import {screen, within} from '@testing-library/react';
import {untilTheTablesTabRenders} from './controls';

const region = (): Promise<HTMLElement> => screen.findByRole('region', {name: 'Tables'}, untilTheTablesTabRenders);
const recipe = (build: string): Promise<HTMLElement> =>
  screen.findByRole('region', {name: `build the ${build} yourself`}, untilTheTablesTabRenders);

export const tablesTab = {
  region,
  recipe,
  codeIn: async (run: RegExp): Promise<(string | null)[]> =>
    within(within(await region()).getAllByText(run)[0]).getAllByRole('code').map(code => code.textContent),
  linkIn: async (build: string, name: string): Promise<HTMLElement> =>
    within(await recipe(build)).getByRole('link', {name, hidden: true})
};
