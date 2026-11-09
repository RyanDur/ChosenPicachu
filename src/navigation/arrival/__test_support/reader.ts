import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const aFrame = 16;

type ArrivingReader = {
  readonly follows: (link: string) => Promise<void>;
  readonly goesBack: () => Promise<void>;
  readonly presses: (key: string) => Promise<void>;
  readonly waits: (milliseconds: number) => Promise<void>;
  readonly sees: (heading: string) => Promise<void>;
  readonly seesTheAddress: (address: string) => Promise<void>;
  readonly heading: (name: string) => HTMLElement;
  readonly fold: () => HTMLElement;
  readonly headingsFocused: () => readonly string[];
};

export const arrivingReader = (): ArrivingReader => {
  const user = userEvent.setup({delay: null});
  const focused: string[] = [];
  const noteFocus = ({target}: FocusEvent): void => {
    const heading = screen.queryAllByRole('heading').find(each => each === target);
    if (heading) focused.push(heading.textContent);
  };
  document.addEventListener('focusin', noteFocus);
  onTestFinished(() => document.removeEventListener('focusin', noteFocus));
  return {
    follows: link => user.click(screen.getByRole('link', {name: link})),
    goesBack: () => user.click(screen.getByRole('button', {name: 'back'})),
    presses: key => user.keyboard(key),
    waits: async milliseconds => {
      for (let passed = 0; passed < milliseconds; passed += aFrame) await vi.advanceTimersByTimeAsync(aFrame);
    },
    sees: async heading => {
      await screen.findByRole('heading', {name: heading});
    },
    seesTheAddress: async address => {
      await screen.findByText(`at ${address}`);
    },
    heading: name => screen.getByRole('heading', {name}),
    fold: () => screen.getByRole('group'),
    headingsFocused: () => focused
  };
};
