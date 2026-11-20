import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {readingOf} from '@pages/Demos/Controls/__test_support/reading';

const region = (): HTMLElement => screen.getByRole('complementary', {name: 'dials'});

const option = (name: string): HTMLElement => within(region()).getByRole('radio', {name});

export const listControls = {
  panel: (): Promise<HTMLElement> => screen.findByRole('complementary', {name: 'dials'}),
  dial: (name: string): HTMLElement => within(region()).getByRole('group', {name}),
  option,
  reading: (dial: string): HTMLElement => readingOf(region(), dial),
  choose: async (name: string): Promise<void> => userEvent.click(option(name))
};
