import {computeAccessibleName} from 'dom-accessibility-api';

const directionWord = / (up|down)$/;

export const ticked = {
  heardIn: (cell: HTMLElement): string => directionWord.exec(computeAccessibleName(cell))?.[1] ?? 'none',
  numberIn: (text: string): string => text.replace(directionWord, '')
};
