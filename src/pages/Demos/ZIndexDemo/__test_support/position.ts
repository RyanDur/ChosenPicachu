import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

type Position = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
type ParentPillWords = 'position: relative' | 'not positioned';

const pillsOf = (name: string): HTMLElement => screen.getByRole('group', {name});

const codeIn = (sample: HTMLElement): string => within(sample).getByRole('code').textContent ?? '';

export const positionExhibit = {
  choose: async (position: Position): Promise<void> =>
    userEvent.click(within(pillsOf('Second’s position is')).getByRole('radio', {name: position})),
  pill: (position: Position): HTMLElement =>
    within(pillsOf('Second’s position is')).getByRole('radio', {name: position}),
  chooseParent: async (parentPillWords: ParentPillWords): Promise<void> =>
    userEvent.click(within(pillsOf('And its parent is')).getByRole('radio', {name: parentPillWords})),
  parentPill: (parentPillWords: ParentPillWords): HTMLElement =>
    within(pillsOf('And its parent is')).getByRole('radio', {name: parentPillWords}),
  samples: (): {html: string; css: string} => {
    const figures = within(screen.getByRole('region', {name: 'Where Second goes'})).getAllByRole('figure');
    const [html] = figures.filter(sample => (sample.textContent ?? '').startsWith('HTML'));
    const [css] = figures.filter(sample => (sample.textContent ?? '').startsWith('CSS'));
    return {html: codeIn(html), css: codeIn(css)};
  },
  measuredFrom: (): HTMLElement => screen.getByRole('status', {name: 'Measured from:'}),
  whereSecondWent: (): HTMLElement => screen.getByRole('status', {name: 'where Second went'}),
  parentPills: (): HTMLElement => pillsOf('And its parent is'),
  queryParentPills: (): HTMLElement | null => screen.queryByRole('group', {name: 'And its parent is'})
};
