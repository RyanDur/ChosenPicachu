import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const findExpandButton = (): Promise<HTMLElement> => screen.findByRole('button', {name: 'Expand', expanded: false});

export const zIndexTab = {
  findFeatureStories: (): Promise<HTMLElement> => screen.findByRole('region', {name: 'let’s build this feature'}),
  headingIn: (holder: HTMLElement, name: string): HTMLElement => within(holder).getByRole('heading', {name}),
  fragmentOf: (heading: string): string => `#${screen.getByRole('heading', {name: heading}).id}`,
  codeIn: (holder: HTMLElement): HTMLElement => within(holder).getByRole('code'),
  labelOnSample: (holder: HTMLElement, sample: string, label: string): HTMLElement =>
    within(within(holder).getByRole('figure', {name: sample})).getByText(label),
  followLink: async (holder: HTMLElement, name: string): Promise<void> => userEvent.click(within(holder).getByRole('link', {name})),
  confirmationIn: (tutorial: HTMLElement): string[] =>
    within(within(tutorial).getByRole('list', {name: 'the confirmation'})).getAllByRole('listitem').map(line => line.textContent),
  findBannerControls: (): Promise<HTMLElement> => screen.findByRole('region', {name: 'banner controls'}),
  choose: async (controls: HTMLElement, dial: string, option: string): Promise<void> =>
    userEvent.click(within(within(controls).getByRole('group', {name: dial})).getByRole('radio', {name: option})),
  findExpandButton,
  expandCards: async (): Promise<void> => userEvent.click(await findExpandButton()),
  collapseButton: (): HTMLElement => screen.getByRole('button', {name: 'Collapse', expanded: true}),
  expandButtonIfAny: (): HTMLElement | null => screen.queryByRole('button', {name: 'Expand'})
};
