import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Paths} from '@pages/Paths';

const practice = (): HTMLElement => screen.getByRole('region', {name: 'how I organize it'});
const tabs = (): HTMLElement => screen.getByRole('navigation', {name: 'practice'});

export const practiceAt = (concern: string): string => `${Paths.practice}${concern}/`;

export const practicePage = {
  arrivedOn: (concern: string): Promise<HTMLElement> => screen.findByRole('heading', {name: `Practice ${concern}`, level: 1}),
  tabAddresses: (): (string | null)[] => within(tabs()).getAllByRole('link').map(tab => tab.getAttribute('href')),
  currentTab: (): string => within(tabs()).getByRole('link', {current: 'page'}).textContent ?? '',
  pickTab: (concern: string): Promise<void> => userEvent.click(within(tabs()).getByRole('link', {name: concern})),
  opener: (): Promise<HTMLElement> => screen.findByText(/^Each tab below is one of the three concerns/),
  comesBeforeTheTabs: (element: HTMLElement): boolean => Boolean(element.compareDocumentPosition(tabs()) & Node.DOCUMENT_POSITION_FOLLOWING),
  heading: (): HTMLElement => within(practice()).getByRole('heading', {name: 'how I organize it', level: 2}),
  paragraph: (opening: RegExp): HTMLElement => within(practice()).getByText(opening),
  link: (name: string | RegExp): HTMLElement => within(practice()).getByRole('link', {name}),
  citations: (): (string | null | undefined)[][] => within(practice()).getAllByRole('link')
    .filter(link => (link.getAttribute('href') ?? '').startsWith(Paths.record))
    .map(link => [/\d{4}/.exec(link.textContent ?? '')?.[0], link.getAttribute('href')]),
  followMoment: async (name: string): Promise<void> => {
    await screen.findByRole('region', {name: 'how I organize it'});
    await userEvent.click(within(practice()).getAllByRole('link', {name})[0]);
  }
};
