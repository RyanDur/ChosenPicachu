import {is} from '@ryandur/sand';
import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {computeAccessibleName} from 'dom-accessibility-api';
import {partsIndex} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';

const partsAndDials = (): Promise<HTMLElement> => screen.findByRole('complementary', {name: 'parts and dials'});

const choice = (dial: string): Promise<HTMLElement> => screen.findByRole('group', {name: dial});
const buildIn = (part: HTMLElement): HTMLElement => within(part).getByRole('article');
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
    const fold = within(buildIn(part)).getAllByRole('group')[0];
    await userEvent.click(within(fold).getAllByText(/^\w+$/)[0]);
    return within(fold).getByRole('paragraph');
  },
  partsHolding: async (element: HTMLElement, parts: string[]): Promise<string[]> => {
    const holding = await Promise.all(parts.map(async name => (await screen.findByRole('region', {name})).contains(element)));
    return parts.filter((_, at) => holding[at]);
  },
  buildIn,
  buildsIn: (part: HTMLElement): string[] =>
    within(part).getAllByRole('article').map(build => within(build).getByRole('heading', {level: 3}).textContent),
  openPart: async (name: string): Promise<void> =>
    userEvent.click(within(await partsIndex.find()).getByRole('link', {name})),
  followInIntroduction: async (part: string, name: string): Promise<void> =>
    userEvent.click(explanation.linkNamed(explanation.opener(await explanation.part(part)), name)),
  place: (): Promise<HTMLElement> => screen.findByText(/part \d+ of \d+/),
  partsIndex: partsIndex.find,
  partsAndDials,
  size: (): Promise<HTMLElement> => screen.findByText(/^Six parts, about \d+ minutes\.$/),
  exhibit: async (): Promise<HTMLElement> =>
    within(await screen.findByRole('region', {name: 'Accordions'})).getAllByRole('figure')[0],
  titlesIn: partsIndex.titlesIn,
  currentPagesIn: (index: HTMLElement): string[] =>
    within(index).queryAllByRole('link', {current: 'page'}).map(link => link.textContent),
  titlesUnder: (index: HTMLElement, label: string): string[] =>
    within(within(index).getByRole('list', {name: label})).getAllByRole('link').map(link => link.textContent),
  entryOf: partsIndex.entryOf,
  foldMeasuredByPlainScript: (holder: HTMLElement): Promise<HTMLElement> => within(holder).findByTitle('A fold measured by plain script')
};
