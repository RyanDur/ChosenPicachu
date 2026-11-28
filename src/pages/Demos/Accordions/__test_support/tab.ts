import {is} from '@ryandur/sand';
import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {computeAccessibleName} from 'dom-accessibility-api';
import {partsIndex} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';

const choice = (dial: string): Promise<HTMLElement> => screen.findByRole('group', {name: dial});
const buildIn = (part: HTMLElement, name: string): HTMLElement => within(part).getByRole('region', {name});
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
  openFirstFoldIn: async (part: HTMLElement, name: string): Promise<HTMLElement> => {
    const fold = within(buildIn(part, name)).getAllByRole('group')[0];
    await userEvent.click(within(fold).getAllByText(/^\w+$/)[0]);
    return within(fold).getByRole('paragraph');
  },
  buildIn,
  exhibitsIn: (part: HTMLElement): string[] =>
    within(part).getAllByRole('region')
      .map(region => computeAccessibleName(region))
      .filter(name => is(within(part).queryByRole('heading', {name}))),
  openPart: async (name: string): Promise<void> =>
    userEvent.click(within(await partsIndex.find()).getByRole('link', {name})),
  followInIntroduction: async (part: string, name: string): Promise<void> =>
    userEvent.click(explanation.linkNamed(explanation.opener(await explanation.part(part)), name)),
  place: (): Promise<HTMLElement> => screen.findByText(/part \d+ of \d+/),
  partsIndex: partsIndex.find,
  sizeIn: (holder: HTMLElement): Promise<HTMLElement> => within(holder).findByText(/^Six parts, about \d+ minutes\.$/),
  writtenInOf: (exhibit: HTMLElement): string[] =>
    within(within(exhibit).getAllByRole('list')[0]).getAllByRole('listitem').map(mark => mark.textContent),
  htmlAlone: (): Promise<HTMLElement> => screen.findByRole('region', {name: 'An accordion in HTML alone'}),
  measuredByPlainScript: (): Promise<HTMLElement> => screen.findByRole('region', {name: 'A fold measured by plain script'}),
  firstFigure: async (): Promise<HTMLElement> =>
    within(await screen.findByRole('region', {name: 'Accordions'})).getAllByRole('figure')[0],
  titlesIn: partsIndex.titlesIn,
  currentPagesIn: (index: HTMLElement): string[] =>
    within(index).queryAllByRole('link', {current: 'page'}).map(link => link.textContent),
  titlesUnder: (index: HTMLElement, label: string): string[] =>
    within(within(index).getByRole('list', {name: label})).getAllByRole('link').map(link => link.textContent),
  entryOf: partsIndex.entryOf,
  foldsOwnPage: (holder: HTMLElement): Promise<HTMLElement> => within(holder).findByTitle('The fold’s own page')
};
