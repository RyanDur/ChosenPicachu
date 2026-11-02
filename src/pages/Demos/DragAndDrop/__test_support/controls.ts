import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {readingOf} from '@pages/Demos/Controls/__test_support/reading';

const region = (): HTMLElement => screen.getByRole('region', {name: 'list controls'});

const option = (name: string): HTMLElement => within(region()).getByRole('radio', {name});

export const listControls = {
  heading: (): Promise<HTMLElement> => screen.findByRole('heading', {name: 'list controls', level: 4}),
  option,
  reading: (dial: string): HTMLElement => readingOf(region(), dial),
  choose: async (name: string): Promise<void> => userEvent.click(option(name))
};
