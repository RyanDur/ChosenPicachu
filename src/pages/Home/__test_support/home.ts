import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const openerLinkElements = (): HTMLElement[] => {
  const firstSection = within(screen.getByRole('article')).getAllByRole('heading', {level: 2})[0];
  return within(screen.getByRole('article')).getAllByRole('link')
    .filter(link => Boolean(firstSection.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_PRECEDING));
};
const section = (name: string): HTMLElement => screen.getByRole('region', {name});

export const homePage = {
  arrived: (): Promise<HTMLElement> => screen.findByRole('heading', {level: 2, name: 'Where the page is made'}),
  openerLinks: (): (string | null)[][] => openerLinkElements()
    .map(link => [link.textContent, link.getAttribute('href')]),
  followOpenerLink: (name: string): Promise<void> => {
    const named = openerLinkElements().filter(link => link.textContent === name);
    if (named.length !== 1) throw new Error(`${named.length} opener links named ${name}, not one`);
    return userEvent.click(named[0]);
  },
  sectionHeadings: (): (string | null)[] => within(screen.getByRole('article')).getAllByRole('heading', {level: 2}).map(heading => heading.textContent),
  sectionLinks: (name: string): HTMLElement[] => within(section(name)).getAllByRole('link'),
  sourcesLinked: (): string[] => within(screen.getByRole('main')).getAllByRole('link')
    .map(link => link.getAttribute('href') ?? '')
    .filter(source => new URL(source, window.location.href).origin !== window.location.origin)
};
