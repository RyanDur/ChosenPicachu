import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {readingOf} from '@pages/Demos/Controls/__test_support/reading';
import {explanation} from '@pages/Demos/Recipe/__test_support';

const findExpand = (): Promise<HTMLElement> => screen.findByRole('button', {name: 'Expand', expanded: false});

const linkToTheBannerStory = (part: HTMLElement): HTMLElement =>
  explanation.linkInProse(part, 'Let’s build this feature');

const sizeLine = /^Six parts, about \d+ minutes\.$/;

export const zIndexTab = {
  opening: (): Promise<HTMLElement> => screen.findByText(/^Where two boxes on a page overlap/),
  pile: (): Promise<HTMLElement> => screen.findByRole('figure', {name: /^The pile\./}),
  size: (): Promise<HTMLElement> => screen.findByText(sizeLine),
  sizeIn: (holder: HTMLElement): Promise<HTMLElement> => within(holder).findByText(sizeLine),
  findFeatureStories: (): Promise<HTMLElement> => screen.findByRole('region', {name: 'Let’s build this feature'}),
  fragmentOf: (heading: string): string => `#${screen.getByRole('heading', {name: heading}).id}`,
  linkToTheBannerStory,
  followToTheBannerStory: async (part: HTMLElement): Promise<void> => userEvent.click(linkToTheBannerStory(part)),
  findBannerControls: (): Promise<HTMLElement> => screen.findByRole('region', {name: 'banner controls'}),
  choose: async (controls: HTMLElement, dial: string, option: string): Promise<void> =>
    userEvent.click(within(within(controls).getByRole('group', {name: dial})).getByRole('radio', {name: option})),
  place: (): Promise<HTMLElement> => screen.findByText(/part \d+ of \d+/),
  firstExhibitIn: (part: HTMLElement): HTMLElement => within(part).getAllByRole('figure')[0],
  readingOf,
  findExpand,
  expandCards: async (): Promise<void> => userEvent.click(await findExpand()),
  collapseOnOffer: (): HTMLElement => screen.getByRole('button', {name: 'Collapse', expanded: true}),
  expandOnOffer: (): HTMLElement | null => screen.queryByRole('button', {name: 'Expand'})
};
