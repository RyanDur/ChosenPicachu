import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {readingOf} from '@pages/Demos/Controls/__test_support/reading';

const findExpand = (): Promise<HTMLElement> => screen.findByRole('button', {name: 'Expand', expanded: false});

export const zIndexTab = {
  findFeatureStories: (): Promise<HTMLElement> => screen.findByRole('region', {name: 'let’s build this feature'}),
  fragmentOf: (heading: string): string => `#${screen.getByRole('heading', {name: heading}).id}`,
  follow: async (holder: HTMLElement, name: string): Promise<void> => userEvent.click(within(holder).getByRole('link', {name})),
  findBannerControls: (): Promise<HTMLElement> => screen.findByRole('region', {name: 'banner controls'}),
  choose: async (controls: HTMLElement, dial: string, option: string): Promise<void> =>
    userEvent.click(within(within(controls).getByRole('group', {name: dial})).getByRole('radio', {name: option})),
  readingOf,
  findExpand,
  expandCards: async (): Promise<void> => userEvent.click(await findExpand()),
  collapseOnOffer: (): HTMLElement => screen.getByRole('button', {name: 'Collapse', expanded: true}),
  expandOnOffer: (): HTMLElement | null => screen.queryByRole('button', {name: 'Expand'})
};
