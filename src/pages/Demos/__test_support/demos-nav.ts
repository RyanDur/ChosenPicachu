import {screen, within} from '@testing-library/react';

const demos = (): Promise<HTMLElement> => screen.findByRole('navigation', {name: 'demos'});

export const demosNav = {
  bar: async (): Promise<HTMLElement> => within(await demos()).getByRole('list'),
  navigation: demos
};
