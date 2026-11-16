import type {Locator} from '@playwright/test';
import {Maybe, maybe} from '@ryandur/sand';

export type Box = {x: number; y: number; width: number; height: number};

export const boxOf = async (locator: Locator, unseen = 'the element never stood'): Promise<Box> =>
  maybe(await locator.boundingBox()).either(box => box, () => {
    throw new Error(unseen);
  });

// expect.poll retries only a failed matcher, so a measure it polls answers a value the matcher fails on, never a throw
export const laidOutBoxOf = async (locator: Locator): Promise<Maybe<Box>> => maybe(await locator.boundingBox());
