import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {itemHeadedBy} from '@__test_support/headed-item';
import {paragraphOpening} from '@__test_support/paragraph';

const research = (): HTMLElement => screen.getByRole('region', {name: 'The research'});
const concert = (): HTMLElement => screen.getByRole('region', {name: 'The concert'});
const story = (name: string): HTMLElement => screen.getByRole('region', {name});
const storyMoments = (name: string): HTMLElement => within(story(name)).getByRole('list', {name: `${name}, the moments it rests on`});
const openFullerStory = async (title: string): Promise<void> =>
  userEvent.click(within(itemHeadedBy('the timeline', title)).getByText('the fuller story'));

const shelvedAs = (work: string): HTMLElement => {
  const entry = within(research()).getAllByRole('listitem', {hidden: true})
    .find(candidate => within(candidate).queryByRole('link', {name: work, hidden: true}) !== null);
  if (entry) {
    return entry;
  }
  throw new Error(`no work on the research shelf named ${work}`);
};

export const recordPage = {
  arrived: (): Promise<HTMLElement> => screen.findByRole('region', {name: 'The research'}),
  momentsTold: async (): Promise<string | undefined> =>
    /one sentence said ([a-z-]+) ways/.exec((await screen.findByText(/one sentence said/)).textContent)?.[1],
  paragraphOpening,
  argument: (): HTMLElement => screen.getByText(/^The home page says what each language is for/),
  parts: (): HTMLElement => screen.getByText(/^The page supports that in four parts/),
  openingQuotation: (): HTMLElement => screen.getByText(/a web of nodes in which the user can browse at will/),
  openingQuotationSource: (): HTMLElement => screen.getByRole('link', {name: /^proposing the WorldWideWeb, 1990$/}),
  storyHeading: (name: string): HTMLElement => within(story(name)).getByRole('heading', {level: 2, name}),
  storyEssay: (name: string): string[] => within(story(name)).getAllByRole('paragraph').map(paragraph => paragraph.textContent ?? ''),
  storyQuotations: (name: string, quoted: string): HTMLElement[] => within(story(name)).getAllByRole('link', {name: quoted}),
  storyLink: (name: string, link: string): HTMLElement => within(story(name)).getByRole('link', {name: link}),
  storyMomentsHeading: (name: string): HTMLElement => within(story(name)).getByRole('heading', {level: 3, name: 'the moments it rests on'}),
  storyMomentLines: (name: string): (string | null)[] => within(storyMoments(name)).getAllByRole('link').map(line => line.textContent),
  storyMomentLine: (name: string, line: string): HTMLElement => within(storyMoments(name)).getByRole('link', {name: line}),
  timeline: (): HTMLElement => screen.getByRole('region', {name: 'How the web got its languages'}),
  concert,
  concertLinks: (): (string | null)[][] => within(concert()).getAllByRole('link')
    .map(link => [link.textContent, link.getAttribute('href')]),
  followConcertLink: async (name: string): Promise<void> =>
    userEvent.click(within(concert()).getByRole('link', {name})),
  timelineHeading: (): HTMLElement => screen.getByRole('heading', {level: 2, name: 'How the web got its languages'}),
  shelvedAs,
  shelfHolding: (work: string): string | null => {
    const shelf = within(research()).getAllByRole('region', {hidden: true})
      .find(candidate => within(candidate).queryByRole('link', {name: work, hidden: true}) !== null);
    if (shelf) {
      return within(shelf).getByRole('heading', {level: 3, hidden: true}).textContent;
    }
    throw new Error(`no shelf holds ${work}`);
  },
  shelvedSources: (): (string | null)[] => within(research()).getAllByRole('link', {hidden: true}).map(work => work.getAttribute('href')),
  sourcesLinked: (): string[] => {
    const shelf = research();
    return within(screen.getByRole('article')).getAllByRole('link', {hidden: true})
      .filter(link => !shelf.contains(link))
      .map(link => link.getAttribute('href') ?? '')
      .filter(source => new URL(source, window.location.href).origin !== window.location.origin);
  },
  openFullerStory,
  momentLink: (title: string, name: string): HTMLElement =>
    within(itemHeadedBy('the timeline', title)).getByRole('link', {name, hidden: true}),
  followFromMoment: async (title: string, name: string): Promise<void> => {
    await openFullerStory(title);
    await userEvent.click(within(itemHeadedBy('the timeline', title)).getByRole('link', {name}));
  },
  momentsOf: (year: string): (string | null)[][] => within(screen.getByRole('list', {name: year})).getAllByRole('listitem').map(moment => [
    within(moment).getByRole('time').getAttribute('datetime'),
    within(moment).getByRole('time').textContent,
    within(moment).getByText(/^(Structure|Presentation|Behavior)/).textContent,
    within(moment).getByRole('heading', {level: 4}).textContent
  ]),
  fullerStories: (): HTMLElement[] => within(screen.getByRole('list', {name: 'the timeline'})).getAllByRole('group')
    .filter(fold => within(fold).queryByText('the fuller story') !== null),
  periodSample: (name: string): HTMLElement => screen.getByRole('group', {name}),
  tabStopsIn: async (story: string): Promise<Element[]> => {
    const told = itemHeadedBy('the timeline', story);
    const reached: Element[] = [];
    within(told).getAllByRole('link')[0].focus();
    while (document.activeElement && told.contains(document.activeElement)) {
      reached.push(document.activeElement);
      await userEvent.tab();
    }
    return reached;
  },
  shelfHeadings: (): (string | null)[] => within(research()).getAllByRole('heading', {level: 3, hidden: true}).map(heading => heading.textContent)
};
