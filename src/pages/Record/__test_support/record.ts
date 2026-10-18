import {screen, within} from '@testing-library/react';

const research = (): HTMLElement => screen.getByRole('region', {name: 'The research'});

export const recordPage = {
  shelvedAs: (work: string): HTMLElement => {
    const entry = within(research()).getAllByRole('listitem', {hidden: true})
      .find(candidate => within(candidate).queryByRole('link', {name: work, hidden: true}) !== null);
    if (entry) {
      return entry;
    }
    throw new Error(`no work on the research shelf named ${work}`);
  },
  shelfHeadings: (): (string | null)[] => within(research()).getAllByRole('heading', {level: 3, hidden: true}).map(heading => heading.textContent)
};
