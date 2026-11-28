import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

type Step = '1 · Written in a card' | '2 · Moved to the page' | '3 · A bigger number arrives';

const find = (): Promise<HTMLElement> =>
  screen.findByRole('region', {name: 'A fixed banner, in a card and on the page'});

const stepIn = (exhibit: HTMLElement, step: Step): HTMLElement =>
  within(within(exhibit).getByRole('group', {name: 'Step'})).getByRole('radio', {name: step});

const sample = async (label: string): Promise<HTMLElement> => within(await find()).getAllByRole('figure')
  .filter(shown => (shown.textContent ?? '').startsWith(label))[0];

const trimmed = (lines: string): string[] => lines.split('\n').map(line => line.trim()).filter(Boolean);

const markedIn = async (label: string): Promise<string[]> =>
  within(await sample(label)).queryAllByRole('mark').map(({textContent}) => (textContent ?? '').trim());

export const bannerAtTheEdge = {
  step: async (step: Step): Promise<HTMLElement> => stepIn(await find(), step),
  stepTo: async (step: Step): Promise<void> => userEvent.click(stepIn(await find(), step)),
  verdict: async (): Promise<HTMLElement> => within(await find()).getByRole('status', {name: 'what the browser drew'}),
  line: async (label: string): Promise<HTMLElement> => within(await find()).getByRole('status', {name: label}),
  whereWeMeetIt: async (): Promise<HTMLElement> => within(await find()).getByRole('definition'),
  htmlLines: async (): Promise<string[]> => trimmed(within(await sample('HTML')).getByRole('code').textContent ?? ''),
  markedHtml: (): Promise<string[]> => markedIn('HTML'),
  markedCss: (): Promise<string[]> => markedIn('CSS')
};
