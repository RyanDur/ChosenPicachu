import {screen, within} from '@testing-library/react';

const untilTheTabMounts = {timeout: 5000};

const slices = (): HTMLElement => screen.getByRole('list', {name: 'the slices'});

export const demoPage = {
  part: (name: string): HTMLElement => screen.getByRole('region', {name}),
  heading: (name: string): HTMLElement => screen.getByRole('heading', {name}),
  findHeading: (name: string): Promise<HTMLElement> => screen.findByRole('heading', {name}, untilTheTabMounts),
  words: (told: string | RegExp): HTMLElement => screen.getByText(told),
  everyWords: (told: RegExp): HTMLElement[] => screen.getAllByText(told),
  findWords: (told: string | RegExp): Promise<HTMLElement> => screen.findByText(told, {}, untilTheTabMounts),
  missingWords: (told: string): HTMLElement | null => screen.queryByText(told),
  link: (name: string): HTMLElement => screen.getByRole('link', {name}),
  rowHeader: (name: string | RegExp): HTMLElement => screen.getByRole('rowheader', {name}),
  aside: (name: string): HTMLElement => screen.getByRole('complementary', {name}),
  urlSearch: (): HTMLElement => screen.getByRole('status', {name: 'url search'}),
  slice: (title: string): HTMLElement | undefined =>
    within(slices()).getAllByRole('listitem').find(item => within(item).queryByText(title) !== null),
  sliceLinks: (): (string | null)[] => within(slices()).getAllByRole('link').map(link => link.getAttribute('href')),
  stationsHolding: (holds: string): string[] =>
    within(screen.getByRole('list', {name: 'the stations'})).getAllByRole('listitem')
      .filter(station => within(station).queryAllByText(holds).length > 0).map(station => station.id)
};
