import {render, RenderResult} from '@testing-library/react';
import {Environment} from '@transport';
import {TestApp} from './TestApp';

const feedbackThatCrashes: Partial<Environment> = {
  get feedbackToken(): string {
    throw new Error('the frame broke');
  }
};

export const renderCrashedFrame = (): RenderResult =>
  render(<TestApp environment={feedbackThatCrashes}/>, {onCaughtError: () => undefined});
