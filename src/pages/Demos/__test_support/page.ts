import {screen, within} from '@testing-library/react';
import {demoAddress, DemoTopics} from '@pages/Demos/types';

const untilTheTabMounts = {timeout: 5000};

const tabAddresses = Object.values(DemoTopics).map(demoAddress);

const slices = (): HTMLElement => screen.getByRole('list', {name: 'the slices'});

export const demoPage = {
  part: (name: string): HTMLElement => screen.getByRole('region', {name}),
  title: (name: string): HTMLElement => screen.getByRole('heading', {name}),
  findTitle: (name: string): Promise<HTMLElement> => screen.findByRole('heading', {name}, untilTheTabMounts),
  says: (told: string | RegExp): HTMLElement => screen.getByText(told),
  everySaying: (told: RegExp): HTMLElement[] => screen.getAllByText(told),
  findSays: (told: string | RegExp): Promise<HTMLElement> => screen.findByText(told, {}, untilTheTabMounts),
  saidAnywhere: (told: string): HTMLElement | null => screen.queryByText(told),
  signpost: (name: string): HTMLElement => screen.getByRole('link', {name}),
  row: (name: string | RegExp): HTMLElement => screen.getByRole('rowheader', {name}),
  unanswered: (name: string): HTMLElement => screen.getByRole('complementary', {name}),
  wholePage: (): HTMLElement => screen.getByRole('main'),
  linksToTabsIn: (holder: HTMLElement): string[][] => within(holder).getAllByRole('link')
    .map(link => [link.textContent, link.getAttribute('href') ?? ''])
    .filter(([, address]) => tabAddresses.includes(address)),
  urlSearch: (): HTMLElement => screen.getByRole('status', {name: 'url search'}),
  slice: (title: string): HTMLElement | undefined =>
    within(slices()).getAllByRole('listitem').find(item => within(item).queryByText(title) !== null),
  sliceLinks: (): (string | null)[] => within(slices()).getAllByRole('link').map(link => link.getAttribute('href')),
  stationsHolding: (holds: string): string[] =>
    within(screen.getByRole('list', {name: 'the stations'})).getAllByRole('listitem')
      .filter(station => within(station).queryAllByText(holds).length > 0).map(station => station.id)
};
