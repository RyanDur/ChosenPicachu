import {screen, within} from '@testing-library/react';

const concern = (name: string): HTMLElement => screen.getByRole('region', {name});

const essayOf = (name: string): HTMLElement[] => {
  const asides = [
    within(concern(name)).getByRole('blockquote'),
    within(concern(name)).getByRole('region', {name: `${name} from the record`})
  ];
  return within(concern(name)).getAllByRole('paragraph').filter(paragraph => !asides.some(aside => aside.contains(paragraph)));
};

export const homePage = {
  essay: (name: string): string[] => essayOf(name).map(paragraph => paragraph.textContent ?? ''),
  essayOpening: (name: string): HTMLElement => essayOf(name)[0],
  quotations: (name: string, quoted: string): HTMLElement[] => within(concern(name)).getAllByRole('link', {name: quoted})
};
