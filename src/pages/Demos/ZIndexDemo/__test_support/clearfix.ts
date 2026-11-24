import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

type Step = '1 · In the flow' | '2 · Float' | '3 · The clearfix' | '4 · What we have now';

const exhibitFigure = (): HTMLElement => screen.getByRole('figure', {name: /^Where Second goes\./});

const steps = (): HTMLElement => within(exhibitFigure()).getByRole('group', {name: 'The parent that lost its height'});

export const clearfixTray = {
  stepsTo: async (step: Step): Promise<void> => userEvent.click(within(steps()).getByRole('radio', {name: step})),
  step: (step: Step): HTMLElement => within(steps()).getByRole('radio', {name: step}),
  markedRules: (): string[] => {
    const [css] = within(exhibitFigure()).getAllByRole('figure')
      .filter(sample => (sample.textContent ?? '').startsWith('CSS')).slice(-1);
    return within(css).queryAllByRole('mark').map(({textContent}) => (textContent ?? '').trim());
  }
};
