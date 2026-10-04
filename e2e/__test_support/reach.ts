import type {Locator} from '@playwright/test';

export const reachesAcross = async (prose: Locator, container: Locator): Promise<boolean> => {
  const [words, around] = await Promise.all([prose.boundingBox(), container.boundingBox()]);
  return words !== null && around !== null && Math.abs(words.x + words.width - (around.x + around.width)) <= 1;
};
