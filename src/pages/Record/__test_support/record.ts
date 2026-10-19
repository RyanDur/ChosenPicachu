import {screen, within} from '@testing-library/react';

const research = (): HTMLElement => screen.getByRole('region', {name: 'The research'});
const story = (name: string): HTMLElement => screen.getByRole('region', {name});
const storyMoments = (name: string): HTMLElement => within(story(name)).getByRole('list', {name: `${name}, the moments it rests on`});

export const recordPage = {
  arrived: (): Promise<HTMLElement> => screen.findByRole('region', {name: 'The research'}),
  argument: (): HTMLElement => screen.getByText(/^A webpage is three languages, and they were designed apart/),
  parts: (): HTMLElement => screen.getByText(/^The page supports that in four parts/),
  openingQuotation: (): HTMLElement => screen.getByText(/a web of nodes in which the user can browse at will/),
  openingQuotationSource: (): HTMLElement => screen.getByRole('link', {name: /^proposing the WorldWideWeb, 1990$/}),
  storyHeading: (name: string): HTMLElement => within(story(name)).getByRole('heading', {level: 2, name}),
  storyEssay: (name: string): string[] => within(story(name)).getAllByRole('paragraph').map(paragraph => paragraph.textContent ?? ''),
  storyQuotations: (name: string, quoted: string): HTMLElement[] => within(story(name)).getAllByRole('link', {name: quoted}),
  storyMomentsHeading: (name: string): HTMLElement => within(story(name)).getByRole('heading', {level: 3, name: 'the moments it rests on'}),
  storyMomentLines: (name: string): (string | null)[] => within(storyMoments(name)).getAllByRole('link').map(line => line.textContent),
  storyMomentLine: (name: string, line: string): HTMLElement => within(storyMoments(name)).getByRole('link', {name: line}),
  timelineHeading: (): HTMLElement => screen.getByRole('heading', {level: 2, name: 'How the web got its languages'}),
  shelvedAs: (work: string): HTMLElement => {
    const entry = within(research()).getAllByRole('listitem', {hidden: true})
      .find(candidate => within(candidate).queryByRole('link', {name: work, hidden: true}) !== null);
    if (entry) {
      return entry;
    }
    throw new Error(`no work on the research shelf named ${work}`);
  },
  shelvedSources: (): (string | null)[] => within(research()).getAllByRole('link', {hidden: true}).map(work => work.getAttribute('href')),
  sourcesLinked: (): string[] => within(screen.getByRole('article')).getAllByRole('link', {hidden: true})
    .filter(link => !research().contains(link))
    .map(link => link.getAttribute('href') ?? '')
    .filter(source => new URL(source, window.location.href).origin !== window.location.origin),
  shelfHeadings: (): (string | null)[] => within(research()).getAllByRole('heading', {level: 3, hidden: true}).map(heading => heading.textContent)
};
