import {maybe} from '@ryandur/sand';
import * as schema from 'schemawax';
import {screen} from '@testing-library/react';

export type Landing = {where: 'page' | 'main' | 'elsewhere'; x: number; y: number};

const options = schema.object({required: {left: schema.number, top: schema.number}});

const placeOf = ([first, second]: unknown[]): [number, number] | undefined =>
  typeof first === 'number' && typeof second === 'number'
    ? [first, second]
    : maybe(options.decode(first)).map(({left, top}): [number, number] => [left, top]).orElse(undefined);

const whereIs = (scrolled: unknown): Landing['where'] =>
  scrolled === window ? 'page' : scrolled === screen.queryByRole('main') ? 'main' : 'elsewhere';

const landingsDuring = async (act: () => Promise<void>): Promise<Landing[]> => {
  const landings: Landing[] = [];
  const record = function (this: unknown, ...args: unknown[]): void {
    maybe(placeOf(args)).map(([x, y]) => landings.push({where: whereIs(this), x, y}));
  };
  const page = vi.spyOn(window, 'scrollTo').mockImplementation(record);
  const scrollers = vi.spyOn(Element.prototype, 'scrollTo').mockImplementation(record);
  try {
    await act();
  } finally {
    page.mockRestore();
    scrollers.mockRestore();
  }
  return landings;
};

export const scrolling = {
  landingsDuring,
  atTheTop: (where: Landing['where']): Landing => ({where, x: 0, y: 0})
};
