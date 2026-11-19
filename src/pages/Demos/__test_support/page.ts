import {computeAccessibleName} from 'dom-accessibility-api';
import {maybe, not} from '@ryandur/sand';
import {screen, within} from '@testing-library/react';
import {DemoTopics} from '@pages/Demos/demo-topics';
import {demoTab} from '@pages/Demos/demo-tab';

const untilTheTabMounts = {timeout: 5000};

const tabAddresses = Object.values(DemoTopics).map(demoTab.address);

const hrefOf = (link: HTMLElement): string => maybe(link.getAttribute('href')).orElse('');

const addressOf = (link: HTMLElement): URL => new URL(hrefOf(link), 'http://site');

const toTabs = (links: HTMLElement[]): string[][] => links
  .map(link => [link.textContent, hrefOf(link)])
  .filter(([, address]) => tabAddresses.includes(address));

const linksToTabsIn = (holder: HTMLElement): string[][] => toTabs(within(holder).getAllByRole('link'));

const pageAndPlaceOf = (link: HTMLElement): string => {
  const {pathname, hash} = addressOf(link);
  return `${pathname}${hash}`;
};

const toPage = (links: HTMLElement[], address: string): string[][] => links
  .map(link => [link.textContent, pageAndPlaceOf(link)])
  .filter(([, href]) => href === address);

const linksToPageIn = (holder: HTMLElement, address: string): string[][] =>
  toPage(within(holder).getAllByRole('link'), address);

const linksOffTheRail = (): HTMLElement[] => {
  const rail = screen.getByRole('region', {name: 'pages and feedback'});
  return screen.getAllByRole('link').filter(link => not(rail.contains(link)));
};

export const assumedLinksIn = (holder: HTMLElement): (string | null)[][] =>
  within(within(holder).getByText(/^This tab assumes/)).getAllByRole('link').map(link => [link.textContent, link.getAttribute('href')]);

const slices = (): HTMLElement => screen.getByRole('list', {name: 'the slices'});

const stationOf = (link: HTMLElement): string => addressOf(link).hash.replace(/^#/, '');

const sliceStations = (): string[] => within(slices()).getAllByRole('link').map(stationOf);

const missing = (stations: string[]): string[] => stations.filter(station => not(document.getElementById(station)));

export const demoPage = {
  assumedLinks: (): (string | null)[][] => assumedLinksIn(document.body),
  part: (name: string): HTMLElement => screen.getByRole('region', {name}),
  title: (name: string): HTMLElement => screen.getByRole('heading', {name}),
  findTitle: (name: string): Promise<HTMLElement> => screen.findByRole('heading', {name}, untilTheTabMounts),
  says: (told: string | RegExp): HTMLElement => screen.getByText(told),
  findSays: (told: string | RegExp): Promise<HTMLElement> => screen.findByText(told, {}, untilTheTabMounts),
  alertSaying: async (told: string): Promise<HTMLElement> => within(await screen.findByRole('alert')).findByText(told),
  signpost: (name: string): HTMLElement => screen.getByRole('link', {name}),
  signpostAddresses: (name: string): string[] => screen.getAllByRole('link', {name}).map(hrefOf),
  row: (name: string | RegExp): HTMLElement => screen.getByRole('rowheader', {name}),
  unanswered: (name: string): HTMLElement => screen.getByRole('complementary', {name}),
  wholePage: (): HTMLElement => screen.getByRole('main'),
  linksToTabsIn,
  linksToPageIn,
  linksToPage: (address: string): string[][] => toPage(linksOffTheRail(), address),
  linksToTabs: (): string[][] => toTabs(linksOffTheRail()),
  urlSearch: (): HTMLElement => screen.getByRole('status', {name: 'url search'}),
  sliceLinks: (): (string | null)[] => within(slices()).getAllByRole('link').map(link => link.getAttribute('href')),
  sliceLinkNames: (): string[] => within(slices()).getAllByRole('link').map(link => computeAccessibleName(link)),
  sliceLinksLandingNowhere: (): string[] => missing(sliceStations())
};
