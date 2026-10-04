import {computeAccessibleName} from 'dom-accessibility-api';
import {not} from '@ryandur/sand';

const comesAfter = (steps: HTMLElement, control: HTMLElement): boolean =>
  Boolean(steps.compareDocumentPosition(control) & Node.DOCUMENT_POSITION_FOLLOWING);

export const controlsBeforeTheSteps = (steps: HTMLElement, controls: HTMLElement[]): string[] => controls
  .filter(control => not(comesAfter(steps, control)))
  .map(control => computeAccessibleName(control));
