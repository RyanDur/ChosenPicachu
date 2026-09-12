import {within} from '@testing-library/react';

export const folds = (root: HTMLElement): HTMLElement[] =>
  within(root).getAllByRole('group').filter(group => group.tagName === 'DETAILS');

const built = (fold: HTMLElement): boolean => [...fold.children].some(child => child.textContent === 'how we built it');

export const stories = (root: HTMLElement): HTMLElement[] => folds(root).filter(fold => !built(fold));

export const reveals = (root: HTMLElement): HTMLElement[] => folds(root).filter(built);

export const opened = (details: readonly HTMLElement[]): HTMLElement[] => details.filter(fold => fold.hasAttribute('open'));
