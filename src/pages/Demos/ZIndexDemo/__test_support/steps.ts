import {within} from '@testing-library/react';
import {computeAccessibleName} from 'dom-accessibility-api';
import {not} from '@ryandur/sand';

const comesAfter = (steps: HTMLElement, control: HTMLElement): boolean =>
  Boolean(steps.compareDocumentPosition(control) & Node.DOCUMENT_POSITION_FOLLOWING);

export const exhibit = {
  controlsBeforeTheSteps: (figure: HTMLElement): string[] => {
    const [steps] = within(figure).getAllByRole('list');
    return [...within(figure).queryAllByRole('button'), ...within(figure).queryAllByRole('checkbox')]
      .filter(control => not(comesAfter(steps, control)))
      .map(control => computeAccessibleName(control));
  }
};
