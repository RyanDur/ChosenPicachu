import {maybe} from '@ryandur/sand';
import * as schema from 'schemawax';
import {screen} from '@testing-library/react';
import {onTestFinished, vi} from 'vitest';

export type Landing = {where: 'page' | 'main' | 'elsewhere'; x: number; y: number};

const options = schema.object({required: {left: schema.number, top: schema.number}});

const placeOf = ([first, second]: unknown[]): [number, number] | undefined =>
  typeof first === 'number' && typeof second === 'number'
    ? [first, second]
    : maybe(options.decode(first)).map(({left, top}): [number, number] => [left, top]).orElse(undefined);

const whereIs = (scrolled: unknown): Landing['where'] =>
  scrolled === window ? 'page' : scrolled === screen.queryByRole('main') ? 'main' : 'elsewhere';

const recordLandings = (): readonly Landing[] => {
  const landings: Landing[] = [];
  const record = function (this: unknown, ...args: unknown[]): void {
    maybe(placeOf(args)).map(([x, y]) => landings.push({where: whereIs(this), x, y}));
  };
  const page = vi.spyOn(window, 'scrollTo').mockImplementation(record);
  const scrollers = vi.spyOn(Element.prototype, 'scrollTo').mockImplementation(record);
  onTestFinished(() => {
    page.mockRestore();
    scrollers.mockRestore();
  });
  return landings;
};

export const scrolling = {
  recordLandings,
  atTheTop: (where: Landing['where']): Landing => ({where, x: 0, y: 0})
};
