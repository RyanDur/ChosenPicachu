import {maybe, not} from '@ryandur/sand';
import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const settingsSheet = () =>
  maybe(screen.getAllByRole('group', {hidden: true})
    .find(group => not(maybe(within(group).queryByRole('combobox', {name: 'Museum', hidden: true})).isNothing)))
    .either(sheet => within(sheet), () => {
      throw new Error('no gallery settings sheet on the page');
    });

export const galleryPage = {
  headerShows: (title: string): Promise<HTMLElement> => within(screen.getByRole('banner')).findByText(title),
  museumsAppear: (): Promise<HTMLElement> => screen.findByRole('navigation', {name: 'museums'}),
  museumsIfAny: (): HTMLElement | null => screen.queryByRole('navigation', {name: 'museums'}),
  museumAppears: (name: string): Promise<HTMLElement> => screen.findByRole('link', {name}),
  museum: (name: string): HTMLElement => screen.getByRole('link', {name}),
  museumIfAny: (name: string): HTMLElement | null => screen.queryByRole('link', {name}),
  currentMuseum: (name: string): Promise<HTMLElement> => screen.findByRole('link', {name, current: 'page'}),
  enter: async (name: string): Promise<void> => userEvent.click(await screen.findByRole('link', {name})),
  emptyWallIfAny: (): HTMLElement | null => screen.queryByAltText('the museum answered with nothing'),
  noMuseumOpen: (): Promise<HTMLElement> => screen.findByAltText('no museum is open'),
  urlSearch: (): HTMLElement => screen.getByRole('status', {name: 'url search'}),
  pagination: (): HTMLElement => screen.getByRole('navigation', {name: 'pagination'}),
  nextPage: (): Promise<void> => userEvent.click(screen.getByRole('link', {name: 'next page'})),
  museumChosen: (): string =>
    within(screen.getByRole('combobox', {name: 'Museum', hidden: true}))
      .getAllByRole<HTMLOptionElement>('option', {hidden: true})
      .filter(({selected}) => selected)
      .map(({textContent}) => textContent ?? '')
      .join(),
  searchInSettings: (words: string): Promise<void> =>
    userEvent.type(settingsSheet().getByRole('combobox', {name: 'Search', hidden: true}), `${words}{Enter}`),
  typeInSettingsAndLeave: async (words: string): Promise<void> => {
    await userEvent.type(settingsSheet().getByRole('combobox', {name: 'Search', hidden: true}), words);
    await userEvent.tab();
  },
  clearSearchInSettings: async (): Promise<void> => {
    const field = settingsSheet().getByRole('combobox', {name: 'Search', hidden: true});
    await userEvent.clear(field);
    await userEvent.type(field, '{Enter}');
  },
  sizeInSettings: async (size: number): Promise<void> => {
    const field = settingsSheet().getByRole('spinbutton', {name: 'Per page', hidden: true});
    await userEvent.clear(field);
    await userEvent.type(field, `${size}{Enter}`);
  },
  pageInSettings: (): HTMLElement => settingsSheet().getByRole('spinbutton', {name: 'Page', hidden: true}),
  tapPageInSettings: (): Promise<void> =>
    userEvent.click(settingsSheet().getByRole('spinbutton', {name: 'Page', hidden: true})),
  leaveTheField: (): Promise<void> => userEvent.tab(),
  chooseMuseum: (name: string): Promise<void> =>
    userEvent.selectOptions(screen.getByRole('combobox', {name: 'Museum', hidden: true}), name),
  museumsOffered: (): string[] =>
    within(screen.getByRole('combobox', {name: 'Museum', hidden: true}))
      .getAllByRole('option', {hidden: true})
      .map(({textContent}) => textContent ?? '')
};
