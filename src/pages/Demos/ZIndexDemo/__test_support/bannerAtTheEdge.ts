import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

type Step = '1 · Written in a card' | '2 · Moved to the page';

const find = (): Promise<HTMLElement> => screen.findByRole('region', {name: 'The banner at the window’s edge'});

const stepIn = (exhibit: HTMLElement, step: Step): HTMLElement =>
  within(within(exhibit).getByRole('group', {name: 'Step'})).getByRole('radio', {name: step});

const html = async (): Promise<HTMLElement> => within(await find()).getAllByRole('figure')
  .filter(sample => (sample.textContent ?? '').startsWith('HTML'))[0];

const trimmed = (lines: string): string[] => lines.split('\n').map(line => line.trim()).filter(Boolean);

export const bannerAtTheEdge = {
  step: async (step: Step): Promise<HTMLElement> => stepIn(await find(), step),
  stepTo: async (step: Step): Promise<void> => userEvent.click(stepIn(await find(), step)),
  verdict: async (): Promise<HTMLElement> => within(await find()).getByRole('status', {name: 'what the browser drew'}),
  line: async (label: string): Promise<HTMLElement> => within(await find()).getByRole('status', {name: label}),
  whereWeMeetIt: async (): Promise<HTMLElement> => within(await find()).getByRole('definition'),
  htmlLines: async (): Promise<string[]> => trimmed(within(await html()).getByRole('code').textContent ?? ''),
  markedHtml: async (): Promise<string[]> =>
    within(await html()).queryAllByRole('mark').map(({textContent}) => (textContent ?? '').trim())
};
