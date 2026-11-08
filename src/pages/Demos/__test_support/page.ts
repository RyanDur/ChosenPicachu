import {not} from '@ryandur/sand';
import {screen, within} from '@testing-library/react';
import {demoAddress, DemoTopics} from '@pages/Demos/types';

const untilTheTabMounts = {timeout: 5000};

const tabAddresses = Object.values(DemoTopics).map(demoAddress);

const linksToTabsIn = (holder: HTMLElement): string[][] => within(holder).getAllByRole('link')
  .map(link => [link.textContent ?? '', link.getAttribute('href') ?? ''])
  .filter(([, address]) => tabAddresses.includes(address));

export const assumedLinksIn = (holder: HTMLElement): (string | null)[][] =>
  within(within(holder).getByText(/^This tab assumes/)).getAllByRole('link').map(link => [link.textContent, link.getAttribute('href')]);

const slices = (): HTMLElement => screen.getByRole('list', {name: 'the slices'});

export const demoPage = {
  assumedLinks: (): (string | null)[][] => assumedLinksIn(document.body),
  part: (name: string): HTMLElement => screen.getByRole('region', {name}),
  title: (name: string): HTMLElement => screen.getByRole('heading', {name}),
  findTitle: (name: string): Promise<HTMLElement> => screen.findByRole('heading', {name}, untilTheTabMounts),
  says: (told: string | RegExp): HTMLElement => screen.getByText(told),
  findSays: (told: string | RegExp): Promise<HTMLElement> => screen.findByText(told, {}, untilTheTabMounts),
  signpost: (name: string): HTMLElement => screen.getByRole('link', {name}),
  row: (name: string | RegExp): HTMLElement => screen.getByRole('rowheader', {name}),
  unanswered: (name: string): HTMLElement => screen.getByRole('complementary', {name}),
  wholePage: (): HTMLElement => screen.getByRole('main'),
  linksToTabsIn,
  linksToTabs: (): string[][] => linksToTabsIn(document.body),
  urlSearch: (): HTMLElement => screen.getByRole('status', {name: 'url search'}),
  sliceLinks: (): (string | null)[] => within(slices()).getAllByRole('link').map(link => link.getAttribute('href')),
  sliceLinksLandingNowhere: (): string[] => within(slices()).getAllByRole('link').map(link => link.getAttribute('href') ?? '')
    .filter(address => not(document.getElementById(address.replace(/^#/, ''))))
};
