import {maybe} from '@ryandur/sand';
import * as schema from 'schemawax';

export type Landing = [number, number];

const options = schema.object({optional: {left: schema.number, top: schema.number}});

const landingOf = ([first, second]: unknown[]): Landing | undefined =>
  typeof first === 'number' && typeof second === 'number'
    ? [first, second]
    : maybe(options.decode(first)).map(({left = 0, top = 0}): Landing => [left, top]).orElse(undefined);

export const landingsDuring = async (act: () => Promise<void>): Promise<Landing[]> => {
  const landings: Landing[] = [];
  const record = (...args: unknown[]): void => {
    maybe(landingOf(args)).map(landing => landings.push(landing));
  };
  const page = vi.spyOn(window, 'scrollTo').mockImplementation(record);
  const scroller = vi.spyOn(Element.prototype, 'scrollTo').mockImplementation(record);
  try {
    await act();
  } finally {
    page.mockRestore();
    scroller.mockRestore();
  }
  return landings;
};
