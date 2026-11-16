import type {Locator} from '@playwright/test';
import {maybe} from '@ryandur/sand';

export type Box = {x: number; y: number; width: number; height: number};

export const boxOf = async (locator: Locator, unseen = 'the element never stood'): Promise<Box> =>
  maybe(await locator.boundingBox()).either(box => box, () => {
    throw new Error(unseen);
  });
