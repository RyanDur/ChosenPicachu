import {within} from '@testing-library/react';

export const story = (root: HTMLElement, title: string): HTMLElement =>
  within(root).getByRole('group', {name: title});

export const reveals = (root: HTMLElement): HTMLElement[] =>
  within(root).getAllByRole('group', {name: 'how we built it'});

export const opened = (details: readonly HTMLElement[]): HTMLElement[] => details.filter(fold => fold.hasAttribute('open'));
