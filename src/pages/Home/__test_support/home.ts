import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const openerLinkElements = (): HTMLElement[] => within(screen.getByRole('article')).getAllByRole('link');

export const homePage = {
  arrived: (): Promise<HTMLElement> => screen.findByRole('article'),
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
