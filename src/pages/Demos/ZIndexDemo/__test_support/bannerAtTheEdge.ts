import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const find = (): Promise<HTMLElement> => screen.findByRole('region', {name: 'The banner at the window’s edge'});

export const bannerAtTheEdge = {
  stepTo: async (step: string): Promise<void> =>
    userEvent.click(within(within(await find()).getByRole('group', {name: 'Step'})).getByRole('radio', {name: step})),
  verdict: async (): Promise<HTMLElement> => within(await find()).getByRole('status', {name: 'what the browser drew'}),
  line: async (label: string): Promise<HTMLElement> => within(await find()).getByRole('status', {name: label}),
  whereWeMeetIt: async (): Promise<HTMLElement> => within(await find()).getByRole('definition')
};
