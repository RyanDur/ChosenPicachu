import {screen, within} from '@testing-library/react';
import {computeAccessibleName} from 'dom-accessibility-api';

const menuFor = (toggle: HTMLElement): HTMLElement =>
  screen.getByLabelText(`${toggle.getAttribute('aria-label') ?? ''}, chosen`);

export const rowMenu = {
  firstToggle: async (): Promise<HTMLElement> => {
    const [first] = await screen.findAllByRole('button', {name: /^Actions for /});
    return first;
  },
  actions: (toggle: HTMLElement): string[] =>
    within(menuFor(toggle)).getAllByRole('link', {hidden: true}).map(link => computeAccessibleName(link)),
  removal: (toggle: HTMLElement): HTMLElement => within(menuFor(toggle)).getByRole('button', {name: 'Remove', hidden: true})
};
