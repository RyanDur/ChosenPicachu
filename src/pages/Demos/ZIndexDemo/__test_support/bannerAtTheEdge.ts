import {screen, within} from '@testing-library/react';

const find = (): Promise<HTMLElement> => screen.findByRole('region', {name: 'The banner at the window’s edge'});

export const bannerAtTheEdge = {
  verdict: async (): Promise<HTMLElement> => within(await find()).getByRole('status', {name: 'what the browser drew'}),
  line: async (label: string): Promise<HTMLElement> => within(await find()).getByRole('status', {name: label}),
  whereWeMeetIt: async (): Promise<HTMLElement> => within(await find()).getByRole('definition')
};
