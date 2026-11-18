import {isInaccessible, screen, within} from '@testing-library/react';
import {not} from '@ryandur/sand';
import userEvent from '@testing-library/user-event';

const article = (): HTMLElement => screen.getByRole('article');
const drawing = (): HTMLElement => within(article()).getByRole('figure', {name: /^A page, pulled apart\./});

const openerLinkElements = (): HTMLElement[] => within(screen.getByRole('article')).getAllByRole('link');

export const homePage = {
  drawing,
  prose: (): HTMLElement[] => within(article()).getAllByRole('paragraph')
    .filter(paragraph => not(drawing().contains(paragraph))),
  openerLink: (name: string): HTMLElement => within(article()).getByRole('link', {name}),
  letteringHeard: (words: string[]): string[] =>
    words.filter(word => not(isInaccessible(within(drawing()).getByText(word)))),
  arrived: (): Promise<HTMLElement> => screen.findByRole('heading', {level: 1, name: 'The three languages'}),
  openerLinks: (): (string | null)[][] => openerLinkElements()
    .map(link => [link.textContent, link.getAttribute('href')]),
  followOpenerLink: (name: string): Promise<void> => {
    const named = openerLinkElements().filter(link => link.textContent === name);
    if (named.length !== 1) throw new Error(`${named.length} opener links named ${name}, not one`);
    return userEvent.click(named[0]);
  },
  sourcesLinked: (): string[] => within(screen.getByRole('main')).getAllByRole('link')
    .map(link => link.getAttribute('href') ?? '')
    .filter(source => new URL(source, window.location.href).origin !== window.location.origin)
};
